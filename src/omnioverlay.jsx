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
          min="10"
          max="190"
          step="60"
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
