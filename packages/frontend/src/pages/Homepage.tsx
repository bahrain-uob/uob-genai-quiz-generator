import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faBook,
  faFileLines,
  faFilePen,
  faFolder,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { StorageManager } from "@aws-amplify/ui-react-storage";
import Modal from "react-modal";
// import { TextField } from "@aws-amplify/ui-react";
import Carousel from "../components/Carousel";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Link } from "react-router-dom";
import { Container } from "tsparticles-engine";
import Navbar from "../components/Navbar";
import { useCallback, useEffect, useState } from "react";
import { getUserId } from "../lib/helpers";
import { useAtom } from "jotai";
import { coursesAtom } from "../lib/store";

function Homepage() {
  // const [modalIsOpen, setIsOpen] = useState(false);
  const [UploadModalIsOpen, setUploadModalIsOpen] = useState(false);

  const [userId, setUserId] = useState("");
  useEffect(() => {
    getUserId(setUserId);
  }, []);

  const [courses, _setCourses] = useAtom(coursesAtom);
  const [course_id, setCourse_id] = useState("");

  function handleChange(event: any) {
    const id = event.target.value;
    setCourse_id(id);
  }

  // const [courses, setCourses] = useAtom(coursesAtom);
  // useEffect(() => {
  //   updateCourses();
  // }, []);

  // const updateCourses = async () => {
  //   let courses = await API.get("api", "/courses", {});
  //   setCourses(courses);
  // };
  // const [code, setCode] = useState("");
  // const [name, setName] = useState("");
  // const createCourse = async () => {
  //   API.post("api", "/courses", {
  //     body: { code, name },
  //   }).then(updateCourses);
  // };

  // function openModal() {
  //   setIsOpen(true);
  // }
  // function closeModal() {
  //   setIsOpen(false);
  // }
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
      <Navbar active="home" />
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

            {/* <div className="access-item" onClick={openModal}>
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
              ariaHideApp={false}
            >
              <div className="x">
                <FontAwesomeIcon
                  icon={faX}
                  onClick={closeModal}
                  className="x-icon"
                  size="xl"
                  style={{ color: "#5c617f" }}
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
                        boxShadow: "1px 1px 5px #c9c9c9",
                        borderRadius: "15px",
                        border: "none",
                      }}
                      // onChange={(e) => {
                      //   setCode(e.target.value);
                      // }}
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
                        boxShadow: "1px 1px 5px #c9c9c9",
                        borderRadius: "15px",
                        border: "none",
                      }}
                      // onChange={(e) => {
                      //   setName(e.target.value);
                      // }}
                    />
                  </div>
                  <button className="next">Create</button>
                </form>
              </div>
            </Modal> */}

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
                  style={{ color: "#5c617f" }}
                />
              </div>
              <div className="modal-content">
                <h1>Upload Course Content</h1>
                <form>
                  <div className="select-container">
                    {/* <label htmlFor="course">Select a Course</label> */}
                    <select name="course" onChange={(e) => handleChange(e)}>
                      <option style={{ fontSize: "medium" }}>
                        select a course
                      </option>
                      {courses.map((course: any) => (
                        <option id={course.id} value={course.id}>
                          {course.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <StorageManager
                    maxFileCount={5}
                    accessLevel="public"
                    path={`${userId}/${course_id}/materials/`}
                  />
                </form>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

const bg = {
  content: {
    background: "#f5efec",
    borderRadius: "15px",
    border: "none",
  },
};
export default Homepage;
