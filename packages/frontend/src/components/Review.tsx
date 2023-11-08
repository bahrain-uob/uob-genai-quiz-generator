import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../review.css";
import { faPenClip } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { quizAtom, stageAtom, Mcq, FillBlank, Tf } from "../lib/store";
import { focusAtom } from "jotai-optics";

const McqsAtom = focusAtom(quizAtom, (optic) => optic.prop("mcqArr"));
const FillBlanksAtom = focusAtom(quizAtom, (optic) =>
  optic.prop("fillBlankArr")
);
const TfsAtom = focusAtom(quizAtom, (optic) => optic.prop("TfArr"));
function Review() {
  return (
    <div className="review-container">
      <h3>Almost There!</h3>
      <h3 style={{ marginBottom: "20px" }}>Review Your Quiz</h3>

      <QuizSetup />
      <Questions type="MCQ Setup" stepNo={3} />
      <Questions type="T/F Setup" stepNo={4} />
      <Questions type="Fill-in Blank Setup" stepNo={5} />
    </div>
  );
}

function QuizSetup() {
  const [{ name, versions, mcq, tf, fillBlank }, _setQuiz] = useAtom(quizAtom);
  const [_stepNo, setStepNo] = useAtom(stageAtom);
  return (
    <div className="white-container">
      <div className="stage-name">
        <h4>Quiz Setup</h4>
        <div className="underline" onClick={() => setStepNo(2)}>
          <FontAwesomeIcon icon={faPenClip} className="edit-icon" />
        </div>
      </div>

      <div className="form-container">
        <div className="left">
          <div className="input-container">
            <label htmlFor="quiz-name">Quiz Name</label>
            <input name="quiz-name" placeholder={`${name}`} disabled />
          </div>
          <div className="input-container">
            <label htmlFor="versions">Number of Versions</label>
            <input name="versions" placeholder={`${versions}`} disabled />
          </div>
        </div>
        <div className="right">
          <div className="input-container">
            <label htmlFor="mcq">Number of MCQ</label>
            <input name="mcq" placeholder={`${mcq}`} disabled />
          </div>
          <div className="input-container">
            <label htmlFor="tf">Number of T/F</label>
            <input name="tf" placeholder={`${tf}`} disabled />
          </div>
          <div className="input-container">
            <label htmlFor="fillBlank">Number of Fill-in Blank</label>
            <input name="fillBlank" placeholder={`${fillBlank}`} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

function Questions(props: { type: string; stepNo: number }) {
  const [mcqQuestions, _setQuestions] = useAtom(McqsAtom);
  const [fillBlankQuestions, _setFillBLankQuestions] = useAtom(FillBlanksAtom);
  const [tfQuestions, _setTfQuestions] = useAtom(TfsAtom);
  const [_stepNo, setStepNo] = useAtom(stageAtom);
  return (
    <div className="white-container">
      <div className="stage-name">
        <h4>{props.type}</h4>
        <div className="underline" onClick={() => setStepNo(props.stepNo)}>
          <FontAwesomeIcon icon={faPenClip} className="edit-icon" />
        </div>
      </div>
      {props.type == "MCQ Setup" && (
        <div className="form-container">
          {mcqQuestions.map((question: Mcq) => (
            <div className="question-area mcq-review">
              <strong>
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "medium",
                  }}
                >
                  {" "}
                  {question.question}
                </p>
              </strong>
              <p>
                {" "}
                <strong>1)</strong> {question.choices[0]}
              </p>
              <p>
                {" "}
                <strong>2)</strong> {question.choices[1]}
              </p>
              <p>
                {" "}
                <strong>3)</strong> {question.choices[2]}
              </p>
              <p>
                {" "}
                <strong>4)</strong> {question.choices[3]}
              </p>
              <p style={{ paddingTop: "0.7em", fontWeight: "bold" }}>
                Answer Key: {question.answer_index + 1}
              </p>
            </div>
          ))}
        </div>
      )}

      {props.type == "Fill-in Blank Setup" && (
        <div className="form-container">
          {fillBlankQuestions.map((question: FillBlank) => (
            <div className="question-area mcq-review">
              <strong>
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "medium",
                  }}
                >
                  {" "}
                  {question.question}
                </p>
              </strong>

              <p style={{ paddingTop: "0.7em", fontWeight: "bold" }}>
                Answer Key: {question.answer}
              </p>
            </div>
          ))}
        </div>
      )}

      {props.type == "T/F Setup" && (
        <div className="form-container">
          {tfQuestions.map((question: Tf) => (
            <div className="question-area mcq-review">
              <strong>
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "medium",
                  }}
                >
                  {" "}
                  {question.question}
                </p>
              </strong>

              <p style={{ paddingTop: "0.7em", fontWeight: "bold" }}>
                Answer Key: {question.answer.toString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Review;
