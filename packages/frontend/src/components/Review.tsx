import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../review.css";
import { faPenClip } from "@fortawesome/free-solid-svg-icons";
import QuestionArea from "./QuestionArea";
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
  return (
    <div className="white-container">
      <div className="stage-name">
        <h4 className="underline">Quiz Setup</h4>
        <EditIcon />
      </div>

      <div className="form-container">
        <div className="left">
          <div className="input-container">
            <label htmlFor="quiz-name">Quiz Name</label>
            <input name="quiz-name" placeholder="Mockup Quiz" disabled />
          </div>
          <div className="input-container">
            <label htmlFor="versions">Number of Versions</label>
            <input name="versions" placeholder="3" disabled />
          </div>
        </div>
        <div className="right">
          <div className="input-container">
            <label htmlFor="mcq">Number of MCQ</label>
            <input name="mcq" placeholder="2" disabled />
          </div>
          <div className="input-container">
            <label htmlFor="tf">Number of T/F</label>
            <input name="tf" placeholder="2" disabled />
          </div>
          <div className="input-container">
            <label htmlFor="fillBlank">Number of Fill-in Blank</label>
            <input name="fillBlank" placeholder="2" disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

function Questions() {
  return (
    <div className="white-container">
      <div className="stage-name">
        <h4 className="underline">MCQ Setup</h4>
        <EditIcon />
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
function EditIcon() {
  return (
    <div className="underline leftline">
      <FontAwesomeIcon icon={faPenClip} className="edit-icon" />
    </div>
  );
}
export default Review;
