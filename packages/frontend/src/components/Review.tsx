import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../review.css";
import { faPenClip } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { quizAtom, stageAtom } from "../lib/store";

function Review() {
  return (
    <div className="review-container">
      <h3>Almost There!</h3>
      <h3 style={{ marginBottom: "20px" }}>Review Your Quiz</h3>

      <QuizSetup />
      <Questions />
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

function Questions() {
  const [_stepNo, setStepNo] = useAtom(stageAtom);
  return (
    <div className="white-container">
      <div className="stage-name">
        <h4>MCQ Setup</h4>
        <div className="underline" onClick={() => setStepNo(3)}>
          <FontAwesomeIcon icon={faPenClip} className="edit-icon" />
        </div>
      </div>
      <div className="form-container">
        <div className="question-area">
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
        </div>
        <div className="question-area">
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
        </div>
        <div className="question-area">
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
        </div>
        <div className="question-area">
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
          <p> What is AWS S3? </p>
        </div>
      </div>
    </div>
  );
}

export default Review;
