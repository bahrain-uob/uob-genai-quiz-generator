import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navrbar from "../components/Navbar";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { Course, coursesAtom, navAtom, quizzesAtom } from "../lib/store";
import { getUserId, isEqual } from "../lib/helpers";
import { Storage } from "aws-amplify";
import { useImmerAtom } from "jotai-immer";
import { exportKahoot } from "../lib/export";
import coolkid from "../assets/Cool Kids - Alone Time.svg";

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

  const exportQuiz = async (courseId: string, name: string) => {
    const userId = await getUserId();
    const key = `${userId}/${courseId}/quizzes/${name}.json`;
    const result = await Storage.get(key, {
      download: true,
      cacheControl: "no-cache",
    });
    const quizFile = JSON.parse(await result.Body!.text());
    exportKahoot(quizFile);
  };

  const navigation = useNavigate();
  const setNav = useSetAtom(navAtom);
  function navigate(
    course_id: string,
    course_code: string,
    course_name: string,
  ) {
    setNav({ course_id, course_code, course_name });
    navigation("/materials");
  }

  return (
    <>
      <Navrbar active="quizzes" />
      {courses.length > 0 ? (
        <div className="top-quizzes">
          <Link style={{ marginLeft: "auto" }} to="/createquiz">
            <button className="generate-button">Generate Quiz</button>
          </Link>
        </div>
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

      {courses.length > 0 && (
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
                      onClick={() => exportQuiz(course.id, quiz.name)}
                      key={`${course.id}${quiz.name}`}
                      name={quiz.name}
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

function Quiz(props: { name: string; date: string; onClick: any }) {
  return (
    <div onClick={props.onClick} className="quiz-item">
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
          <span>Click for more details</span>
        </div>
      </div>
    </div>
  );
}

export { Spirals };
export default Quizzes;
