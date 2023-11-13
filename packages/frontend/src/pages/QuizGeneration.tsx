import { useEffect } from "react";
import Navbar from "../components/Navbar";
import StepProgressBar from "../components/StepProgressBar";
import MaterialsTable from "../components/MaterialsTable";
import QuizSetupForm from "../components/QuizSetup";
import McqQuestionsSetup from "../components/McqQuestionsSetup";
import Review from "../components/Review";
import { API } from "aws-amplify";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { coursesAtom, quizAtom, stageAtom } from "../lib/store";
import TfQuestionsSetup from "../components/TfQuestionsSetup";
import FillBlankQuestionsSetup from "../components/FillBlankQuestionsSetup";
import elephant from "../assets/Little Elephant.svg";

const courseIdAtom = focusAtom(quizAtom, (optic) => optic.prop("courseId"));

function Quizzes() {
  const [stepNo, setStepNo] = useAtom(stageAtom);
  const courseId = useAtomValue(courseIdAtom);

  return (
    <>
      <Navbar active="createquiz" />
      <div className="context"></div>
      <StepProgressBar stepNo={stepNo} />
      <div className="step-container">
        {stepNo == 0 && <CoursesTable />}
        {stepNo == 1 && (
          <MaterialsTable courseId={courseId} isSelecting={true} />
        )}
        {stepNo == 2 && <QuizSetupForm />}
        {stepNo == 3 && <McqQuestionsSetup />}
        {stepNo == 4 && <TfQuestionsSetup />}
        {stepNo == 5 && <FillBlankQuestionsSetup />}
        {stepNo == 6 && <Review />}
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
        {stepNo < 6 && (
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

const quizMaterialsAtom = focusAtom(quizAtom, (optic) =>
  optic.prop("materials")
);

function CoursesTable() {
  const [courses, setCourses] = useAtom(coursesAtom);
  const [courseId, setCourseId] = useAtom(courseIdAtom);
  const setQuizMaterials = useSetAtom(quizMaterialsAtom);

  useEffect(() => {
    updateCourses();
    const selected: any = document.getElementById(courseId);
    if (selected) selected.checked = true;
  }, []);

  const updateCourses = async () => {
    let courses = await API.get("api", "/courses", {});
    setCourses(courses);
  };

  function selectCourse(selectedCourseId: string) {
    (document.getElementById(selectedCourseId) as any).checked = true;
    if (selectedCourseId != courseId) setQuizMaterials([]);
    setCourseId(selectedCourseId);
  }
  return (
    <>
      {courses.length > 0 ? (
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
                <tr key={course.id} onClick={() => selectCourse(course.id)}>
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
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            margin: "auto",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", margin: "auto" }}
          >
            <img src={elephant} alt="nothing to see here" />
            <p style={{ color: "#4a4e69", fontSize: "medium" }}>
              You are not enrolled in any course
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Quizzes;
export { CoursesTable };
