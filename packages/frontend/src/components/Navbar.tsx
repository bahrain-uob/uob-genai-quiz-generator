import Logo from "../assets/Logo.svg";

function Navbar() {
  return (
    <div>
      <nav>
        <div className="top-navbar">
          <a href="/">
            <div className="logo">
              <img src={Logo} alt="logo" />
            </div>
          </a>
        </div>

        <div className="links">
          <a href="/">
            <p>HOME</p>
          </a>
          <a href="/courses">
            <p>COURSES</p>
          </a>
          <a href="/quizzes">
            <p>QUIZZES</p>
          </a>
          <a href="/createquiz">
            <p>CREATE QUIZ</p>
          </a>
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
