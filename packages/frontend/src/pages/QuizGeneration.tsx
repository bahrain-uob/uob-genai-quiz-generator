import { useEffect } from "react";
import Titles from "../components/Title";
import Navbar from "../components/Navbar";
import StepProgressBar from "../components/StepProgressBar";
import MaterialsTable from "../components/MaterialsTable";
import QuizSetupForm from "../components/QuizSetup";
import QuestionsSetup from "../components/QuestionsSetup";
import Review from "../components/Review";
import { API } from "aws-amplify";
import { useAtom } from "jotai";
import { coursesAtom, stageAtom } from "../lib/store";

function Quizzes() {
  const [stepNo, setStepNo] = useAtom(stageAtom);

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
        {stepNo == 4 && <Review />}
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
          <button
            className="next"
            onClick={() => {
              setStepNo(stepNo + 1);
            }}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
}

function CoursesTable() {
  const [courses, setCourses] = useAtom(coursesAtom);

  useEffect(() => {
    updateCourses();
  }, []);

  const updateCourses = async () => {
    let courses = await API.get("api", "/courses", {});
    setCourses(courses);
  };

  function selectCourse(courseId: string) {
    localStorage.setItem("courseId", courseId);
    (document.getElementById(courseId) as any).checked = true;
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
              <tr onClick={() => selectCourse(course.id)}>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="radio"
                    name="course"
                    style={{ width: "20px", height: "20px" }}
                    id={course.id}
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
