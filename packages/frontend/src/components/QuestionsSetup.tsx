import { useState } from "react";
import QuestionArea from "../components/QuestionArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

export interface Question {
  stem: String;
}

function QuestionsSetup() {
  const [generated, setGenerated] = useState([
    { stem: "S3? Simple Storage Service" },
    { stem: "EC2? Elastic Cloud Compute" },
    { stem: "QQQ" },
  ]);
  const [selected, setSelected] = useState([{ stem: "DDD" }]);

  const selectQuestion = (q: Question, idx: number) => {
    setSelected([...selected, q as any]);
    generated.splice(idx, 1);
    setGenerated(generated);
  };

  const removeQuestion = (index: number) => {
    console.log(selected);
    console.log(index);
    selected.splice(index, 1);
    setSelected(selected);
    // selected.splice(index, 1);
    // console.log(selected);
    // setSelected(selected);
  };

  //   function addQuestion(newQuestion) {
  //     setQuestions((prevQuestions) => {
  //       return [...prevQuestions, newQuestion];
  //     });
  //     setEditable(!editable);
  //   }
  //   function deleteQuestion(id) {
  //     setQuestions((prevQuestions) => {
  //       return prevQuestions.filter((item, index) => {
  //         return index !== id;
  //       });
  //     });
  //     setEditable(!editable);
  //   }

  return (
    <div className="questions-setup" style={{ backgroundColor: "#F2E9E4" }}>
      <h3>Customize the MCQ Questions</h3>

      <div className="questions">
        <div className="generated">
          <h4 style={{ textAlign: "center" }}>Generated Questions</h4>

          {generated.map((question, index) => (
            <QuestionArea
              key={question.stem}
              question={question}
              index={index}
              add={selectQuestion}
              remove={removeQuestion}
            />
          ))}
        </div>

        <div className="selected">
          <h4 style={{ textAlign: "center" }}>Selected Questions</h4>

          {selected.map((question, index) => (
            <div key={question.stem} className="question-container">
              <FontAwesomeIcon
                icon={faMinus}
                style={{
                  color: "#22223b",
                  marginRight: "1px",
                  cursor: "pointer",
                }}
                onClick={() => removeQuestion(index)}
              />
              <div>{question.stem}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default QuestionsSetup;
