import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navrbar from "../components/Navbar";
import Title from "../components/Title";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Quizzes() {
  return (
    <>
      <Navrbar />
      <Title title={["My Quizzes"]} />
      <Link to="/createquiz">
        <button
          className="generate-button"
          style={{
            position: "absolute",
            right: "100px",
            top: "55%",
          }}
        >
          Generate Quiz
        </button>
      </Link>

      <div className="container">
        <div className="course-quiz-container">
          <h2>ITCS448 Cloud Computing</h2>
          <div className="quizzes-container">
            <Quiz name="Quiz 1" date="18th Oct 2023" />
            <Quiz name="Quiz 2" date="18th Oct 2023" />
            <Quiz name="Quiz 3" date="18th Oct 2023" />
          </div>
        </div>
        <div className="course-quiz-container">
          <h2>ITCS444 Mobile Application</h2>
          <div className="quizzes-container">
            <Link to="/createquiz">
              <button className="generate-button">Generate Quiz</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
function Spirals() {
  return (
    <>
      <div className="spiral-1"></div>
      <div className="spiral-2"></div>
      <div className="spiral-3"></div>
      <div className="spiral-4"></div>
    </>
  );
}
function Quiz(props: { name: String; date: String }) {
  return (
    <div className="quiz-item">
      <Spirals />
      <div className="lines"></div>
      <p className="quiz-name">{props.name}</p>
      <div className="information">
        <FontAwesomeIcon
          className="info-icon"
          icon={faCircleInfo}
          size="lg"
          style={{ color: "white" }}
        />
        <div className="contents">
          <p>Generated on {props.date}</p>
          <span>Click for more details</span>
        </div>
      </div>
    </div>
  );
}
export { Spirals };
export default Quizzes;
