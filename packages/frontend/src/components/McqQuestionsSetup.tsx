import QuestionArea from "./McqQuestionArea";
import { PrimitiveAtom, atom, useAtom } from "jotai";
import { Mcq, quizAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";
import { splitAtom } from "jotai/utils";

const McqsAtom = focusAtom(quizAtom, (optic) => optic.prop("mcqArr"));
const McqsAtomsAtom = splitAtom(McqsAtom);
const generatedAtom = atom([
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
const generatedAtomsAtom = splitAtom(generatedAtom);

function McqQuestionsSetup() {
  const [generated, generatedDispatch] = useAtom(generatedAtomsAtom);
  const [selected, selectedDispatch] = useAtom(McqsAtomsAtom);

  const selectQuestion = (question: PrimitiveAtom<Mcq>) => {
    return (q: Mcq) => {
      generatedDispatch({ type: "remove", atom: question });
      selectedDispatch({ type: "insert", value: q });
    };
  };

  const removeQuestion = (question: PrimitiveAtom<Mcq>) => {
    return () => selectedDispatch({ type: "remove", atom: question });
  };

  return (
    <div className="questions-setup" style={{ backgroundColor: "#F2E9E4" }}>
      <h3>Customize the MCQ Questions</h3>

      <div className="questions">
        <div className="generated">
          <h4 style={{ textAlign: "center" }}>Generated Questions</h4>

          {generated.map((question) => (
            <QuestionArea
              key={crypto.randomUUID()}
              question={question}
              isSelected={false}
              move={selectQuestion(question)}
            />
          ))}
        </div>

        <div className="selected">
          <h4 style={{ textAlign: "center" }}>Selected Questions</h4>

          {selected.map((question) => (
            <QuestionArea
              key={crypto.randomUUID()}
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
export default McqQuestionsSetup;
