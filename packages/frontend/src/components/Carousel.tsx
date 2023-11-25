import "../carousel.css";
import { useState } from "react";
function Carousel() {
  const [flip, setFlip] = useState(0);
  // const [isFlipped, setIsFlipped] = useState(false);
  return (
    <>
      <div className="container-carousel">
        <div className={`card-carousel ${flip == 1 ? "flip flip-imm" : ""}`}>
          <div className="tooltip">
            <span className="tooltiptext">Click Me!</span>
          </div>

          <div
            className="front"
            onClick={() => {
              setFlip(1);
              // setIsFlipped(!isFlipped);
            }}
          >
            <h4 className="title-carousel">Select a Course</h4>
            <div className="bar">
              <div className="emptybar"></div>
              <div className="filledbar"></div>
            </div>

            <div className="circle-carousel">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                <circle className="stroke" cx="60" cy="60" r="50" />
                <text
                  x="19%"
                  y="40%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="circle-text"
                >
                  1
                </text>
              </svg>
            </div>
          </div>
          <div className="back" onClick={() => setFlip(0)}>
            <p
              style={{
                color: "white",
                fontWeight: "100",
                fontSize: "0.9em",
                width: "15em",
                paddingLeft: "10px",
              }}
            >
              You can seamlessly upload course materials for future reference
              for generating quizzes. You can generate summaries for the
              uploaded materials, providing the option to download these
              summaries. An auditory experience is available, allowing you to
              listen to the generated summaries.
            </p>
          </div>
        </div>

        <div className={`card-carousel ${flip == 2 ? "flip flip-imm" : ""}`}>
          <div
            className="front"
            onClick={() => {
              setFlip(2);
              // setIsFlipped(!isFlipped);
            }}
          >
            <h4 className="title-carousel">Select Materials</h4>
            <div className="bar">
              <div className="emptybar"></div>
              <div className="filledbar"></div>
            </div>

            <div className="circle-carousel">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                <circle className="stroke" cx="60" cy="60" r="50" />
                <text
                  x="19%"
                  y="40%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="circle-text"
                >
                  2
                </text>
              </svg>
            </div>
          </div>
          <div
            className="back"
            onClick={() => {
              setFlip(0);
            }}
          >
            <p
              style={{
                color: "white",
                fontWeight: "100",
                fontSize: "0.9em",
                width: "10em",
                paddingLeft: "10px",
              }}
            >
              You can select multiple materials from your course, such as PDFs,
              docx, vidoes, or images, and our AI algorithms will analyze and
              extract relevant information to create comprehensive quizzes.
            </p>
          </div>
        </div>

        <div className={`card-carousel ${flip == 3 ? "flip flip-imm" : ""}`}>
          <div
            className="front"
            onClick={() => {
              setFlip(3);
              // setIsFlipped(!isFlipped);
            }}
          >
            <h4 className="title-carousel">Quiz Setup</h4>
            <div className="bar">
              <div className="emptybar"></div>
              <div className="filledbar"></div>
            </div>

            <div className="circle-carousel">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                <circle className="stroke" cx="60" cy="60" r="50" />
                <text
                  x="19%"
                  y="40%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="circle-text"
                >
                  3
                </text>
              </svg>
            </div>
          </div>
          <div
            className="back"
            onClick={() => {
              setFlip(0);
            }}
          >
            <p
              style={{
                color: "white",
                fontWeight: "100",
                fontSize: "0.9em",
                width: "10em",
                paddingLeft: "10px",
              }}
            >
              you may fine-tune the settings of your quizzes with utmost
              precision. You can specify the number of quiz versions and control
              the distribution of different question types according to your
              preferences.
            </p>
          </div>
        </div>

        <div className={`card-carousel ${flip == 4 ? "flip flip-imm" : ""}`}>
          <div
            className="front"
            onClick={() => {
              setFlip(4);
              // setIsFlipped(!isFlipped);
            }}
          >
            <h4 className="title-carousel">Questions Setup</h4>
            <div className="bar">
              <div className="emptybar"></div>
              <div className="filledbar"></div>
            </div>

            <div className="circle-carousel">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                <circle className="stroke" cx="60" cy="60" r="50" />
                <text
                  x="19%"
                  y="40%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="circle-text"
                >
                  4
                </text>
              </svg>
            </div>
          </div>
          <div
            className="back"
            onClick={() => {
              setFlip(0);
            }}
          >
            <p
              style={{
                color: "white",
                fontWeight: "100",
                fontSize: "0.9em",
                padding: "15px",
              }}
            >
              While our AI algorithms excel at analyzing and extracting relevant
              information from the chosen materials, we provide you with the
              ability to review and modify the generated questions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Carousel;
