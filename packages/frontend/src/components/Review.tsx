import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../review.css";
import { faPenClip } from "@fortawesome/free-solid-svg-icons";
import { useAtomValue, useSetAtom } from "jotai";
import { FillBlank, Mcq, Tf, quizAtom, stageAtom } from "../lib/store";
import { focusAtom } from "jotai-optics";

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
  const { name, versions, mcq, tf, fillBlank } = useAtomValue(quizAtom);
  const setStepNo = useSetAtom(stageAtom);

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

const McqsAtom = focusAtom(quizAtom, (optic) => optic.prop("mcqArr"));
const FillBlanksAtom = focusAtom(quizAtom, (optic) =>
  optic.prop("fillBlankArr")
);
const TfsAtom = focusAtom(quizAtom, (optic) => optic.prop("TfArr"));

function Questions(props: { type: string; stepNo: number }) {
  const mcqQuestions = useAtomValue(McqsAtom);
  const fillBlankQuestions = useAtomValue(FillBlanksAtom);
  const tfQuestions = useAtomValue(TfsAtom);
  const setStepNo = useSetAtom(stageAtom);

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
            <div className="question-container review">
              <div className="question-area" style={{ height: "7rem" }}>
                <p style={{ lineHeight: "1rem" }}>{question.question}</p>
              </div>

              {question.choices.map((choice: string, index: number) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "5px",
                  }}
                >
                  <label style={{ fontSize: "medium", paddingTop: "12px" }}>
                    {index + 1})
                  </label>
                  <input
                    style={{
                      backgroundColor:
                        question.answer_index === index
                          ? "rgba(77, 187, 67, 0.46)"
                          : "",
                    }}
                    type="text"
                    value={choice}
                    disabled
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {props.type == "Fill-in Blank Setup" && (
        <div className="form-container">
          {fillBlankQuestions.map((question: FillBlank) => (
            <div className="question-container review">
              <div className="question-area">
                <p>{question.question}</p>
              </div>

              <label>Answer Key:</label>
              <input
                style={{
                  marginTop: "0.5em",
                  backgroundColor: "rgba(77, 187, 67, 0.46)",
                }}
                type="text"
                value={question.answer}
                disabled
              />
            </div>
          ))}
        </div>
      )}

      {props.type == "T/F Setup" && (
        <div className="form-container">
          {tfQuestions.map((question: Tf) => (
            <div className="question-container review">
              <div className="question-area">
                <p>{question.question}</p>
              </div>
              <label>Answer Key:</label>
              <input
                style={{
                  marginTop: "0.5em",
                  backgroundColor: "rgba(77, 187, 67, 0.46)",
                }}
                type="text"
                value={String(question.answer)}
                disabled
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Review;
