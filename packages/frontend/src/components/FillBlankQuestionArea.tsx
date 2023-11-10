import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FillBlank, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";
import { useAtom } from "jotai";

const FillBlanksAtom = focusAtom(quizAtom, (optic) =>
  optic.prop("fillBlankArr")
);
function QuestionArea(props: {
  q: FillBlank;
  index: number;
  add: any;
  remove: any;
  update: any;
  isSelected: boolean;
}) {
  const [fillBlankQuestions, setFillBlankQuestions] = useAtom(FillBlanksAtom);
  const [question, setQuestion] = useState(props.q);

  const idx = props.index;

  function handleQuestionChange(event: any) {
    const updatedQuestion = { ...question, question: event.target.value };
    setQuestion(updatedQuestion);
  }
  function handleChange(event: any) {
    if (!props.isSelected) {
      const updatedQuestion = { ...question, answer: event.target.value };
      setQuestion(updatedQuestion);
    } else {
      const updatedQuestions = [...fillBlankQuestions];
      updatedQuestions[idx] = {
        ...updatedQuestions[idx],
        answer: event.target.value,
      };
      setFillBlankQuestions(updatedQuestions);
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

          <label>Answer Key:</label>
          <input
            type="text"
            defaultValue={question.answer}
            onChange={handleChange}
          />
        </form>
      </div>
    </>
  );
}

export default QuestionArea;
