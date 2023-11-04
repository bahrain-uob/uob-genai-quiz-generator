import { useEffect, useState } from "react";
import Modal from "react-modal";
import Navbar from "../components/Navbar";
import Course from "../components/Course";
import Title from "../components/Title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faX } from "@fortawesome/free-solid-svg-icons";
import { TextField } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { navAtom } from "../lib/navStore";
import { useAtom } from "jotai";

interface Course {
  id: string;
  code: string;
  name: string;
}

function Courses() {
  const [courses, setCourses] = useState([] as Course[]);
  useEffect(() => {
    updateCourses();
  }, []);

  const updateCourses = async () => {
    let courses = await API.get("api", "/courses", {});
    setCourses(courses);
  };

  const navigation = useNavigate();
  const [_, setNav] = useAtom(navAtom);
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
      <Navbar />
      <Title title={["My Courses"]} />
      <div className="courses-container">
        {courses.map((course) => (
          <div
            onClick={() => {
              navigate(course.id, course.code, course.name);
            }}
          >
            <Course id={course.id} code={course.code} name={course.name} />
          </div>
        ))}
        <CreateCourse updateCourses={updateCourses} />
      </div>
    </>
  );
}

function CreateCourse({ updateCourses }: any) {
  const [modal, setModal] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const createCourse = async () => {
    setModal(false);
    API.post("api", "/courses", {
      body: { code, name },
    }).then(updateCourses);
  };

  return (
    <>
      <div className="course-container create" onClick={() => setModal(true)}>
        <FontAwesomeIcon
          icon={faBook}
          style={{ color: "white", width: "3rem", height: "3rem" }}
        />
        <h3>CREATE COURSE +</h3>
      </div>
      <Modal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={bg}
        ariaHideApp={false}
      >
        <div className="x">
          <FontAwesomeIcon
            icon={faX}
            onClick={() => setModal(false)}
            className="x-icon"
            size="xl"
            style={{ color: "#C7C7C7" }}
          />
        </div>
        <div className="modal-content">
          <h1>Create a New Course</h1>
          <div className="input-container">
            <TextField
              label="Course Code"
              name="courseCode"
              placeholder="ITCS444"
              inputStyles={{
                backgroundColor: "white",
                width: "30rem",
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
                width: "30rem",
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
    background: "#F5F5F5",
  },
  // overlay: {
  //   top: 50,
  //   left: 280,
  //   right: 280,
  //   bottom: 50,
  //   background: "rgba(245, 39, 145, 0)",
  // },
};
export default Courses;
