import { useState } from "react";
import { PrimitiveAtom, atom, useAtom, useAtomValue } from "jotai";
import { FillBlank, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";
import FillBlankQuestionArea from "./FillBlankQuestionArea";
import { splitAtom } from "jotai/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const FillBlanksAtom = focusAtom(quizAtom, (optic) =>
  optic.prop("fillBlankArr"),
);
const FillBlanksAtomsAtom = splitAtom(FillBlanksAtom);
const generatedAtom = atom([
  {
    id: crypto.randomUUID(),
    question: "S3 is ",
    answer: "Simple Storage Service",
  },
  {
    id: crypto.randomUUID(),
    question: "EC2 is Elastic ",
    answer: "Cloud Compute",
  },
  {
    id: crypto.randomUUID(),
    question: "VPC is ",
    answer: "Virtual Private Cloud",
  },
] as FillBlank[]);
const generatedAtomsAtom = splitAtom(generatedAtom);

function FillBlankQuestionsSetup() {
  const [generated, generatedDispatch] = useAtom(generatedAtomsAtom);
  const [selected, selectedDispatch] = useAtom(FillBlanksAtomsAtom);
  const gArr = useAtomValue(generatedAtom);
  const sArr = useAtomValue(FillBlanksAtom);

  const [parent] = useAutoAnimate();

  const selectQuestion = (question: PrimitiveAtom<FillBlank>) => {
    return (q: FillBlank) => {
      generatedDispatch({ type: "remove", atom: question });
      selectedDispatch({ type: "insert", value: q });
    };
  };

  const removeQuestion = (question: PrimitiveAtom<FillBlank>) => {
    return () => selectedDispatch({ type: "remove", atom: question });
  };

  return (
    <div className="questions-setup" style={{ backgroundColor: "#F2E9E4" }}>
      <h3>Customize the Fill-in Blank Questions</h3>

      <div className="questions">
        <div ref={parent} className="generated">
          <h4 style={{ textAlign: "center" }}>Generated Questions</h4>

          {generated.map((question, index) => (
            <FillBlankQuestionArea
              key={gArr[index].id}
              question={question}
              isSelected={false}
              move={selectQuestion(question)}
            />
          ))}
        </div>

        <div ref={parent} className="selected">
          <h4 style={{ textAlign: "center" }}>Selected Questions</h4>

          {selected.map((question, index) => (
            <FillBlankQuestionArea
              key={sArr[index].id}
              question={question}
              isSelected={true}
              move={removeQuestion(question)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default FillBlankQuestionsSetup;
