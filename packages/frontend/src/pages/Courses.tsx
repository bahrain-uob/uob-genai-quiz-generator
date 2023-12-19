import { useEffect, useState } from "react";
import Modal from "react-modal";
import Navbar from "../components/Navbar";
import Course from "../components/Course";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faX } from "@fortawesome/free-solid-svg-icons";
import { TextField } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { coursesAtom, navAtom } from "../lib/store";
import { useAtom, useSetAtom } from "jotai";
import emptycourses from "../assets/empty_courses-ts-comp.svg";

function Courses() {
  const [courses, setCourses] = useAtom(coursesAtom);
  useEffect(() => {
    updateCourses();
  }, []);

  const updateCourses = async () => {
    let courses = await API.get("api", "/courses", {});
    setCourses(courses);
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
      <Navbar active="courses" />

      {courses.length == 0 && (
        <div className="empty-courses">
          <div className="shape-1"></div>
          <div className="empty-card">
            <img src={emptycourses} alt="umbrella" width="230px" />
            <h2>Nothing to see here!</h2>
            <p>You're not currently enrolled in any courses</p>
            <div className="wrapper">
              <div className="link_wrapper">
                <CreateCourse isempty={true} updateCourses={updateCourses} />
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
            {/* <button>create a course</button> */}
          </div>
        </div>
      )}
      {courses.length > 0 && (
        <div className="courses-container">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => {
                navigate(course.id, course.code, course.name);
              }}
            >
              <Course id={course.id} code={course.code} name={course.name} />
            </div>
          ))}
          <CreateCourse isempty={false} updateCourses={updateCourses} />
        </div>
      )}
    </>
  );
}

function CreateCourse(props: { updateCourses: any; isempty: boolean }) {
  const [modal, setModal] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const createCourse = async () => {
    setModal(false);
    API.post("api", "/courses", {
      body: { code, name },
    }).then(props.updateCourses);
  };

  return (
    <>
      {!props.isempty ? (
        <div className="create" onClick={() => setModal(true)}>
          <FontAwesomeIcon
            icon={faBook}
            style={{ color: "#4a4e69", width: "3rem", height: "3rem" }}
          />
          <h4>Create Course </h4>
        </div>
      ) : (
        <a href="#" onClick={() => setModal(true)}>
          Create a course
        </a>
      )}
      <Modal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={bg}
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="x">
            <FontAwesomeIcon
              icon={faX}
              onClick={() => setModal(false)}
              className="x-icon"
              size="xl"
              style={{ color: "#5c617f" }}
            />
          </div>
          <h1>Create a New Course</h1>
          <div className="input-container">
            <TextField
              label="Course Code"
              name="courseCode"
              placeholder="ITCS444"
              inputStyles={{
                backgroundColor: "white",
                width: "70%",
                boxShadow: "1px 1px 5px #c9c9c9",
                borderRadius: "15px",
                border: "none",
              }}
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
          </div>
          <div className="input-container">
            <TextField
              label="Course Name"
              name="courseName"
              placeholder="Mobile Application"
              inputStyles={{
                backgroundColor: "white",
                width: "70%",
                boxShadow: "1px 1px 5px #c9c9c9",
                borderRadius: "15px",
                border: "none",
              }}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <button className="next" onClick={createCourse}>
              Create
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
const bg = {
  content: {
    background: "transparent",
    borderRadius: "15px",
    border: "none",
  },
};
export default Courses;
