import { useState } from "react";
import QuestionArea from "../components/QuestionArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { questionsAtom } from "../lib/store";
export interface Question {
  stem: String;
}

function QuestionsSetup() {
  const [generated, setGenerated] = useState([
    { stem: "S3? Simple Storage Service" },
    { stem: "EC2? Elastic Cloud Compute" },
    { stem: "VPC? Virtual Private Cloud" },
  ]);
  const [selected, setSelected] = useState([{ stem: "" }]);

  const [questions, setQuestions] = useAtom(questionsAtom);

  const selectQuestion = (q: Question, idx: number) => {
    setSelected([...selected, q as any]);
    // console.log(selected);
    generated.splice(idx, 1);
    setGenerated(generated);
    setQuestions([...questions, q as any]);
    console.log(questions);
  };

  const removeQuestion = (index: number) => {
    selected.splice(index, 1);
    setSelected([...selected]);

    // setQuestions([...selected]);
    // console.log(questions);
    //   console.log(selected);
    questions.splice(index, 1);
    setQuestions(questions);

    //   // selected.splice(index, 1);
    //   // setSelected(selected);
    //   // selected.splice(index, 1);
    //   // console.log(selected);
    //   // setSelected(selected);
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

          {questions.map((question, index) => (
            <div key={question.stem} className="question-container">
              {/* <div className="minus-hover"> */}
              <FontAwesomeIcon
                icon={faMinusCircle}
                size="2x"
                // className="faMinusCircle"
                onClick={() => removeQuestion(index)}
              />
              {/* </div> */}
              <div>{question.stem}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default QuestionsSetup;
