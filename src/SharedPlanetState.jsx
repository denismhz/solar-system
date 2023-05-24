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
import { Earth } from "./planets/earth.jsx";
import { Mars } from "./planets/mars.jsx";
import { Jupiter } from "./planets/jupiter.jsx";
import { Saturn } from "./planets/saturn.jsx";
import { Mercury } from "./planets/mercury.jsx";
import { Venus } from "./planets/venus.jsx";
import { Neptune } from "./planets/neptune.jsx";
import { Uranus } from "./planets/uranus.jsx";
import { Sun } from "./planets/sun.jsx";
import * as THREE from "three";
import { PlanetInfo } from "./planetInfo.jsx";
import { Skybox } from "./skybox.jsx";
import { ReactPropTypes } from "react";
import { MyContext } from "./Scene3.jsx";

export const PlanetOverlayContext = createContext();

import { Planet } from "./planet.jsx";

export const SharedPlanetState = ({ initialData }) => {
  const distanceScaleFactor = 1000000;
  const { customData } = useContext(MyContext);

  const lastGetRequestRef = useRef(0);
  const currentPosIndexRef = useRef(0);
  const getNewDataThresholdRef = 5000;
  const currentSpeedRef = useRef(0);
  const planetPositionIndex = useRef(0);

  let [nameVis, setNameVis] = useState("visible");
  let [iconVis, setIconVis] = useState("visible");

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
    setSpeed(-1);
  };
  customData.current["handleReset"] = handleReset;

  //set speed (timeinterval between positions 60000ms*speed)
  const [speed, setSpeed] = useState(1);
  const updateSpeed = (newSpeed) => {
    setSpeed(newSpeed);
    setSpeedChanged(true);
    console.log(speed);
  };
  customData.current["updateSpeed"] = updateSpeed;

  //get position data and reset if necessary
  const dateTime = useRef(new Date(Date.now()));
  const [speedChanged, setSpeedChanged] = useState();

  function updatePlanetPosition(group, posArr, lineArr) {
    if (true && planetPositionIndex.current < posArr.length) {
      group.current.position.set(
        Number(
          posArr[planetPositionIndex.current].position.x / distanceScaleFactor
        ),
        Number(
          posArr[planetPositionIndex.current].position.y / distanceScaleFactor
        ),
        Number(
          posArr[planetPositionIndex.current].position.z / distanceScaleFactor
        )
      );
      if (speed > 0) planetPositionIndex.current += Number(speed);
      lineArr.current.push(
        new THREE.Vector3(
          Number(
            posArr[planetPositionIndex.current].position.x / distanceScaleFactor
          ),
          Number(
            posArr[planetPositionIndex.current].position.y / distanceScaleFactor
          ),
          Number(
            posArr[planetPositionIndex.current].position.z / distanceScaleFactor
          )
        )
      );
    }
  }

  const getPositions = (planet, setPosState, oldState) => {
    //if speed was changed delete old data an get new data

    //???????Why when i set the speed to 0 it doesnt immidiatly stop? good enough for know
    /*    if (speedChanged) {
      //console.log(oldState.length);
      //console.log(posCounter);
      setPosState(oldState.slice(0, 500));

      //console.log("here" + speedChanged);
    } */

    if (oldState.length - planetPositionIndex.current < 15000) {
      //console.log("there" + speedChanged);
      setSpeedChanged(false);
      if (oldState.length > 0 && speed > 0) {
        dateTime.current = new Date(
          oldState[oldState.length - 1].date
        ).toUTCString();
      }

      const fetchData = async () => {
        fetch(
          `http://127.0.0.1:8000/duration/${planet}` +
            `?date=${dateTime.current}&speed=${speed}`
        ).then((response) => {
          if (!response.ok) {
            throw new Error(
              `This is an HTTP error: The status is ${response.status}`
            );
          }
          loadingRef.current = true;
          response
            .json()
            .then((data) => {
              setPosState(oldState.concat(data));
              setData(data);
              dataRef.current = data;
              errRef.current = null;
            })
            .catch((err) => {
              setData(null);
              dataRef.current = null;
              errRef.current = err.message;
            })
            .finally(() => {
              loadingRef.current = false;
            });
        });
      };
      fetchData();
    }

    //console.log(oldState.length);
  };

  const dataRef = useRef(null);
  const loadingRef = useRef(false);
  const errRef = useRef(null);
  const [data, setData] = useState(null);

  useFrame(({ clock }) => {
    //console.log(initialData);
    /* handlePositionIndex();
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
            setData(data);
            dataRef.current = data;
            errRef.current = null;
          })
          .catch((err) => {
            setData(null);
            dataRef.current = null;
            errRef.current = err.message;
          })
          .finally(() => {
            loadingRef.current = false;
          });
      });
    };
    const timeSinceLastUpdate = clock.elapsedTime - lastGetRequestRef.current;
    if (timeSinceLastUpdate >= 5) {
      fetchData();
      console.log(dataRef.current);
      lastGetRequestRef.current = clock.elapsedTime;
    } */
  });

  function handlePositionIndex() {
    currentPosIndexRef.current++;
  }

  return (
    <>
      <PlanetOverlayContext.Provider value={{ nameVis, iconVis, speed }}>
        {initialData && (
          <>
            <Earth
              speed={speed}
              getPosition={getPositions}
              speedChanged={speedChanged}
              data={initialData["399"]}
              setPosition={updatePlanetPosition}
            />
            <Mars
              speed={speed}
              getPosition={getPositions}
              speedChanged={speedChanged}
              data={initialData["499"]}
              setPosition={updatePlanetPosition}
            />
            <Jupiter
              speed={speed}
              getPosition={getPositions}
              data={initialData["599"]}
              setPosition={updatePlanetPosition}
            />
            <Saturn
              speed={speed}
              getPosition={getPositions}
              data={initialData["699"]}
              setPosition={updatePlanetPosition}
            />
            <Mercury
              speed={speed}
              getPosition={getPositions}
              data={initialData["199"]}
              setPosition={updatePlanetPosition}
            />

            <Venus
              speed={speed}
              getPosition={getPositions}
              data={initialData["299"]}
              setPosition={updatePlanetPosition}
            />
            <Neptune
              speed={speed}
              getPosition={getPositions}
              data={initialData["899"]}
              setPosition={updatePlanetPosition}
            />
            <Uranus
              speed={speed}
              getPosition={getPositions}
              data={initialData["799"]}
              setPosition={updatePlanetPosition}
            />
            <Sun />
          </>
        )}
        {false && (
          <Planet
            posArr={data["199"]}
            planetPosIndex={currentPosIndexRef}
            speed={speed}
          />
        )}
      </PlanetOverlayContext.Provider>
    </>
  );
};
