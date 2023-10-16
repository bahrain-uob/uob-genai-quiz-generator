import { useState } from "react";
import Titles from "../components/Title";
import Navbar from "../components/Navbar";
import StepProgressBar from "../components/StepProgressBar";
import MaterialsTable from "../components/MaterialsTable";
import QuizSetupForm from "../components/QuizSetup";
import QuestionsSetup from "../components/QuestionsSetup";

function Quizzes() {
  const [stepNo, setStepNo] = useState(0);

  return (
    <>
      <Navbar />
      <div className="context">
        <Titles title={["ITCS448 CLOUD COMPUTING", "Create quiz"]} />
      </div>
      <StepProgressBar stepNo={stepNo} />
      <div className="step-container">
        {stepNo == 0 && <CoursesTable />}
        {stepNo == 1 && <MaterialsTable isSelecting={true} />}
        {stepNo == 2 && <QuizSetupForm />}
        {stepNo == 3 && <QuestionsSetup />}
        {stepNo == 4 && <h1>review</h1>}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {stepNo > 0 && (
          <button className="previous" onClick={() => setStepNo(stepNo - 1)}>
            Previous
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

function CoursesTable() {
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
            <tr>
              <td style={{ textAlign: "center" }}>
                <input
                  type="radio"
                  name="id"
                  style={{ width: "20px", height: "20px" }}
                />
              </td>
              <td>ITCS448</td>
              <td>Cloud Computing</td>
            </tr>

            <tr>
              <td style={{ textAlign: "center" }}>
                <input
                  type="radio"
                  name="id"
                  style={{ width: "20px", height: "20px" }}
                />
              </td>
              <td>ITCS 441</td>
              <td>Parallel and Distributed Systems</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Quizzes;
export { CoursesTable };
