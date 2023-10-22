import { useEffect } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate, useLocation } from "react-router";
import "./signin.css";
import logo from "../assets/Logo.svg";

export function Login() {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();
  let from = location.state?.from?.pathname || "/";
  useEffect(() => {
    if (route === "authenticated") {
      navigate(from, { replace: true });
    }
  }, [route, navigate, from]);

  return (
    <div style={{ backgroundColor: "#F2E9E4", minHeight: "100vh" }}>
      <div className="sign-top">
        <div style={{ marginRight: "auto" }}>
          <div className="logo">
            <img src={logo} alt="EduCraft Logo" />
          </div>
        </div>

        <div className="sign-home-link">
          <a href="/">
            <p style={{ color: "#4A4E69" }}>HOME</p>
          </a>
        </div>

      </div>

      <Authenticator loginMechanisms={['email']} components={{
        SignIn: {
          Header() {
            return <h3>Sign In</h3>
          }
        },
        SignUp: {
          Header() {
            return <h3>Sign Up</h3>
          }
        }
      }}></Authenticator>
    </div>
  );
}

