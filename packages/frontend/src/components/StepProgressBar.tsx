import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
function StepProgressBar(props: { stepNo: number }) {
  return (
    <div className="stepper-wrapper">
      <div
        className={props.stepNo == 0 ? "stepper-item active" : "stepper-item"}
      >
        <div className="step-counter">
          {props.stepNo > 0 && (
            <FontAwesomeIcon
              icon={faCircleCheck}
              style={{ color: "#3eb526", width: "20px", height: "20px" }}
            />
          )}
        </div>
        <div className="step-name">Select Material</div>
      </div>

      <div
        className={props.stepNo == 1 ? "stepper-item active" : "stepper-item"}
      >
        <div className="step-counter">
          {props.stepNo > 1 && (
            <FontAwesomeIcon
              icon={faCircleCheck}
              style={{ color: "#3eb526", width: "20px", height: "20px" }}
            />
          )}
        </div>
        <div className="step-name">Quiz Setup</div>
      </div>

      <div
        className={props.stepNo == 2 ? "stepper-item active" : "stepper-item"}
      >
        <div className="step-counter">
          {props.stepNo > 2 && (
            <FontAwesomeIcon
              icon={faCircleCheck}
              style={{ color: "#3eb526", width: "20px", height: "20px" }}
            />
          )}
        </div>
        <div className="step-name">Questions Setup</div>
      </div>

      <div
        className={props.stepNo == 3 ? "stepper-item activ" : "stepper-item"}
      >
        <div className="step-counter">
          {props.stepNo > 3 && (
            <FontAwesomeIcon
              icon={faCircleCheck}
              style={{ color: "#3eb526", width: "20px", height: "20px" }}
            />
          )}
        </div>
        <div className="step-name">Review</div>
      </div>
    </div>
  );
}

export default StepProgressBar;
