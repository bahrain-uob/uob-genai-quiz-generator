import { useEffect, useRef, useState } from "react";
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
import { Alert } from "@aws-amplify/ui-react";
import { Storage } from "aws-amplify";
import { getUserId } from "../lib/helpers";
import { useNavigate } from "react-router-dom";

const courseIdAtom = focusAtom(quizAtom, (optic) => optic.prop("courseId"));

function Quizzes() {
  const quiz = useAtomValue(quizAtom);
  const [stepNo, setStepNo] = useAtom(stageAtom);
  const courseId = useAtomValue(courseIdAtom);
  const inFlight = useRef(0);

  const navigate = useNavigate();
  const saveQuiz = async () => {
    const userId = await getUserId();
    const key = `${userId}/${courseId}/quizzes/${quiz.name}.json`;
    await Storage.put(key, JSON.stringify(quiz));
    navigate("/quizzes");
  };

  const pages = [
    <CoursesTable />,
    <MaterialsTable courseId={courseId} isSelecting={true} />,
    <QuizSetupForm />,
    quiz["tf"] > 0 && <TfQuestionsSetup inFlight={inFlight} />,
    quiz["mcq"] > 0 && <McqQuestionsSetup inFlight={inFlight} />,
    quiz["fillBlank"] > 0 && <FillBlankQuestionsSetup inFlight={inFlight} />,
    <Review stepNo={7} />,
  ].filter((e) => e !== false) as JSX.Element[];

  pages[pages.length - 1] = <Review stepNo={pages.length - 1} />;

  const handleNext = () => {
    const currentPage = pages[stepNo].type;

    if (currentPage === CoursesTable && quiz.courseId == "") {
      setErrorMsg("Please select a course");
    } else if (currentPage === MaterialsTable && quiz.materials.length < 1) {
      setErrorMsg("Please select at least 1 material");
    } else if (currentPage === QuizSetupForm && quiz.name == "") {
      setErrorMsg("Please enter a vaild quiz name");
    } else if (
      currentPage === QuizSetupForm &&
      quiz.tf + quiz.mcq + quiz.fillBlank < 3
    ) {
      setErrorMsg("The quiz should at least have 3 questions");
    } else if (
      currentPage === TfQuestionsSetup &&
      quiz["TfArr"].length !== quiz["tf"]
    ) {
      setErrorMsg(`Please select exactly ${quiz.tf} question(s)`);
    } else if (
      currentPage === McqQuestionsSetup &&
      quiz["mcqArr"].length !== quiz["mcq"]
    ) {
      setErrorMsg(`Please select exactly ${quiz.mcq} question(s)`);
    } else if (
      currentPage === FillBlankQuestionsSetup &&
      quiz["fibArr"].length !== quiz["fillBlank"]
    ) {
      setErrorMsg(`Please select exactly ${quiz.fillBlank} question(s)`);
    } else {
      setStepNo(stepNo + 1);
      setErrorMsg("");
    }
  };

  const [errorMsg, setErrorMsg] = useState("");
  return (
    <>
      <Navbar active="createquiz" />
      <div className="context"></div>
      <StepProgressBar stepNo={stepNo == pages.length - 1 ? 6 : stepNo} />
      <div className="step-container">
        {pages[stepNo]}
        {errorMsg != "" && <Alert variation="warning">{errorMsg}</Alert>}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {stepNo > 0 && (
          <button
            className="previous"
            onClick={() => {
              setErrorMsg("");
              setStepNo(stepNo - 1);
            }}
          >
            Back
          </button>
        )}
        {stepNo < pages.length - 1 ? (
          <button className="next" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button className="next" onClick={saveQuiz}>
            Finish
          </button>
        )}
      </div>
    </>
  );
}

const quizMaterialsAtom = focusAtom(quizAtom, (optic) =>
  optic.prop("materials"),
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
