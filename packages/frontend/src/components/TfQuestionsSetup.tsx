import TfQuestionArea from "./TfQuestionArea";
import { PrimitiveAtom, atom, useAtom, useAtomValue } from "jotai";
import { Tf, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";
import { splitAtom } from "jotai/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const TfsAtom = focusAtom(quizAtom, (optic) => optic.prop("TfArr"));
const TfsAtomsAtom = splitAtom(TfsAtom);
const generatedAtom = atom([
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
const generatedAtomsAtom = splitAtom(generatedAtom);

function TfQuestionsSetup() {
  const [generated, generatedDispatch] = useAtom(generatedAtomsAtom);
  const [selected, selectedDispatch] = useAtom(TfsAtomsAtom);
  const gArr = useAtomValue(generatedAtom);
  const qArr = useAtomValue(TfsAtom);

  const [parent] = useAutoAnimate();

  const selectQuestion = (question: PrimitiveAtom<Tf>) => {
    return (q: Tf) => {
      generatedDispatch({ type: "remove", atom: question });
      selectedDispatch({ type: "insert", value: q });
    };
  };

  const removeQuestion = (question: PrimitiveAtom<Tf>) => {
    return () => selectedDispatch({ type: "remove", atom: question });
  };

  return (
    <div className="questions-setup" style={{ backgroundColor: "#F2E9E4" }}>
      <h3>Customize the True/False Questions</h3>

      <div className="questions">
        <div ref={parent} className="generated">
          <h4 style={{ textAlign: "center" }}>Generated Questions</h4>

          {generated.map((question, index) => (
            <TfQuestionArea
              key={gArr[index].question}
              question={question}
              isSelected={false}
              move={selectQuestion(question)}
            />
          ))}
        </div>

        <div ref={parent} className="selected">
          <h4 style={{ textAlign: "center" }}>Selected Questions</h4>

          {selected.map((question, index) => (
            <TfQuestionArea
              key={qArr[index].question}
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
export default TfQuestionsSetup;
