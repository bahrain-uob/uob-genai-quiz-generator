import { StepperField, TextField } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function QuizSetupForm() {
  return (
    <div className="setup-quiz" style={{ backgroundColor: "#F2E9E4" }}>
      <form>
        <h3>Set Up Your Quiz!</h3>

        <div className="input-container">
          <TextField
            label="Quiz Name"
            name="quizName"
            placeholder="Quiz 1"
            inputStyles={{
              backgroundColor: "white",
            }}
          />
        </div>

        <div className="input-container">
          <StepperField
            min={1}
            max={3}
            label="Number of Versions"
            inputStyles={{
              backgroundColor: "white",
              width: "15rem",
            }}
          />
        </div>

        <div className="input-container">
          <StepperField
            min={0}
            max={50}
            label="Number of MCQ"
            inputStyles={{
              backgroundColor: "white",
              width: "15rem",
            }}
          />
        </div>

        <div className="input-container">
          <StepperField
            min={0}
            max={10}
            label="Number of T/F"
            inputStyles={{
              backgroundColor: "white",
              width: "15rem",
            }}
          />
        </div>

        <div className="input-container">
          <StepperField
            min={0}
            max={10}
            label="Number of fill-in blank"
            inputStyles={{
              backgroundColor: "white",
              width: "15rem",
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default QuizSetupForm;
