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

export const MyContext = createContext();
export const OtherContext = createContext();

import { SharedPlanetState } from "./SharedPlanetState.jsx";

const SolarSystemScene = () => {
  const [data, setData] = useState(null);
  const [vis, setVis] = useState("hidden");
  const controls = useRef();
  const planetinfo = useRef();
  let customData = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      let res = await fetch(
        "http://127.0.0.1:8000/duration?date=2023-08-06T21:53" //example and simple data
      );
      let response = await res.json();
      setData(response); // parse json
      //console.log(response);
    };
    fetchData();
  }, []);

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

  if (data)
    return (
      <>
        <div className="slidecontainer">
          <input
            type="range"
            min="10"
            max="360"
            className="slider"
            onChange={handleChange}
            id="myRange"
          />
        </div>
        <MyContext.Provider value={{ controls, toggleVisibility, customData }}>
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
        </MyContext.Provider>
      </>
    );
};

const Smemo = memo(SolarSystemScene, true);

export default Smemo;
