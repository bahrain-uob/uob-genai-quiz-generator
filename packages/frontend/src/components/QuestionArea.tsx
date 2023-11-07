import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Question } from "./QuestionsSetup";

function QuestionArea(props: {
  question: Question;
  index: number;
  add: any;
  remove: any;
}) {
  const [question, setQuestion] = useState(props.question);
  const idx = props.index;

  function handleChange(event: any) {
    const updated = event.target.value;
    setQuestion({
      stem: updated,
    });
  }

  return (
    <>
      <div className="question-container">
        <form>
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
            rows={6}
            cols={35}
            defaultValue={props.question.stem as any}
            onChange={handleChange}
          ></textarea>
        </form>
      </div>
    </>
  );
}

export default QuestionArea;
