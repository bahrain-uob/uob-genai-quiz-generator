import { TextField } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { quizAtom } from "../lib/store";

function QuizSetupForm() {
  const [quiz, setQuiz] = useAtom(quizAtom);

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
            value={quiz.name}
            inputStyles={{
              backgroundColor: "white",
            }}
            onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
            contentEditable
          />
        </div>

        <div className="input-container">
          <StepperField
            min={0}
            max={50}
            value={quiz.mcq}
            label="Number of MCQ"
            name="mcq"
          />
        </div>

        <div className="input-container">
          <StepperField
            min={0}
            max={10}
            value={quiz.tf}
            label="Number of T/F"
            name="tf"
          />
        </div>

        <div className="input-container">
          <StepperField
            min={0}
            max={10}
            value={quiz.fillBlank}
            label="Number of fill-in blank"
            name="fillBlank"
          />
        </div>
      </form>
    </div>
  );
}
function StepperField(props: {
  label: string;
  name: string;
  value: number;
  min: number;
  max: number;
}) {
  const [quiz, setQuiz] = useAtom(quizAtom);
  // @ts-ignore
  const value = quiz[props.name];

  const clamp = (val: number) => {
    if (val > props.max) return props.max;
    if (val < props.min) return props.min;
    return val;
  };
  function handleChange(n: number) {
    const copy = JSON.parse(JSON.stringify(quiz));
    const newVal = clamp(parseInt(copy[props.name]) + n);
    copy[props.name] = newVal;
    setQuiz(copy);
  }

  return (
    <>
      <label>{props.label} </label>
      <input
        className="stepperfield"
        type="number"
        name={props.name}
        value={value}
        disabled
      />
      <button className="minus">
        <FontAwesomeIcon
          className="minus-icon"
          icon={faMinus}
          onClick={() => handleChange(-1)}
        />
      </button>
      <button className="plus">
        <FontAwesomeIcon
          onClick={() => handleChange(1)}
          className="plus-icon"
          icon={faPlus}
        />
      </button>
    </>
  );
}
export default QuizSetupForm;
