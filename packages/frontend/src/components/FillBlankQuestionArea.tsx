import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FillBlank } from "../lib/store";
import { PrimitiveAtom, useAtom } from "jotai";

function QuestionArea(props: {
  question: PrimitiveAtom<FillBlank>;
  isSelected: boolean;
  add?: any;
  remove: any;
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
          <div
            style={{ display: "flex", justifyContent: "center", gap: "15px" }}
          >
            <FontAwesomeIcon
              icon={faMinusCircle}
              size="2x"
              className="faMinusCircle"
              onClick={() => props.remove(question)}
            />
            {!props.isSelected && (
              <FontAwesomeIcon
                icon={faPlusCircle}
                size="2x"
                className="faPlusCircle"
                onClick={() => props.add(question)}
              />
            )}
          </div>

          <textarea
            style={{ padding: "5px" }}
            rows={2}
            cols={35}
            defaultValue={question.question}
            onChange={(e) => handleQuestionChange(e)}
            placeholder="Question here.."
          ></textarea>

          <label>Answer Key:</label>
          <input
            type="text"
            defaultValue={question.answer}
            onChange={handleAnswerChange}
            placeholder="Answer here.."
          />
        </form>
      </div>
    </>
  );
}

export default QuestionArea;
