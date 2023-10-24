import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faFileLines,
  faFilePen,
  faFolder,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { TextField, useAuthenticator } from "@aws-amplify/ui-react";
import Upload from "../components/Upload";

import { useState } from "react";
function Homepage() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [UploadModalIsOpen, setUploadModalIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  function openUploadModal() {
    setUploadModalIsOpen(true);
  }
  function closeUploadModal() {
    setUploadModalIsOpen(false);
  }
  return (
    <>
      <Navbar />
      <div className="homepage-container">
        <h2>
          EduCraft AI Creates captivating quizzes effortlessly with just a few
          clicks!
        </h2>
        <div className="stepper-wrapper">
          <div className="stepper-item active">
            <div className="step-counter"></div>
            <div className="step-name">Select Course</div>
          </div>
          <div className="stepper-item active">
            <div className="step-counter"></div>
            <div className="step-name">Select Material</div>
          </div>
          <div className="stepper-item active">
            <div className="step-counter"></div>
            <div className="step-name">Quiz Setup</div>
          </div>
          <div className="stepper-item active">
            <div className="step-counter"></div>
            <div className="step-name">Questions Setup</div>
          </div>
        </div>
        <div className="quick-access">
          <h2>Quick Access</h2>
          <div className="access-cards">
            <div className="access-item">
              <Link to="/createquiz" style={{ color: "black" }}>
                <FontAwesomeIcon
                  icon={faFilePen}
                  size="4x"
                  style={{ color: "#00000077" }}
                />

                <p>GENERATE QUIZ</p>
              </Link>
            </div>

            <div className="access-item">
              <Link to="/quizzes" style={{ color: "black" }}>
                <FontAwesomeIcon
                  icon={faFileLines}
                  size="4x"
                  style={{ color: "#00000077" }}
                />

                <p>MY QUIZZES</p>
              </Link>
            </div>

            <div className="access-item" onClick={openModal}>
              <FontAwesomeIcon
                icon={faBook}
                size="4x"
                style={{ color: "#00000077" }}
              />
              <p>CREATE COURSE</p>
            </div>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Create Course Modal"
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
                  </div>
                  <button className="next">Create</button>
                </form>
              </div>
            </Modal>

            <div className="access-item" onClick={openUploadModal}>
              <FontAwesomeIcon
                icon={faFolder}
                size="4x"
                style={{ color: "#00000077" }}
              />
              <p>UPLOAD MATERIAL</p>
            </div>
            <Modal
              isOpen={UploadModalIsOpen}
              onRequestClose={closeUploadModal}
              contentLabel="Upload Material Modal"
              style={bg}
            >
              <div className="x">
                <FontAwesomeIcon
                  icon={faX}
                  onClick={closeUploadModal}
                  className="x-icon"
                  size="xl"
                  style={{ color: "#C7C7C7" }}
                />
              </div>
              <div className="modal-content">
                <h1>Upload Course Content</h1>
                <form>
                  <div className="select-container">
                    <label htmlFor="course">Select a Course</label>
                    <select style={{ width: "20rem" }} name="course">
                      <option value="ITCS444">ITCS444</option>
                      <option value="ITCS453">ITCS453</option>
                      <option value="ITCS441">ITCS441</option>
                      <option value="ITCS440">ITCS440</option>
                    </select>
                  </div>
                  <div
                    style={{
                      height: "200px",
                    }}
                  >
                    <Upload />
                  </div>
                  <div className="input-container"></div>
                  <button className="next">Upload</button>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

import Logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";

function Navbar() {
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  return (
    <div>
      <nav>
        <div className="top-navbar">
          <a href="/">
            <div className="logo">
              <img src={Logo} alt="logo" />
            </div>
          </a>

          <a onClick={signOut}>
            <p>SIGN OUT</p>
          </a>
        </div>

        <div className="links homepage">
          <a href="/">
            {" "}
            <p>HOME</p>{" "}
          </a>
          <a href="/courses">
            {" "}
            <p>COURSES</p>{" "}
          </a>
          <a href="/dashboard">
            {" "}
            <p>DASHBOARD</p>{" "}
          </a>
          <a href="/quizzes">
            {" "}
            <p>QUIZZES</p>{" "}
          </a>
          <a href="/materials">
            {" "}
            <p>MATERIALS</p>{" "}
          </a>
        </div>
      </nav>
    </div>
  );
}

const bg = {
  content: {
    background: "#F5F5F5",
  },
  overlay: {
    top: 40,
    left: 280,
    right: 280,
    bottom: 40,
    background: "rgba(245, 39, 145, 0)",
  },
};
export default Homepage;
