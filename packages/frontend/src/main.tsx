import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage.tsx";
import Materials from "./pages/Materials.tsx";
import Courses from "./pages/Courses.tsx";
import QuizGeneration from "./pages/QuizGeneration.tsx";
import Quizzes from "./pages/Quizzes";
import NonuserHomepage from "./pages/NonuserHomepage.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NonuserHomepage />} />
        <Route path="/Home" element={<Homepage />} />
        <Route path="/Materials" element={<Materials />} />
        <Route path="/Courses" element={<Courses />} />
        <Route path="/createQuiz" element={<QuizGeneration />} />
        <Route path="/quizzes" element={<Quizzes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
