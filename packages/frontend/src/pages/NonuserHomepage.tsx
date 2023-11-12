import Logo from "../assets/Logo.svg";
import quizsetupimg from "../assets/quizsetup.svg";
import materialsimg from "../assets/materials.svg";
import quizzesimg from "../assets/quizzes.svg";
import quiestionsimg from "../assets/quiestions.svg";
import "../nonuser.css";

function NonuserHomepage() {
  return (
    <>
      <div className="homepage-logo logo">
        <img src={Logo} alt="logo" />

        <a href="/signin" className="sign-in">
          <p>SIGN IN</p>
        </a>
      </div>
      <div className="nonuser-navbar">
        <a href="#home">
          {" "}
          <p>+HOME</p>{" "}
        </a>
        <a href="#features">
          {" "}
          <p>+FEATURES</p>{" "}
        </a>
      </div>

      <div id="home" className="body">
        <div className="body-title">
          <p>AI Quiz Generator</p>
          <p>
            Discover the power of AI in generating engaging quizzes and embark
            on a journey of continuous learning!
          </p>
        </div>
        <a href="/signin">
          <button>START NOW</button>
        </a>
      </div>
      <div id="features" className="features">
        <h1>FEATURES</h1>
        <div className="cards-container">
          <Card
            img={materialsimg}
            title="Any Pdf, Word, Text, Video, Link"
            paragraph="EduCraft has the ability to generate questions in various formats, including Multiple-Choice, Fill in the Blanks, True/False, Matching, and Blooms Taxonomy levels. Whether you provide a text, link, or video, EduCraft can analyze the content and create questions accordingly."
          />
          <Card
            img={quizsetupimg}
            title="play with the Settings of Your Quiz"
            paragraph="One of the key aspects of EduCraft is the flexibility to change the number of each type of questions and the number of versions of the quiz."
          />
          <Card
            img={quiestionsimg}
            title="Questions Customization"
            paragraph="Customizing quiz questions allows for a tailored and personalized assessment experience. By selecting some of the generated questions and editing them, quiz creators can align the content with specific learning objectives or cater to ensure accuracy, clarity, and appropriateness of the content."
          />
          <Card
            img={quizzesimg}
            title="Save Your Quizzes"
            paragraph="The ability to save generated questions for future editing or publishing is a valuable feature in EduCraft. It allows quiz organizers to streamline the process and efficiently manage their question bank. By saving the generated questions, they can revisit and edit them at a later time, making necessary modifications or improvements."
          />
        </div>
      </div>
      <footer>Copyright © {new Date().getFullYear()}</footer>
    </>
  );
}
function Card(props: { img: string; title: String; paragraph: String }) {
  return (
    <div className="card">
      <img src={props.img} alt="img" />
      <h3>{props.title}</h3>
      <p>{props.paragraph}</p>
    </div>
  );
}
export default NonuserHomepage;
