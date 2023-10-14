import { useState } from "react";
import Titles from "../components/Title";
import Navbar from "../components/Navbar";
import StepProgressBar from "../components/StepProgressBar";
import MaterialsTable from "../components/MaterialsTable";
import QuizSetupForm from "../components/QuizSetup";

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
        {stepNo == 0 && <MaterialsTable isSelecting={true} />}
        {stepNo == 1 && <QuizSetupForm />}
        {stepNo == 2 && <h1>question</h1>}
        {stepNo == 3 && <h1>review</h1>}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="next" onClick={() => setStepNo(stepNo + 1)}>
          Next
        </button>
      </div>
    </>
  );
}

export default Quizzes;
