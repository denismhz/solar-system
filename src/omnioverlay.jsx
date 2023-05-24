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

export const ScreenOverlay = (props) => {
  const { customData } = useContext(MyContext);

  const handleChange = () => {
    customData.current.updateSpeed(0);
  };

  const handleChange0 = () => {
    customData.current.updateSpeed(1);
  };

  const handleChange1 = () => {
    customData.current.updateSpeed(3);
  };

  const handleReset = () => {
    customData.current.handleReset();
  };

  const handlePlanetOverlayVisibility = () => {
    customData.current.handleVisibility();
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
          <button onClick={handleChange} className="btn btn-primary">
            II
          </button>
          <button onClick={handleChange0} className="btn btn-primary">
            &gt;
          </button>
          <button onClick={handleChange1} className="btn btn-primary">
            &gt;&gt;
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
      <PlanetInfo planetInfo={props.planetInfo} />
    </>
  );
};
