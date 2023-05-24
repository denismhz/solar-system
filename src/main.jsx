import { BrowserRouter, Routes, Route } from "react-router-dom";
import Scene from "./Scene1";
import Scene1 from "./Scene2";
import SolarSystemScene from "./Scene3";
import Smemo from "./Scene3";
import React, { useEffect, useReducer, useState, useRef } from "react";
import SunScene from "./sunscene";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Scene />} />
        <Route path="next" element={<Scene1 />} />
        <Route path="solarsystem" element={<Smemo />} />
        <Route path="sun" element={<SunScene />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
