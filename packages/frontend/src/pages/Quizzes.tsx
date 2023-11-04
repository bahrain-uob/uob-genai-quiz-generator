import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navrbar from "../components/Navbar";
import Title from "../components/Title";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";

interface Course {
  id: string;
  code: string;
  name: string;
}

function Quizzes() {
  const [courses, setCourses] = useState([] as Course[]);
  useEffect(() => {
    updateCourses();
  }, []);

  const updateCourses = async () => {
    let courses = await API.get("api", "/courses", {});
    setCourses(courses);
  };

  const nav = useNavigate();
  function navigate(
    course_id: string,
    course_code: string,
    course_name: string
  ) {
    localStorage.setItem("courseId", course_id);
    localStorage.setItem("courseCode", course_code);
    localStorage.setItem("courseName", course_name);
    nav("/materials");
  }
  return (
    <>
      <Navrbar />
      <div className="top-quizzes">
        <Title title={["My Quizzes"]} />
        <Link style={{ marginLeft: "auto" }} to="/createquiz">
          <button className="generate-button">Generate Quiz</button>
        </Link>
      </div>

      <div className="container">
        {courses.map((course) => (
          <div className="course-quiz-container">
            <h2
              className="underlined"
              onClick={() => {
                navigate(course.id, course.code, course.name);
              }}
            >
              {`${course.code}  - ${course.name}`}
            </h2>

            <div className="quizzes-container">
              <Quiz name="Quiz 1" date="18th Oct 2023" />
              <Quiz name="Quiz 2" date="18th Oct 2023" />
              <Quiz name="Quiz 3" date="18th Oct 2023" />
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
function Quiz(props: { name: String; date: String }) {
  return (
    <div className="quiz-item">
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
