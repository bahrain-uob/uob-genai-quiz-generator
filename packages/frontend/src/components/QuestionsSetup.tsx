import { useState } from "react";
import QuestionArea from "../components/QuestionArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { Mcq, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";

const McqsAtom = focusAtom(quizAtom, (optic) => optic.prop("mcqArr"));

function QuestionsSetup() {
  const [generated, setGenerated] = useState([
    { stem: "S3? Simple Storage Service" },
    { stem: "EC2? Elastic Cloud Compute" },
    { stem: "VPC? Virtual Private Cloud" },
  ]);
  const [selected, setSelected] = useState([{ stem: "" }]);

  const [questions, setQuestions] = useAtom(McqsAtom);
  console.log(questions);

  const selectQuestion = (q: Mcq, idx: number) => {
    setSelected([...selected, q as any]);
    generated.splice(idx, 1);
    setGenerated(generated);
    setQuestions([...questions, q as any]);
    console.log(questions);
  };

  const removeQuestion = (index: number) => {
    selected.splice(index, 1);
    setSelected([...selected]);
    questions.splice(index, 1);
    setQuestions(questions);
  };

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

          {questions.map((qu, index) => (
            <div key={qu.question} className="question-container">
              <FontAwesomeIcon
                icon={faMinusCircle}
                size="2x"
                className="faMinusCircle"
                onClick={() => removeQuestion(index)}
              />

              <div>{qu.question}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default QuestionsSetup;
