import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
// import { Question } from "./QuestionsSetup";
import { Mcq } from "../lib/store";

function QuestionArea(props: {
  q: Mcq;
  index: number;
  add: any;
  remove: any;
  isSelected: boolean;
}) {
  const [question, setQuestion] = useState(props.q);
  // const [isValid, setIsValid] = useState(true);
  const idx = props.index;

  function handleQuestionChange(event: any) {
    const updatedQuestion = { ...question, question: event.target.value };
    setQuestion(updatedQuestion);
    //   const updated = event.target.value;
    //   setQuestion({
    //     q.question: updated
    // });
  }
  function handleChoiceChange(event: any, index: number) {
    const updatedChoices = [...question.choices];
    updatedChoices[index] = event.target.value;
    const updatedQuestion = { ...question, choices: updatedChoices };
    setQuestion(updatedQuestion);
  }
  function handleAnswerChange(event: any) {
    console.log(event.target.value);
    const updatedAnswer = { ...question, answer_index: event.target.value + 1 };
    setQuestion(updatedAnswer);
  }
  return (
    <>
      {!props.isSelected ? (
        <div className="question-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {/* <div className="plus-hover"> */}
            <FontAwesomeIcon
              icon={faPlusCircle}
              size="2x"
              className="faPlusCircle"
              onClick={() => {
                props.add(question, idx);
              }}
            />
            {/* </div> */}

            <textarea
              style={{ padding: "5px" }}
              rows={2}
              cols={35}
              defaultValue={props.q.question as any}
              onChange={handleQuestionChange}
            ></textarea>
            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <label style={{ fontSize: "medium" }}>1)</label>
              <input
                type="text"
                defaultValue={props.q.choices[0]}
                onChange={(e) => {
                  handleChoiceChange(e, 0);
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <label style={{ fontSize: "medium" }}>2)</label>
              <input
                type="text"
                defaultValue={props.q.choices[1]}
                onChange={(e) => {
                  handleChoiceChange(e, 1);
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <label style={{ fontSize: "medium" }}>3)</label>
              <input
                type="text"
                defaultValue={props.q.choices[2]}
                onChange={(e) => {
                  handleChoiceChange(e, 2);
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <label style={{ fontSize: "medium" }}>4)</label>
              <input
                type="text"
                defaultValue={props.q.choices[3]}
                onChange={(e) => {
                  handleChoiceChange(e, 3);
                }}
              />
            </div>

            <StepperField
              q={props.q}
              min={0}
              max={3}
              value={props.q.answer_index}
              label="Answer:"
              name="index"
              onChange={handleAnswerChange}
            />
          </form>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <textarea
            rows={2}
            cols={35}
            defaultValue={props.q.question as any}
            onChange={handleQuestionChange}
          ></textarea>
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <label style={{ fontSize: "medium" }}>1)</label>
            <input
              type="text"
              defaultValue={props.q.choices[0]}
              onChange={(e) => {
                handleChoiceChange(e, 0);
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <label style={{ fontSize: "medium" }}>2)</label>
            <input
              type="text"
              defaultValue={props.q.choices[1]}
              onChange={(e) => {
                handleChoiceChange(e, 1);
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <label style={{ fontSize: "medium" }}>3)</label>
            <input
              type="text"
              defaultValue={props.q.choices[2]}
              onChange={(e) => {
                handleChoiceChange(e, 2);
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <label style={{ fontSize: "medium" }}>4)</label>
            <input
              type="text"
              defaultValue={props.q.choices[3]}
              onChange={(e) => {
                handleChoiceChange(e, 3);
              }}
            />
          </div>
          <StepperField
            q={props.q}
            min={0}
            max={3}
            value={props.q.answer_index}
            label="Answer:"
            name="index"
            onChange={handleAnswerChange}
          />
          {/* <label>Answer:</label>
          <input
            type="number"
            defaultValue={answer_index + 1}
            onChange={handleAnswerChange}
          /> */}
        </form>
      )}
    </>
  );
}
function StepperField(props: {
  q: Mcq;
  label: string;
  name: string;
  value: number;
  min: number;
  max: number;
  onChange: any;
}) {
  const [question, setQuestion] = useState(props.q);
  // @ts-ignore
  const value = question.answer_index;

  const clamp = (val: number) => {
    if (val > props.max) return props.max;
    if (val < props.min) return props.min;
    return val;
  };
  function handleChange(n: number) {
    // const copy = JSON.parse(JSON.stringify(question));
    const newVal = clamp(value + n);
    console.log(newVal);
    const updatedAnswer = { ...question, answer_index: newVal };
    setQuestion(updatedAnswer);
    console.log(updatedAnswer);
    // copy.answer_index = newVal - 1;

    // setQuestion(copy);
  }

  return (
    <>
      <div className="input-container">
        <label>{props.label} </label>
        <input
          className="stepperfield"
          type="number"
          name={props.name}
          value={value + 1}
          disabled
          style={{ textAlign: "center" }}
        />
        <button
          className="minus"
          style={{
            top: "40px",
            backgroundColor: "white",
            boxShadow: "0px 0px 4px #c3c3c3",
            borderTopLeftRadius: "7px",
          }}
        >
          <FontAwesomeIcon
            className="minus-icon"
            icon={faMinus}
            onClick={() => handleChange(-1)}
          />
        </button>
        <button
          className="plus"
          style={{
            top: "40px",
            backgroundColor: "white",
            boxShadow: "0px 0px 4px #c3c3c3",
            borderTopRightRadius: "7px",
          }}
        >
          <FontAwesomeIcon
            onClick={() => handleChange(1)}
            className="plus-icon"
            icon={faPlus}
          />
        </button>
      </div>
    </>
  );
}

export default QuestionArea;
