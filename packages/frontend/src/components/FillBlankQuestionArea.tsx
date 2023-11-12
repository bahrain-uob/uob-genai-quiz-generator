import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FillBlank } from "../lib/store";
import { PrimitiveAtom, useAtom } from "jotai";

function QuestionArea(props: {
  question: PrimitiveAtom<FillBlank>;
  isSelected: boolean;
  move: any;
}) {
  const [question, setQuestion] = useAtom(props.question);

  function handleQuestionChange(event: any) {
    const updatedQuestion = { ...question, question: event.target.value };
    setQuestion(updatedQuestion);
  }

  function handleAnswerChange(event: any) {
    const updatedQuestion = { ...question, answer: event.target.value };
    setQuestion(updatedQuestion);
  }

  return (
    <>
      <div className="question-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <FontAwesomeIcon
            icon={props.isSelected ? faMinusCircle : faPlusCircle}
            size="2x"
            className="faMinusCircle"
            onClick={() => props.move(question)}
          />

          <textarea
            style={{ padding: "5px" }}
            rows={2}
            cols={35}
            defaultValue={question.question}
            onChange={(e) => handleQuestionChange(e)}
          ></textarea>

          <label>Answer Key:</label>
          <input
            type="text"
            defaultValue={question.answer}
            onChange={handleAnswerChange}
          />
        </form>
      </div>
    </>
  );
}

export default QuestionArea;
