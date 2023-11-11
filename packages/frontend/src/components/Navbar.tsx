import Logo from "../assets/Logo.svg";

function Navbar(props: { active: string }) {
  return (
    <div>
      <nav>
        <div className="top-navbar" style={{ padding: "20px 0px 7px 0px" }}>
          <a href="/">
            <img src={Logo} alt="logo" style={{ width: "170px" }} />
          </a>
        </div>

        <div className="links">
          <a href="/">
            <p>HOME</p>
          </a>
          <a
            href="/courses"
            className={props.active == "courses" ? "active courses" : ""}
          >
            <p>COURSES</p>
          </a>
          <a
            href="/quizzes"
            className={props.active == "quizzes" ? "active quiz" : ""}
          >
            <p>QUIZZES</p>
          </a>
          <a
            href="/createquiz"
            className={props.active == "createquiz" ? "active createquiz" : ""}
          >
            <p>CREATE QUIZ</p>
          </a>
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
