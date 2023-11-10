import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faMinus,
  faPlus,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
// import { Question } from "./QuestionsSetup";
import { Mcq, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";
import { useAtom } from "jotai";

const McqsAtom = focusAtom(quizAtom, (optic) => optic.prop("mcqArr"));

function QuestionArea(props: {
  q: Mcq;
  index: number;
  add: any;
  remove: any;
  update: any;
  isSelected: boolean;
}) {
  const [question, setQuestion] = useState(props.q);
  const [mcqQuestions, setMcqQuestions] = useAtom(McqsAtom);
  const idx = props.index;

  function handleQuestionChange(event: any) {
    const updatedQuestion = { ...question, question: event.target.value };
    setQuestion(updatedQuestion);
  }

  function handleChoiceChange(event: any, index: number) {
    if (!props.isSelected) {
      const updatedChoices = [...question.choices];
      updatedChoices[index] = event.target.value;
      const updatedQuestion = { ...question, choices: updatedChoices };
      setQuestion(updatedQuestion);
    } else {
      const updatedChoices = [...mcqQuestions[idx].choices];
      updatedChoices[index] = event.target.value;
      const updatedQuestion = {
        ...mcqQuestions[idx],
        choices: updatedChoices,
      };
      setMcqQuestions((prevMcqQuestions) => {
        const updatedMcqQuestions = [...prevMcqQuestions];
        updatedMcqQuestions[idx] = updatedQuestion;
        return updatedMcqQuestions;
      });
    }
  }
  function handleAnswerChange(indx: number) {
    if (!props.isSelected) {
      const updatedAnswer = {
        ...question,
        answer_index: indx,
      };
      setQuestion(updatedAnswer);
    } else {
      const updatedAnswer = {
        ...question,
        answer_index: indx,
      };
      setMcqQuestions((prevMcqQuestions) => {
        const updatedMcqQuestions = [...prevMcqQuestions];
        updatedMcqQuestions[idx] = updatedAnswer;
        return updatedMcqQuestions;
      });
    }
  }
  return (
    <>
      <div className="question-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {props.isSelected ? (
            <FontAwesomeIcon
              icon={faMinusCircle}
              size="2x"
              className="faMinusCircle"
              onClick={() => props.remove(idx)}
            />
          ) : (
            <FontAwesomeIcon
              icon={faPlusCircle}
              size="2x"
              className="faPlusCircle"
              onClick={() => {
                props.add(question, idx);
              }}
            />
          )}

          {props.isSelected ? (
            <textarea
              style={{ padding: "5px" }}
              rows={2}
              cols={35}
              defaultValue={props.q.question as any}
              onChange={(e) => props.update(e, idx)}
            ></textarea>
          ) : (
            <textarea
              style={{ padding: "5px" }}
              rows={2}
              cols={35}
              defaultValue={props.q.question as any}
              onChange={(e) => {
                handleQuestionChange(e);
              }}
            ></textarea>
          )}

          {props.q.choices.map((choice: string, index: number) => (
            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <label style={{ fontSize: "medium" }}>{index + 1})</label>
              <input
                type="text"
                defaultValue={choice}
                onChange={(e) => {
                  handleChoiceChange(e, index);
                }}
              />
            </div>
          ))}

          <StepperField
            q={props.q}
            min={0}
            max={3}
            value={props.q.answer_index}
            label="Answer:"
            name="index"
            // idx={props.index}
            // isSelected={props.isSelected}
            onChange={handleAnswerChange}
          />
        </form>
      </div>
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
  // idx: number;
  // isSelected: boolean;
  onChange: any;
}) {
  // const [mcqQuestions, setMcqQuestions] = useAtom(McqsAtom);
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
    // console.log(newVal);

    props.onChange(newVal);
    const updatedAnswer = { ...question, answer_index: newVal };
    setQuestion(updatedAnswer);
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
