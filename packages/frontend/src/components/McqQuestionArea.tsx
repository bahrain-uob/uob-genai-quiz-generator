import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { Mcq } from "../lib/store";
import { PrimitiveAtom, useAtom } from "jotai";

function QuestionArea(props: {
  question: PrimitiveAtom<Mcq>;
  isSelected: boolean;
  add?: any;
  remove: any;
}) {
  const [question, setQuestion] = useAtom(props.question);

  function handleQuestionChange(event: any) {
    const updatedQuestion = { ...question, question: event.target.value };
    setQuestion(updatedQuestion);
  }

  function handleChoiceChange(event: any, index: number) {
    const updatedQuestion = { ...question };
    updatedQuestion.choices[index] = event.target.value;
    setQuestion(updatedQuestion);
  }

  function handleAnswerChange(answer: number) {
    const updatedQuestion = { ...question, answer_index: answer };
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

          {question.choices.map((choice: string, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "5px",
              }}
            >
              <input
                type="radio"
                name="choice"
                checked={index == question.answer_index}
                onClick={() => handleAnswerChange(index)}
                className="choice-radio"
                readOnly={true}
              />

              <textarea
                rows={2}
                cols={35}
                style={{
                  backgroundColor:
                    question.answer_index === index
                      ? "rgba(77, 187, 67, 0.46)"
                      : "",
                }}
                defaultValue={choice}
                placeholder="choice here.."
                onChange={(e) => handleChoiceChange(e, index)}
              ></textarea>
            </div>
          ))}
        </form>
      </div>
    </>
  );
}

export default QuestionArea;
