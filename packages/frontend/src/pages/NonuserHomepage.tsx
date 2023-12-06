import quizsetupimg from "../assets/quizsetup.svg";
import materialsimg from "../assets/materials.svg";
import quizzesimg from "../assets/quizzes.svg";
import quiestionsimg from "../assets/questions.svg";
import "../nonuser.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import logo from "../assets/logo-comp.svg";
import caraval from "../assets/caraval-feature.svg";
import summary from "../assets/summary.svg";

function NonuserHomepage() {
  const particlesInit = async (main: any) => {
    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(main);
  };
  const particlesLoaded = useCallback(async () => {}, []);
  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#4a4e69",
            },
          },
          fullScreen: {
            zIndex: -1,
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#f2e9e4",
            },
            links: {
              color: "#4a4e69",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
      <div className="nonuser-navbar">
        <div className="nonuser-links">
          <a href="#">
            {" "}
            <p>EduCraft</p>{" "}
          </a>
          <a href="#home">
            {" "}
            <p>HOME</p>{" "}
          </a>
          <a href="#features">
            {" "}
            <p>FEATURES</p>{" "}
          </a>
        </div>

        <div className="sign-in">
          <a href="/signin" className="sign-in">
            <p>SIGN IN</p>
          </a>
        </div>
      </div>

      <div id="home" className="body nonuser">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="body-title">
          <h1>Forget Everything You Know About Brain Activity</h1>
          <p>
            Discover the power of AI in generating engaging quizzes and embark
            on a journey of continuous learning
          </p>
        </div>
        <div className="wrapper">
          <a className="cta" href="/signin">
            <span>Start Now</span>
            <span>
              <svg
                width="50px"
                height="33px"
                viewBox="0 0 66 43"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns-xlink="http://www.w3.org/1999/xlink"
              >
                <g
                  id="arrow"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <path
                    className="one"
                    d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                    fill="#FFFFFF"
                  ></path>
                  <path
                    className="two"
                    d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                    fill="#FFFFFF"
                  ></path>
                  <path
                    className="three"
                    d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                    fill="#FFFFFF"
                  ></path>
                </g>
              </svg>
            </span>
          </a>
        </div>
      </div>
      <div id="features" className="features">
        <h1>FEATURES</h1>
        <div className="cards-container">
          <Card
            img={materialsimg}
            title="Any Pdf, Word, Text, Video"
            paragraph="EduCraft has the ability to generate questions in various formats, including Multiple-Choice, Fill in the Blanks and True/False. Whether you provide a text, or video, EduCraft can analyze the content and create questions accordingly."
          />
          <Card
            img={quizsetupimg}
            title="play with the Settings of Your Quiz"
            paragraph="One of the key aspects of EduCraft is the flexibility to change the name and the number of each type of questions of the quiz."
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
          <Card
            img={caraval}
            title="Caraval: Interactive Sessions"
            paragraph="Instructors have the capability to initiate engaging interactive sessions following the creation of a new quiz. Students can seamlessly join these sessions by scanning the provided QR code. During these sessions, students will actively compete with one another to provide the quickest and most accurate answers. At the conclusion of the session, a podium display will showcase the participants' performances, and scores will be meticulously calculated, ensuring an enjoyable and competitive learning experience."
          />
          <Card
            img={summary}
            title="Summary"
            paragraph="Our AI system will generate summaries automatically upon the upload of new instructional materials. Instructors will have the option to download these summaries, providing a convenient and efficient means of accessing concise and relevant information from the uploaded materials."
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
