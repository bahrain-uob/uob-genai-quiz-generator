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
import Carousel from "../components/Carousel";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import { useCallback, useState } from "react";
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

  const particlesInit = async (main: any) => {
    console.log(main);

    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };
  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await console.log(container);
    },
    []
  );
  return (
    <>
      <Navbar />
      <div className="homepage-container">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: "white",
              },
            },
            fullScreen: {
              zIndex: -1,
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#4a4e699c",
              },
              links: {
                color: "#4a4e699c",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 6,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            detectRetina: true,
          }}
        />

        <h2>Start creating your quizzes with just four steps</h2>
        <div className="background-carousel">
          <Carousel />
        </div>

        <div className="quick-access">
          <div className="access-cards">
            <Link
              to="/createquiz"
              style={{ color: "white" }}
              className="access-item"
            >
              <div>
                <FontAwesomeIcon
                  icon={faFilePen}
                  size="4x"
                  style={{ color: "white" }}
                />

                <p>GENERATE QUIZ</p>
              </div>
            </Link>

            <Link
              to="/quizzes"
              style={{ color: "white" }}
              className="access-item"
            >
              <div>
                <FontAwesomeIcon
                  icon={faFileLines}
                  size="4x"
                  style={{ color: "white" }}
                />

                <p>MY QUIZZES</p>
              </div>
            </Link>

            <div className="access-item" onClick={openModal}>
              <FontAwesomeIcon
                icon={faBook}
                size="4x"
                style={{ color: "white" }}
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
                style={{ color: "white" }}
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
                    {/* <Upload /> */}
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
import { Container } from "tsparticles-engine";

function Navbar() {
  const { signOut } = useAuthenticator((context) => [context.signOut]);
  return (
    <div className="nav">
      <nav style={{ backgroundColor: "white" }}>
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
            <p>HOME</p>
          </a>
          <a href="/courses">
            <p>COURSES</p>
          </a>
          <a href="/quizzes">
            <p>QUIZZES</p>
          </a>
          <a href="/createquiz">
            <p>CREATE QUIZ</p>
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
  // overlay: {
  //   top: 40,
  //   left: 280,
  //   right: 280,
  //   bottom: 40,
  //   background: "rgba(245, 39, 145, 0)",
  // },
};
export default Homepage;
