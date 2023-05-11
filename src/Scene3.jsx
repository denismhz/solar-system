import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, { Suspense, useRef, createContext, memo } from "react";

import { ScreenOverlay } from "./omnioverlay.jsx";
import { SharedPlanetState } from "./SharedPlanetState.jsx";
import { Skybox } from "./skybox.jsx";
import { CustomCamera } from "./customCamera.jsx";

export const MyContext = createContext();

const SolarSystemScene = () => {
  const controls = useRef();
  let customData = useRef({});

  return (
    <>
      <MyContext.Provider value={{ controls, customData }}>
        <ScreenOverlay />
        <Suspense fallback={null}>
          <Canvas
          /*camera={{
              position: [0, 0, 100],
              fov: 75,
              near: 0.1,
              far: 1000,
            }}*/
          >
            <CustomCamera />
            <Skybox />
            <ambientLight intensity={0.5} />
            <SharedPlanetState />
          </Canvas>
        </Suspense>
      </MyContext.Provider>
    </>
  );
};

const Smemo = memo(SolarSystemScene, true);

export default Smemo;
