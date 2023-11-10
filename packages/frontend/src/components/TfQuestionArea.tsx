import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
// import { Question } from "./QuestionsSetup";
import { Tf, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";
import { useAtom } from "jotai";

const TfsAtom = focusAtom(quizAtom, (optic) => optic.prop("TfArr"));
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
  const [tfQuestions, setTfQuestions] = useAtom(TfsAtom);
  const idx = props.index;

  function handleQuestionChange(event: any) {
    const updatedQuestion = { ...question, question: event.target.value };
    setQuestion(updatedQuestion);

    // const updatedQuestions = [...tfQuestions];
    // updatedQuestions[idx] = {
    //   ...updatedQuestions[idx],
    //   question: event.target.value,
    // };
    // setTfQuestions(updatedQuestions);
    //   const updated = event.target.value;
    //   setQuestion({
    //     q.question: updated
    // });
  }
  function handleChange(ans: boolean) {
    if (!props.isSelected) {
      const updatedQuestion = { ...question, answer: ans };
      setQuestion(updatedQuestion);
    } else {
      const updatedQuestions = [...tfQuestions];
      updatedQuestions[idx] = {
        ...updatedQuestions[idx],
        answer: ans,
      };
      setTfQuestions(updatedQuestions);
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
