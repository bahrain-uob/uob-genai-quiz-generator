import { useAuthenticator } from "@aws-amplify/ui-react";
import Logo from "../assets/Logo.svg";
import { clearAll, clearQuiz } from "../lib/helpers";

function Navbar(props: { active: string }) {
  const { signOut: innerSignOut } = useAuthenticator(
    (context: { signOut: any }) => [context.signOut],
  );

  const signOut = () => {
    clearAll();
    innerSignOut();
  };

  return (
    <div>
      <nav>
        <div className="navbar">
          <div className="links">
            <a href="/">
              <img src={Logo} alt="logo" style={{ width: "170px" }} />
            </a>
            <a href="/" className={props.active == "home" ? "active" : ""}>
              <p>HOME</p>
            </a>
            <a
              href="/courses"
              className={props.active == "courses" ? "active" : ""}
            >
              <p>COURSES</p>
            </a>
            <a
              href="/quizzes"
              className={props.active == "quizzes" ? "active" : ""}
            >
              <p>QUIZZES</p>
            </a>
            <a
              href="/createquiz"
              onClick={clearQuiz}
              className={props.active == "createquiz" ? "active" : ""}
            >
              <p>CREATE QUIZ</p>
            </a>
          </div>
          <div className="sign-out">
            <a onClick={signOut}>
              <p>SIGN OUT</p>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
