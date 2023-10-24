import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

function Course(props: { code: String; name: String; id: String }) {
  return (
    <div className="course-container">
      <FontAwesomeIcon
        icon={faBook}
        style={{ color: "#C9ADA7", width: "3rem", height: "3rem" }}
      />
      <h4>
        {props.code} {props.name}
      </h4>
    </div>
  );
}
export default Course;
