import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Website from "./components/Website/Website";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Website />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
