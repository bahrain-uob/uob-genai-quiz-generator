import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { FillBlank, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";
import FillBlankQuestionArea from "./FillBlankQuestionArea";

const FillBlanksAtom = focusAtom(quizAtom, (optic) =>
  optic.prop("fillBlankArr")
);

function McqQuestionsSetup() {
  const [generated, setGenerated] = useState([
    {
      question: "S3 is ",
      answer: "Simple Storage Service",
    },
    {
      question: "EC2 is Elastic ",
      answer: "Cloud Compute",
    },
    {
      question: "VPC is ",
      answer: "Virtual Private Cloud",
    },
  ] as FillBlank[]);
  const [selected, setSelected] = useState([{ stem: "" }]);

  const [fillBlankQuestions, setQuestions] = useAtom(FillBlanksAtom);
  console.log(fillBlankQuestions);

  const selectQuestion = (q: FillBlank, idx: number) => {
    setSelected([...selected, q as any]);
    generated.splice(idx, 1);
    setGenerated(generated);
    setQuestions([...fillBlankQuestions, q as any]);
    console.log(fillBlankQuestions);
  };

  const removeQuestion = (index: number) => {
    selected.splice(index, 1);
    setSelected([...selected]);
    fillBlankQuestions.splice(index, 1);
    setQuestions(fillBlankQuestions);
  };

  return (
    <div className="questions-setup" style={{ backgroundColor: "#F2E9E4" }}>
      <h3>Customize the MCQ Questions</h3>

      <div className="questions">
        <div className="generated">
          <h4 style={{ textAlign: "center" }}>Generated Questions</h4>

          {generated.map((question, index) => (
            <FillBlankQuestionArea
              key={question.question}
              q={question}
              index={index}
              add={selectQuestion}
              remove={removeQuestion}
              isSelected={false}
            />
          ))}
        </div>

        <div className="selected">
          <h4 style={{ textAlign: "center" }}>Selected Questions</h4>

          {fillBlankQuestions.map((qu, index) => (
            <div key={qu.question} className="question-container">
              <FontAwesomeIcon
                icon={faMinusCircle}
                size="2x"
                className="faMinusCircle"
                onClick={() => removeQuestion(index)}
              />

              <FillBlankQuestionArea
                key={qu.question}
                q={qu}
                index={index}
                add={selectQuestion}
                remove={removeQuestion}
                isSelected={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default McqQuestionsSetup;
