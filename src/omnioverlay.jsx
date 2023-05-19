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
      {/* <div className="slidecontainer">
        <input
          type="range"
          min="30"
          max="120"
          step="30"
          className="slider"
          id="myRange"
          onChange={handleChange}
        /> */}
      <div className="btn-toolbar slidecontainer">
        <div className="btn-group mr-2" role="group">
          <button onClick={handleReset} className="btn btn-primary">
            &lt;
          </button>
          <button onClick={handleReset} className="btn btn-primary">
            &gt;
          </button>
          <button
            onClick={handlePlanetOverlayVisibility}
            className="btn btn-primary"
          >
            &gt;&gt;
          </button>
          <button
            onClick={handlePlanetOverlayVisibility}
            className="btn btn-primary"
          >
            &gt;&gt;&gt;
          </button>
        </div>
        <div className="btn-group" role="group">
          <button
            onClick={handlePlanetOverlayVisibility}
            className="btn btn-primary"
          >
            O
          </button>
        </div>
      </div>
      <PlanetInfo />
    </>
  );
};
