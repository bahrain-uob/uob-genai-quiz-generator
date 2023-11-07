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
    {
      question: "S3? Simple Storage Service",
      choices: ["s3", "ec2", "vpc", "ebs"],
      answer_index: 0,
    },
    {
      question: "EC2? Elastic Cloud Compute",
      choices: ["s3", "ec2", "vpc", "ebs"],
      answer_index: 2,
    },
    {
      question: "VPC? Virtual Private Cloud",
      choices: ["s3", "ec2", "vpc", "ebs"],
      answer_index: 2,
    },
  ] as Mcq[]);
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

          {questions.map((qu, index) => (
            <div key={qu.question} className="question-container">
              <FontAwesomeIcon
                icon={faMinusCircle}
                size="2x"
                className="faMinusCircle"
                onClick={() => removeQuestion(index)}
              />

              <QuestionArea
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
export default QuestionsSetup;
