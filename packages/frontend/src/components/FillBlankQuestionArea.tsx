import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FillBlank } from "../lib/store";

function QuestionArea(props: {
  q: FillBlank;
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
  function handleChange(event: any) {
    const updatedQuestion = { ...question, answer: event.target.value };
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

            <label>Answer Key:</label>
            <input
              type="text"
              value={question.answer}
              onChange={handleChange}
            />
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
          <input type="text" value={question.answer} onChange={handleChange} />
        </form>
      )}
    </>
  );
}

export default QuestionArea;
