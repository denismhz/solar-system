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
import { ReactPropTypes } from "react";
import { MyContext } from "./Scene3.jsx";

export const PlanetOverlayContext = createContext();

export const SharedPlanetState = () => {
  const { customData } = useContext(MyContext);

  let [nameVis, setNameVis] = useState("visible");
  let [iconVis, setIconVis] = useState("visible");

  const handleVisibility = () => {
    if (nameVis == "visible" && iconVis == "visible") {
      setNameVis("hidden");
      console.log(nameVis);
      console.log("hiding names");
    } else if (nameVis == "hidden" && iconVis == "visible") {
      setIconVis("hidden");
      console.log(nameVis);
      console.log("hiding icons");
    } else if (nameVis == "hidden" && iconVis == "hidden") {
      setIconVis("visible");
      setNameVis("visible");
      console.log(nameVis);
      console.log("showing everything");
    }
  };
  customData.current["handleVisibility"] = handleVisibility;

  const handleReset = () => {
    setSpeed(0);
  };
  customData.current["handleReset"] = handleReset;

  //set speed (timeinterval between positions 60000ms*speed)
  const [speed, setSpeed] = useState(1);
  const updateSpeed = (newSpeed) => {
    setSpeed(newSpeed);
    speedChanged.current = true;
  };
  customData.current["updateSpeed"] = updateSpeed;

  //get position data and reset if necessary
  const dateTime = useRef(new Date(Date.now()));
  const speedChanged = useRef(false);

  const getPositions = (planet, setPosState, oldState, posCounter) => {
    //if speed was changed delete old data an get new data

    //???????Why when i set the speed to 0 it doesnt immidiatly stop? good enough for know
    if (speedChanged.current) {
      setPosState(oldState.slice(0, posCounter + 10));
      speedChanged.current = true;
    }

    if (oldState.length - posCounter < 1500 || speedChanged.current) {
      console.log("fetch");
      if (oldState.length > 0 && speed > 0) {
        dateTime.current = new Date(
          oldState[oldState.length - 1].date
        ).toUTCString();
      }

      const fetchData = async () => {
        let res = await fetch(
          `http://127.0.0.1:8000/duration/${planet}` +
            `?date=${dateTime.current}&speed=${speed}`
        );
        let response = await res.json();
        setPosState(oldState.concat(response));
        speedChanged.current = false;
      };
      fetchData();
    }
  };

  return (
    <>
      <PlanetOverlayContext.Provider value={{ nameVis, iconVis, speed }}>
        <Earth speed={speed} getPosition={getPositions} />
        <Mars speed={speed} />
        <Jupiter speed={speed} />
        <Saturn speed={speed} />
        <Mercury speed={speed} />
        <Venus speed={speed} />
        <Neptune speed={speed} />
        <Uranus speed={speed} />
        <Sun />
      </PlanetOverlayContext.Provider>
    </>
  );
};
