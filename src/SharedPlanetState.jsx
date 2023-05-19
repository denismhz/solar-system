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

import { Planet } from "./planet.jsx";

export const SharedPlanetState = () => {
  const { customData } = useContext(MyContext);

  let [nameVis, setNameVis] = useState("visible");
  let [iconVis, setIconVis] = useState("visible");

  const lastPositionUpdate = useRef(0);

  const handleVisibility = () => {
    if (nameVis == "visible" && iconVis == "visible") {
      setNameVis("hidden");
    } else if (nameVis == "hidden" && iconVis == "visible") {
      setIconVis("hidden");
    } else if (nameVis == "hidden" && iconVis == "hidden") {
      setIconVis("visible");
      setNameVis("visible");
    }
  };
  customData.current["handleVisibility"] = handleVisibility;

  const handleReset = () => {
    setSpeed(0);
  };
  customData.current["handleReset"] = handleReset;

  //set speed (timeinterval between positions 60000ms*speed)
  const [speed, setSpeed] = useState(60);
  const updateSpeed = (newSpeed) => {
    setSpeed(newSpeed);
    setSpeedChanged(true);
  };
  customData.current["updateSpeed"] = updateSpeed;

  //get position data and reset if necessary
  const dateTime = useRef(new Date(Date.now()));
  const [speedChanged, setSpeedChanged] = useState();

  const getPositions = (planet, setPosState, oldState, posCounter) => {
    //if speed was changed delete old data an get new data

    //???????Why when i set the speed to 0 it doesnt immidiatly stop? good enough for know
    if (speedChanged) {
      //console.log(oldState.length);
      //console.log(posCounter);
      setPosState(oldState.slice(0, 500));

      //console.log("here" + speedChanged);
    }

    if (oldState.length - posCounter < 1000 || speedChanged) {
      //console.log("there" + speedChanged);
      setSpeedChanged(false);
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
      };

      fetchData();
    }
    //console.log(oldState.length);
  };

  const dataRef = useRef(null);
  const loadingRef = useRef(false);
  const errRef = useRef(null);

  useFrame(({ clock }) => {
    const fetchData = async () => {
      fetch(`http://127.0.0.1:8000/duration`).then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        loadingRef.current = true;
        response
          .json()
          .then((data) => {
            dataRef.current = data;
            errRef.current = null;
          })
          .catch((err) => {
            dataRef.current = null;
            errRef.current = err.message;
          })
          .finally(() => {
            loadingRef.current = false;
          });
      });
    };
    const timeSinceLastUpdate = clock.elapsedTime - lastPositionUpdate.current;
    if (timeSinceLastUpdate >= 5) {
      fetchData();
      console.log(dataRef.current);
      lastPositionUpdate.current = clock.elapsedTime;
    }
  });

  return (
    <>
      <PlanetOverlayContext.Provider value={{ nameVis, iconVis, speed }}>
        <Earth
          speed={speed}
          getPosition={getPositions}
          speedChanged={speedChanged}
        />
        <Mars
          speed={speed}
          getPosition={getPositions}
          speedChanged={speedChanged}
        />
        <Jupiter speed={speed} getPosition={getPositions} />
        <Saturn speed={speed} getPosition={getPositions} />
        <Mercury speed={speed} getPosition={getPositions} />
        <Venus speed={speed} getPosition={getPositions} />
        <Neptune speed={speed} getPosition={getPositions} />
        <Uranus speed={speed} getPosition={getPositions} />
        <Sun />
      </PlanetOverlayContext.Provider>
    </>
  );
};
