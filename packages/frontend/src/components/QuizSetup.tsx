import { TextField } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
// import "../buttons.css";

function QuizSetupForm() {
  const quizName = localStorage.getItem("QuizName");
  const versions = localStorage.getItem("versions");
  const mcq = localStorage.getItem("mcq");
  const tf = localStorage.getItem("tf");
  const fillBlank = localStorage.getItem("fillBlank");
  if (tf === null) {
    localStorage.setItem("tf", "0");
  }
  return (
    <div className="setup-quiz" style={{ backgroundColor: "#F2E9E4" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h3>Set Up Your Quiz!</h3>

        <div className="input-container">
          <TextField
            label="Quiz Name"
            name="quizName"
            placeholder="Quiz 1"
            defaultValue={`${quizName}`}
            inputStyles={{
              backgroundColor: "white",
            }}
            onChange={(e) => {
              localStorage.setItem("QuizName", e.target.value);
            }}
            contentEditable
          />
        </div>

        <div className="input-container">
          <StepperField
            label="Number of Versions"
            min="1"
            max="3"
            name="versions"
            placeholder="1"
            defaultValue={`${versions}`}
          />
        </div>

        <div className="input-container">
          <StepperField
            min="0"
            max="50"
            label="Number of MCQ"
            name="mcq"
            placeholder="1"
            defaultValue={`${mcq}`}
          />
        </div>

        <div className="input-container">
          <StepperField
            min="0"
            max="10"
            label="Number of T/F"
            name="tf"
            placeholder="1"
            defaultValue={`${tf}`}
          />
        </div>

        <div className="input-container">
          <StepperField
            min="0"
            max="10"
            label="Number of fill-in blank"
            name="fillBlank"
            placeholder="1"
            defaultValue={`${fillBlank}`}
          />
        </div>
      </form>
    </div>
  );
}
function StepperField(props: {
  label: string;
  name: string;
  placeholder: string;
  min: string;
  max: string;
  defaultValue: string;
}) {
  const [value, setValue] = useState(parseInt(props.defaultValue));

  function handlePlus() {
    if (value < parseInt(props.max, 10)) {
      setValue(value + 1);
      console.log(value + 1);
      localStorage.setItem(props.name, (value + 1).toString());
    }
  }
  function handleMinus() {
    if (value > parseInt(props.min, 10)) {
      setValue(value - 1);
      console.log(value - 1);
      localStorage.setItem(props.name, (value - 1).toString());
    }
  }

  return (
    <>
      <label>{props.label} </label>
      <input
        className="stepperfield"
        type="number"
        name={props.name}
        placeholder={value.toString()}
        value={value}
        required
        disabled
      />
      <button className="minus">
        <FontAwesomeIcon
          className="minus-icon"
          icon={faMinus}
          onClick={handleMinus}
        />
      </button>
      <button className="plus">
        <FontAwesomeIcon
          onClick={handlePlus}
          className="plus-icon"
          icon={faPlus}
        />
      </button>
    </>
  );
}
export default QuizSetupForm;
