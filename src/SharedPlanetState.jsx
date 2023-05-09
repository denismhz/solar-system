import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import React, {
  Suspense,
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  forwardRef,
  memo,
  useMemo,
} from "react";
import { Earth } from "./earth.jsx";
import { Mars } from "./mars.jsx";
import { Jupiter } from "./jupiter.jsx";
import { Saturn } from "./saturn.jsx";
import { Mercury } from "./mercury.jsx";
import { Venus } from "./venus.jsx";
import { Neptune } from "./neptune.jsx";
import { Uranus } from "./uranus.jsx";
import { Sun } from "./sun.jsx";
import * as THREE from "three";
import { PlanetInfo } from "./planetInfo.jsx";
import { Skybox } from "./skybox.jsx";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";

export const SharedPlanetState = () => {
  const [data, setData] = useState(null);
  const [vis, setVis] = useState("hidden");
  const controls = useRef();
  const planetinfo = useRef();
  let customData = useRef({});

  function toggleVisibility() {
    console.log(vis);
    if (vis === "hidden") {
      setVis("visible");
      console.log("what");
    } else if (vis === "visible") {
      setVis("hidden");
      console.log("asdasd");
    }
  }

  function handleChange(event) {
    console.log(event.target.value);
    customData.current.changeEarthSpeed(event.target.value);
    customData.current.changeMarsSpeed(event.target.value);
    customData.current.changeVenusSpeed(event.target.value);
    customData.current.changeSaturnSpeed(event.target.value);
    customData.current.changeUranusSpeed(event.target.value);
    customData.current.changeJupiterSpeed(event.target.value);
    customData.current.changeMercurySpeed(event.target.value);
    customData.current.changeNeptuneSpeed(event.target.value);
  }

  const [speed, setSpeed] = useState();

  const updateSpeed = (newSpeed) => setSpeed(newSpeed);
  return (
    <>
      <PlanetInfo ref={planetinfo} visi={vis} />
      <Suspense fallback={null}>
        <Canvas
          camera={{
            fov: 75,
            near: 0.1,
            far: 10000000,
            position: [0, 100, 200],
          }}
        >
          <Skybox />
          <ambientLight intensity={0.5} />

          <Earth positions={data["399"]} onClick={(e) => console.log(e)} />
          <Mars positions={data["499"]} />
          <Jupiter positions={data["599"]} />
          <Saturn positions={data["699"]} />
          <Mercury positions={data["199"]} />
          <Venus positions={data["299"]} />
          <Neptune positions={data["899"]} />
          <Uranus positions={data["799"]} />
          <Sun />

          <OrbitControls ref={controls} maxZoom={10} />
        </Canvas>
      </Suspense>
    </>
  );
};
