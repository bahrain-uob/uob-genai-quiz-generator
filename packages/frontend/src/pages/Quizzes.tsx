import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navrbar from "../components/Navbar";
import {
  faCircleInfo,
  faDownload,
  faList,
  faPlay,
  faRectangleList,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import { useEffect, useState, cloneElement } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  Course,
  FillBlank,
  Mcq,
  Tf,
  coursesAtom,
  navAtom,
  quizzesAtom,
} from "../lib/store";
import { clearQuiz, getUserId, isEqual } from "../lib/helpers";
import { Storage } from "aws-amplify";
import { useImmerAtom } from "jotai-immer";
import { exportKahoot, exportMarkdown } from "../lib/export";
import coolkid from "../assets/Cool Kids - Alone Time.svg";
import Modal from "react-modal";
import "../quiz.css";
import { exportMoodle } from "../lib/export";

function Quizzes() {
  const [courses, setCourses] = useAtom(coursesAtom);
  const [quizzes, setQuizzes] = useImmerAtom(quizzesAtom);

  useEffect(() => {
    updateCourses();
  }, []);
  useEffect(() => {
    updateQuizzes();
  }, [courses]);

  const updateCourses = async () => {
    let updatedCourses = await API.get("api", "/courses", {});
    if (!isEqual(courses, updatedCourses)) setCourses(updatedCourses);
  };

  const updateQuizzes = async () => {
    if (courses.length == 0) return;

    let userId = await getUserId();
    for (let course of courses) {
      let { results } = await Storage.list(`${userId}/${course.id}/quizzes/`, {
        pageSize: 1000,
      });
      const prefix_len =
        userId.length + course.id.length + "quizzes".length + "///".length;
      let quizList = results
        .filter((r) => r.key!.length != prefix_len)
        .map((r) => {
          return {
            name: r.key!.slice(prefix_len, r.key!.length - ".json".length),
            date: r.lastModified!.toLocaleDateString("en-GB"),
          };
        });
      if (!isEqual(quizzes[course.id], quizList)) {
        setQuizzes((draft) => {
          draft[course.id] = quizList;
        });
      }
    }
  };

  const navigation = useNavigate();
  const setNav = useSetAtom(navAtom);
  function navigate(
    course_id: string,
    course_code: string,
    course_name: string
  ) {
    setNav({ course_id, course_code, course_name });
    navigation("/materials");
  }

  return (
    <>
      <Navrbar active="quizzes" />
      {courses.length > 0 ? (
        <>
          <div className="top-quizzes">
            <Link style={{ marginLeft: "auto" }} to="/createquiz">
              <button onClick={clearQuiz} className="generate-button">
                Generate Quiz
              </button>
            </Link>
          </div>
          <div className="container">
            {courses.map((course: Course) => (
              <div key={course.id} className="course-quiz-container">
                <h2
                  className="underlined"
                  onClick={() => {
                    navigate(course.id, course.code, course.name);
                  }}
                >
                  {`${course.code}  - ${course.name}`}
                </h2>
                {(quizzes[course.id] ?? []).length > 0 ? (
                  <div className="quizzes-container">
                    {(quizzes[course.id] ?? []).map((quiz: any) => (
                      <Quiz
                        key={`${course.id}${quiz.name}`}
                        name={quiz.name}
                        courseId={course.id}
                        date={quiz.date}
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <div>
                      <img src={coolkid} alt="coolkid" width="300px" />
                      <h4>Nothing to see here!</h4>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-courses" style={{ backgroundColor: "#f2e9e4" }}>
          <div className="empty-card">
            <img src={coolkid} alt="coolkid" width="300px" />
            <h2>Nothing to see here!</h2>
            <p>
              You don't have any quizzes because you're not currently enrolled
              in any courses
            </p>
            <div className="wrapper">
              <div className="link_wrapper">
                <a href="/courses">Create a course</a>
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 268.832 268.832"
                  >
                    <path d="M134.416 40.832v187.168c0 6.903 5.597 12.5 12.5 12.5s12.5-5.597 12.5-12.5V40.832c0-6.903-5.597-12.5-12.5-12.5s-12.5 5.597-12.5 12.5z" />
                    <path d="M228.416 134.832H40.248c-6.903 0-12.5 5.597-12.5 12.5s5.597 12.5 12.5 12.5h188.168c6.903 0 12.5-5.597 12.5-12.5s-5.597-12.5-12.5-12.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const Dropdown = (props: { trigger: any; menu: any[] }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <div className="dropdown">
      {cloneElement(props.trigger, {
        onClick: handleOpen,
      })}
      {open ? (
        <ul className="menu">
          {props.menu.map((menuItem, index) => (
            <li key={index} className="menu-item">
              {cloneElement(menuItem, {
                onClick: () => {
                  menuItem.props.onClick();
                  setOpen(false);
                },
              })}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

function FillBlankQuestion(props: {
  question: string;
  answer: string;
  list: string;
}) {
  return (
    <>
      {props.list == "rec" && (
        <div className="quiz-question fill">
          <Spirals />
          <div className="spiral-4"></div>
          <h4>{props.question}</h4>
          <div className="answers-container">
            <p className="correct-ans">{props.answer}</p>
          </div>
        </div>
      )}

      {props.list == "norm" && (
        <div className="norm-question">
          <h4>Q: {props.question}</h4>
          <div className="answers-container">
            <p>Answer: {String(props.answer)}</p>
          </div>
        </div>
      )}
    </>
  );
}

function McqQuestion(props: {
  question: string;
  choices: string[];
  ans_index: number;
  list: string;
}) {
  console.log("HEER");
  console.log(props.ans_index);
  return (
    <>
      {props.list == "rec" && (
        <div className="quiz-question mcq">
          <Spirals />
          <div className="spiral-4"></div>
          <h4>{props.question}</h4>
          <div className="answers-container">
            {props.choices.map((choice, index) => (
              <p className={props.ans_index == index ? "correct-ans" : ""}>
                {choice}
              </p>
            ))}
          </div>
        </div>
      )}

      {props.list == "norm" && (
        <div className="norm-question">
          <h4>Q: {props.question}</h4>
          <div className="answers-container">
            {props.choices.map((choice, index) => (
              <p>{`${index + 1}) ${choice}`}</p>
            ))}
            <p>
              {`Answer:    
              ${String(props.choices[props.ans_index])}`}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function TfQuestion(props: {
  question: string;
  answer: boolean;
  list: string;
}) {
  console.log(props);
  return (
    <>
      {props.list == "rec" && (
        <div className="quiz-question tf">
          <Spirals />
          <div className="spiral-4"></div>
          <h4>{props.question}</h4>
          <div className="answers-container">
            <p className={props.answer == true ? "correct-ans" : ""}>True</p>
            <p className={props.answer == false ? "correct-ans" : ""}>False</p>
          </div>
        </div>
      )}
      {props.list == "norm" && (
        <div className="norm-question">
          <h4>Q: {props.question}</h4>
          <div className="answers-container">
            <p>A) True</p>
            <p>B) False</p>
            <p>Answer: {String(props.answer)}</p>
          </div>
        </div>
      )}
    </>
  );
}

function Spirals() {
  return (
    <>
      <div className="spiral-1"></div>
      <div className="spiral-2"></div>
      <div className="spiral-3"></div>
    </>
  );
}

function Quiz(props: { name: string; courseId: string; date: string }) {
  const [modal, setModal] = useState(false);
  const [checked, setChecked] = useState("norm");
  const [quiz, setQuiz] = useState(null as any);

  useEffect(() => {
    const fn = async () => {
      const userId = await getUserId();
      const key = `${userId}/${props.courseId}/quizzes/${props.name}.json`;
      const response = await Storage.get(key, { download: true });
      const fetchedQuiz = JSON.parse(await response.Body!.text());
      console.log(fetchedQuiz);
      setQuiz(fetchedQuiz);
    };
    fn();
  }, []);

  if (!quiz) {
    return <></>;
  }

  return (
    <>
      <div className="quiz-item" onClick={() => setModal(true)}>
        <Spirals />
        <div className="lines"></div>
        <p className="quiz-name">{props.name}</p>
        <div className="information">
          <FontAwesomeIcon
            className="info-icon"
            icon={faCircleInfo}
            size="lg"
            style={{ color: "white" }}
          />
          <div className="contents">
            <p>Generated on {props.date}</p>
            <span onClick={() => setModal(true)}>Click to view quiz</span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={bg}
        ariaHideApp={false}
      >
        <div className="quiz-header">
          <div className="top-box">
            <div className="close" onClick={() => setModal(false)}>
              <p>close</p>
            </div>
            <h1 className="quiz-name">{quiz.name}</h1>
          </div>
          <div className="actions-menu">
            <button className="play-caraval">
              <FontAwesomeIcon icon={faPlay} /> Play Caraval
            </button>
            <Dropdown
              trigger={
                <button>
                  <FontAwesomeIcon
                    icon={faDownload}
                    className="download-icon"
                    size="lg"
                  />
                </button>
              }
              menu={[
                <button onClick={() => exportKahoot(quiz)}>
                  Export to Kahoot
                </button>,
                <button onClick={() => exportMarkdown(quiz)}>
                  Export to Text
                </button>,
                <button onClick={() => exportMoodle(quiz)}>
                  Export to Moodle
                </button>,
              ]}
            />
          </div>
        </div>
        <div className="list-options">
          <FontAwesomeIcon
            onClick={() => setChecked("rec")}
            icon={faRectangleList}
            size="lg"
            className={`rec-list ${checked == "rec" ? "checked" : ""}`}
          />
          <FontAwesomeIcon
            onClick={() => setChecked("norm")}
            icon={faList}
            size="lg"
            className={`norm-list ${checked == "norm" ? "checked" : ""}`}
          />
        </div>
        <div className={checked == "norm" ? "" : "quiz-questions"}>
          <div className={checked == "norm" ? "" : "quiz-questions type"}>
            {checked == "rec" && <h1>True/False</h1>}
            {quiz.TfArr.map((question: Tf) => (
              <TfQuestion
                question={question.question}
                answer={question.answer}
                list={checked}
              />
            ))}
          </div>
          <div className={checked == "norm" ? "" : "quiz-questions type"}>
            {checked == "rec" && <h1>MCQ</h1>}
            {quiz.mcqArr.map((question: Mcq) => (
              <McqQuestion
                question={question.question}
                choices={question.choices}
                ans_index={question.answer_index}
                list={checked}
              />
            ))}
          </div>
          <div className={checked == "norm" ? "" : "quiz-questions type"}>
            {checked == "rec" && <h1>Fill-in Blank</h1>}
            {quiz.fibArr.map((question: FillBlank) => (
              <FillBlankQuestion
                question={question.question}
                answer={question.answer}
                list={checked}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
const bg = {
  content: {
    background: "white",
    borderRadius: "15px",
    border: "none",
  },
};
export { Spirals };
export default Quizzes;
