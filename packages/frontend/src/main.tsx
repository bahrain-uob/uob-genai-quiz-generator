import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage.tsx";
import Materials from "./pages/Materials.tsx";
import Courses from "./pages/Courses.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Materials" element={<Materials />} />
        <Route path="/Courses" element={<Courses />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
