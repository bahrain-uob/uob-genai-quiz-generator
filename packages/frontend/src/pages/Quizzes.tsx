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
      // @ts-ignore
      if (!isEqual(quizzes[course.id], quizList)) {
        setQuizzes((draft) => {
          // @ts-ignore
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
      <div className="top-quizzes">
        <Link style={{ marginLeft: "auto" }} to="/createquiz">
          <button className="generate-button">Generate Quiz</button>
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
            <div className="quizzes-container">
              {/* @ts-ignore */}
              {(quizzes[course.id] ?? []).map((quiz: any) => (
                <Quiz
                  onClick={() => exportQuiz(course.id, quiz.name)}
                  key={`${course.id}${quiz.name}`}
                  name={quiz.name}
                  date={quiz.date}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
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
