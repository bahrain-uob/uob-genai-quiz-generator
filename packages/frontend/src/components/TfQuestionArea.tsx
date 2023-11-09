import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
// import { Question } from "./QuestionsSetup";
import { Tf } from "../lib/store";

function QuestionArea(props: {
  q: Tf;
  index: number;
  add: any;
  remove: any;
  update: any;
  isSelected: boolean;
}) {
  const [question, setQuestion] = useState(props.q);
  const [checked, setChecked] = useState(props.q.answer);

  const idx = props.index;

  function handleQuestionChange(event: any) {
    const updatedQuestion = { ...question, question: event.target.value };
    setQuestion(updatedQuestion);
    //   const updated = event.target.value;
    //   setQuestion({
    //     q.question: updated
    // });
  }
  function handleChange(ans: boolean) {
    const updatedQuestion = { ...question, answer: ans };
    setQuestion(updatedQuestion);
    console.log(updatedQuestion);
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
              rows={2}
              cols={35}
              defaultValue={props.q.question as any}
              onChange={(e) => props.update(e, idx)}
            ></textarea>
          ) : (
            <textarea
              rows={2}
              cols={35}
              defaultValue={props.q.question as any}
              onChange={(e) => handleQuestionChange(e)}
            ></textarea>
          )}
          <div style={{ display: "flex", flexDirection: "row", gap: "2px" }}>
            <div className="toggle-container">
              <div
                className={`right-toggle ${checked == true ? "checked" : ""}`}
                onClick={() => {
                  setChecked(true);
                  handleChange(true);
                }}
              >
                True
              </div>
              <div
                className={`left-toggle ${checked == false ? "checked" : ""}`}
                onClick={() => {
                  setChecked(false);
                  handleChange(false);
                }}
              >
                False
              </div>
            </div>
          </div>

          <label>Answer Key:</label>
          <input type="text" value={String(question.answer)} disabled />
        </form>
      </div>
    </>
  );
}

export default QuestionArea;
