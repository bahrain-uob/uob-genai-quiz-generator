import { useState } from "react";
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

  const [fillBlankQuestions, setFillBlankQuestions] = useAtom(FillBlanksAtom);

  const [selected, setSelected] = useState(fillBlankQuestions);

  const selectQuestion = (q: FillBlank, idx: number) => {
    setSelected([...selected, q as any]);
    generated.splice(idx, 1);
    setGenerated(generated);
    setFillBlankQuestions([...fillBlankQuestions, q as any]);
  };

  const removeQuestion = (index: number) => {
    selected.splice(index, 1);
    setSelected([...selected]);
    fillBlankQuestions.splice(index, 1);
    setFillBlankQuestions(fillBlankQuestions);
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
    const updatedQuestions = [...fillBlankQuestions];
    const updatedSelectedQuestions = [...selected];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: event.target.value,
    };
    setFillBlankQuestions(updatedQuestions);
    setSelected(updatedSelectedQuestions);
  };

  return (
    <div className="questions-setup" style={{ backgroundColor: "#F2E9E4" }}>
      <h3>Customize the Fill-in Blank Questions</h3>

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
            <FillBlankQuestionArea
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
