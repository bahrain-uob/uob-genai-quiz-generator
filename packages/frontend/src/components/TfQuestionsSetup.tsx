import { useState } from "react";
import TfQuestionArea from "./TfQuestionArea";
import { useAtom } from "jotai";
import { Tf, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";

const TfsAtom = focusAtom(quizAtom, (optic) => optic.prop("TfArr"));

function TfQuestionsSetup() {
  const [generated, setGenerated] = useState([
    {
      question: "S3? Simple Storage Service",
      answer: true,
    },
    {
      question: "EC2? Elastic Cloud Compute",
      answer: false,
    },
    {
      question: "VPC? Virtual Private Cloud",
      answer: true,
    },
  ] as Tf[]);

  const [tfQuestions, setTfQuestions] = useAtom(TfsAtom);
  console.log(tfQuestions);
  const [selected, setSelected] = useState(tfQuestions);
  const selectQuestion = (q: Tf, idx: number) => {
    setSelected([...selected, q as any]);
    generated.splice(idx, 1);
    setGenerated(generated);
    setTfQuestions([...tfQuestions, q as any]);
    console.log(tfQuestions);
  };

  const removeQuestion = (index: number) => {
    selected.splice(index, 1);
    setSelected([...selected]);
    tfQuestions.splice(index, 1);
    setTfQuestions(tfQuestions);
  };

  const updateGeneratedQuestion = (event: any, index: number) => {
    const updatedGenerated = [...generated];
    updatedGenerated[index] = {
      ...updatedGenerated[index],
      question: event.target.value,
    };
    setGenerated(updatedGenerated);
    // const updatedQuestion = { ...tfQuestions, question: event.target.value };
    // setTfQuestions(updatedQuestion);
  };

  const updateQuestion = (event: any, index: number) => {
    const updatedQuestions = [...tfQuestions];
    const updatedSelectedQuestions = [...selected];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: event.target.value,
    };
    setTfQuestions(updatedQuestions);
    setSelected(updatedSelectedQuestions);
    // const updatedQuestion = { ...tfQuestions, question: event.target.value };
    // setTfQuestions(updatedQuestion);
  };

  return (
    <div className="questions-setup" style={{ backgroundColor: "#F2E9E4" }}>
      <h3>Customize the True/False Questions</h3>

      <div className="questions">
        <div className="generated">
          <h4 style={{ textAlign: "center" }}>Generated Questions</h4>

          {generated.map((question, index) => (
            <TfQuestionArea
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
            <TfQuestionArea
              key={qu.question}
              q={qu}
              index={index}
              add={selectQuestion}
              remove={removeQuestion}
              update={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateQuestion(e, index)
              }
              isSelected={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default TfQuestionsSetup;
