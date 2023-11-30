import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faMinus,
  faPlus,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
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

          {question.choices.map((choice: string, index: number) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "5px",
              }}
            >
              <label style={{ fontSize: "medium" }}>{index + 1})</label>
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
                onChange={(e) => handleChoiceChange(e, index)}
              ></textarea>
            </div>
          ))}

          <StepperField
            min={0}
            max={question.choices.length - 1}
            value={question.answer_index}
            onChange={handleAnswerChange}
          />
        </form>
      </div>
    </>
  );
}
function StepperField(props: {
  value: number;
  min: number;
  max: number;
  onChange: any;
}) {
  const clamp = (val: number) => {
    if (val > props.max) return props.max;
    if (val < props.min) return props.min;
    return val;
  };

  const handleChange = (n: number) => {
    const newVal = clamp(props.value + n);
    props.onChange(newVal);
  };

  return (
    <>
      <div className="input-container">
        <label>Answer: </label>
        <input
          className="stepperfield"
          type="number"
          value={props.value + 1}
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
