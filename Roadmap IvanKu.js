import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnixLandingPage from "./components/AnixLandingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AnixLandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;