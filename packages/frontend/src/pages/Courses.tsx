import { useState } from "react";
import Modal from "react-modal";
import Navbar from "../components/Navbar";
import Course from "../components/Course";
import Title from "../components/Title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faX } from "@fortawesome/free-solid-svg-icons";
import { TextField } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function Courses() {
  const courses = [
    {
      id: "1",
      code: "ITCS448",
      name: "Cloud Computing",
    },
    {
      id: "2",
      code: "ITCS441",
      name: "Parallel and Distributed Systems",
    },
    {
      id: "3",
      code: "ITCS440",
      name: "Intelligent Systems",
    },
    {
      id: "4",
      code: "ITCS496",
      name: "Physical Implementation of DBMS",
    },
    {
      id: "5",
      code: "ITCS444",
      name: "Mobile Application",
    },
    {
      id: "6",
      code: "ITCS453",
      name: "Multimedia",
    },
  ];

  return (
    <>
      <Navbar />

      <Title title={["My Courses"]} />

      <div className="courses-container">
        {courses.map((c) => (
          <Course id={c.id} code={c.code} name={c.name} />
        ))}
        <CreateCourse />
      </div>
    </>
  );
}

function CreateCourse() {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <div className="course-container create" onClick={openModal}>
        <FontAwesomeIcon
          icon={faBook}
          style={{ color: "white", width: "3rem", height: "3rem" }}
        />
        <h3>CREATE COURSE +</h3>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={bg}
      >
        <div className="x">
          <FontAwesomeIcon
            icon={faX}
            onClick={closeModal}
            className="x-icon"
            size="xl"
            style={{ color: "#C7C7C7" }}
          />
        </div>
        <div className="modal-content">
          <h1>Create a New Course</h1>
          <form>
            <div className="input-container">
              <TextField
                label="Course Code"
                name="courseCode"
                placeholder="ITCS444"
                inputStyles={{
                  backgroundColor: "white",
                  width: "30rem",
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
              />
              <button className="next">Create</button>
            </div>
          </form>
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
