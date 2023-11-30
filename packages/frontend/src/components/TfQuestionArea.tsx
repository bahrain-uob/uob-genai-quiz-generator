import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Tf } from "../lib/store";
import { PrimitiveAtom, useAtom } from "jotai";

function QuestionArea(props: {
  question: PrimitiveAtom<Tf>;
  isSelected: boolean;
  add?: any;
  remove: any;
}) {
  const [question, setQuestion] = useAtom(props.question);

  function handleQuestionChange(event: any) {
    const updatedQuestion = { ...question, question: event.target.value };
    setQuestion(updatedQuestion);
  }

  function handleAnswerChange(answer: boolean) {
    const updatedQuestion = { ...question, answer };
    setQuestion(updatedQuestion);
  }

  return (
    <>
      <div className="question-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "5px" }}
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
          ></textarea>

          <div style={{ display: "flex", flexDirection: "row", gap: "2px" }}>
            <div className="toggle-container">
              <div
                className={`right-toggle ${
                  question.answer == true ? "checked" : ""
                }`}
                onClick={() => handleAnswerChange(true)}
              >
                True
              </div>
              <div
                className={`left-toggle ${
                  question.answer == false ? "checked" : ""
                }`}
                onClick={() => handleAnswerChange(false)}
              >
                False
              </div>
            </div>
          </div>

          <label>Answer Key:</label>
          <input type="text" value={`${question.answer}`} disabled />
        </form>
      </div>
    </>
  );
}

export default QuestionArea;
