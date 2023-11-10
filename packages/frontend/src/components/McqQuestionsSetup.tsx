import { useState } from "react";
import QuestionArea from "./McqQuestionArea";
import { useAtom } from "jotai";
import { Mcq, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";

const McqsAtom = focusAtom(quizAtom, (optic) => optic.prop("mcqArr"));

function McqQuestionsSetup() {
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

  const [mcqQuestions, setMcqQuestions] = useAtom(McqsAtom);

  const [selected, setSelected] = useState(mcqQuestions);

  const selectQuestion = (q: Mcq, idx: number) => {
    setSelected([...selected, q as any]);
    generated.splice(idx, 1);
    setGenerated(generated);
    setMcqQuestions([...mcqQuestions, q as any]);
  };

  const removeQuestion = (index: number) => {
    selected.splice(index, 1);
    setSelected([...selected]);
    mcqQuestions.splice(index, 1);
    setMcqQuestions(mcqQuestions);
  };

  const updateGeneratedQuestion = (event: any, index: number) => {
    const updatedGenerated = [...generated];
    updatedGenerated[index] = {
      ...updatedGenerated[index],
      question: event.target.value,
    };
    setGenerated(updatedGenerated);
  };

  const updateSelectedQuestion = (event: any, index: number) => {
    const updatedQuestions = [...mcqQuestions];
    const updatedSelectedQuestions = [...selected];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: event.target.value,
    };
    setMcqQuestions(updatedQuestions);
    setSelected(updatedSelectedQuestions);
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
              update={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateGeneratedQuestion(e, index)
              }
              isSelected={false}
            />
          ))}
        </div>

        <div className="selected">
          <h4 style={{ textAlign: "center" }}>Selected Questions</h4>

          {selected.map((qu, index) => (
            <QuestionArea
              key={qu.question}
              q={qu}
              index={index}
              add={selectQuestion}
              remove={removeQuestion}
              update={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateSelectedQuestion(e, index)
              }
              isSelected={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default McqQuestionsSetup;
