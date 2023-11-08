import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
// import { Question } from "./QuestionsSetup";
import { Tf } from "../lib/store";

function QuestionArea(props: {
  q: Tf;
  index: number;
  add: any;
  remove: any;
  isSelected: boolean;
}) {
  const [question, setQuestion] = useState(props.q);
  //   const [isAnswer, _setIsAnswer] = useState(question.answer);

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
  function handleChange(ans: boolean) {
    const updatedQuestion = { ...question, answer: ans };
    setQuestion(updatedQuestion);
    console.log(updatedQuestion);
  }
  //   function handleChoiceChange(event: any, index: number) {
  //     const updatedChoices = [...question.choices];
  //     updatedChoices[index] = event.target.value;
  //     const updatedQuestion = { ...question, choices: updatedChoices };
  //     setQuestion(updatedQuestion);
  //   }
  //   function handleAnswerChange(event: any) {
  //     console.log(event.target.value);
  //     const updatedAnswer = { ...question, answer_index: event.target.value + 1 };
  //     setQuestion(updatedAnswer);
  //   }
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
              rows={2}
              cols={35}
              defaultValue={props.q.question as any}
              onChange={handleQuestionChange}
            ></textarea>
            <div style={{ display: "flex", flexDirection: "row", gap: "2px" }}>
              <FontAwesomeIcon
                icon={faCircleCheck}
                size="xl"
                style={{ color: "#4dbb43" }}
                onClick={() => {
                  handleChange(true);
                }}
              />
              <FontAwesomeIcon
                icon={faCircleXmark}
                size="xl"
                style={{ color: "rgb(191, 7, 7)" }}
                onClick={() => {
                  handleChange(false);
                }}
              />
            </div>

            <label>Answer Key:</label>
            <input type="text" value={question.answer.toString()} disabled />
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

          <label>Answer Key:</label>
          <input type="text" defaultValue={question.answer.toString()} />
        </form>
      )}
    </>
  );
}

export default QuestionArea;
