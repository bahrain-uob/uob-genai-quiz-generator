import { useEffect, useState } from "react";
import Titles from "../components/Title";
import Navbar from "../components/Navbar";
import StepProgressBar from "../components/StepProgressBar";
import MaterialsTable from "../components/MaterialsTable";
import QuizSetupForm from "../components/QuizSetup";
import QuestionsSetup from "../components/QuestionsSetup";
import { API } from "aws-amplify";

function Quizzes() {
  const [stepNo, setStepNo] = useState(0);

  const courseId = localStorage.getItem("courseId")!;
  return (
    <>
      <Navbar />
      <div className="context">
        <Titles title={["Create Quiz"]} />
      </div>
      <StepProgressBar stepNo={stepNo} />
      <div className="step-container">
        {stepNo == 0 && <CoursesTable />}
        {stepNo == 1 && (
          <MaterialsTable courseId={courseId} isSelecting={true} />
        )}
        {stepNo == 2 && <QuizSetupForm />}
        {stepNo == 3 && <QuestionsSetup />}
        {stepNo == 4 && <h1>review</h1>}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {stepNo > 0 && (
          <button
            className="previous"
            onClick={() => {
              setStepNo(stepNo - 1);
            }}
          >
            Back
          </button>
        )}
        {stepNo < 4 && (
          <button className="next" onClick={() => setStepNo(stepNo + 1)}>
            Next
          </button>
        )}
      </div>
    </>
  );
}

interface Course {
  id: string;
  code: string;
  name: string;
}
function CoursesTable() {
  const [courses, setCourses] = useState([] as Course[]);
  useEffect(() => {
    updateCourses();
  }, []);

  const updateCourses = async () => {
    let courses = await API.get("api", "/courses", {});
    setCourses(courses);
  };

  function selectCourse(courseId: string) {
    localStorage.setItem("courseId", courseId);
  }
  return (
    <>
      <div className="courses-table">
        <table>
          <thead>
            <tr className="heading">
              <th></th>
              <th>COURSE CODE</th>
              <th>COURSE NAME</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="radio"
                    name="course"
                    style={{ width: "20px", height: "20px" }}
                    onClick={() => selectCourse(course.id)}
                  />
                </td>
                <td>{course.code}</td>
                <td>{course.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Quizzes;
export { CoursesTable };
