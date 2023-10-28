import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Materials from "./pages/Materials.tsx";
import Courses from "./pages/Courses.tsx";
import QuizGeneration from "./pages/QuizGeneration.tsx";
import Quizzes from "./pages/Quizzes";
import { Amplify, Auth } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import { RequireAuth } from "./RequireAuth.tsx";
import { Login } from "./pages/SignIn.tsx";
import Home from "./components/Home.tsx";

Amplify.configure({
  Auth: {
    region: import.meta.env.VITE_APP_REGION,
    userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
    identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "api",
        endpoint: import.meta.env.VITE_APP_API_URL,
        region: import.meta.env.VITE_APP_REGION,
        custom_header: async () => { return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` } }
      },
    ],
  },
  Storage: {
    AWSS3: {
      bucket: import.meta.env.VITE_APP_MATERIAL_BUCKET,
      region: import.meta.env.VITE_APP_REGION,
      customPrefix: {
        public: "",
        protected: "",
        private: "",
      }
    }
  }
});


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/Materials"
            element={
              <RequireAuth>
                <Materials />
              </RequireAuth>
            }
          />
          <Route
            path="/Courses"
            element={
              <RequireAuth>
                <Courses />
              </RequireAuth>
            }
          />
          <Route
            path="/createQuiz"
            element={
              <RequireAuth>
                <QuizGeneration />
              </RequireAuth>
            }
          />
          <Route
            path="/quizzes"
            element={
              <RequireAuth>
                <Quizzes />
              </RequireAuth>
            }
          />
          <Route path="/signin" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  </React.StrictMode>
);
