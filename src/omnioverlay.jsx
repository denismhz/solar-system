import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, {
  Suspense,
  useRef,
  createContext,
  memo,
  useContext,
} from "react";

import { PlanetInfo } from "./planetInfo.jsx";
import { MyContext } from "./Scene3.jsx";

export const ScreenOverlay = () => {
  const { customData } = useContext(MyContext);

  const handleChange = (event) => {
    customData.current.updateSpeed(event.target.value);
  };

  const handleReset = () => {
    customData.current.handleReset();
    console.log("reset");
  };

  const handlePlanetOverlayVisibility = () => {
    customData.current.handleVisibility();
    console.log("asd");
  };

  return (
    <>
      <div className="slidecontainer">
        <input
          type="range"
          min="30"
          max="120"
          step="30"
          className="slider"
          id="myRange"
          onChange={handleChange}
        />
        <button onClick={handleReset}>Reset</button>
        <button onClick={handlePlanetOverlayVisibility}>Hide things</button>
      </div>
      <PlanetInfo />
    </>
  );
};
