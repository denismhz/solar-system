import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import {
  shaderMaterial,
  OrbitControls,
  Line,
  Html,
  Text,
} from "@react-three/drei";
import React, {
  useRef,
  Suspense,
  useLayoutEffect,
  useState,
  useEffect,
  useContext,
} from "react";
import * as THREE from "three";
import glsl from "glslify";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
  Scanline,
} from "@react-three/postprocessing";
import "./styles.css";

import { PlanetOverlay } from "./planetOverlay";
import { PlanetPath } from "./path";
import { MyContext } from "./Scene3";

export const Uranus = ({ positions }) => {
  let distanceScaleFactor = 1000000;

  const [poss, setPos] = useState([]);
  const [lineposs, setLinePos] = useState([]);
  const [getAgain, setGetAgain] = useState(false);
  const [speed, setSpeed] = useState(60);
  const uranus = useRef();
  const group = useRef();

  const firstRef = useRef(true);
  let linePoss = [];
  const { customData } = useContext(MyContext);

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Uranus";
    group.current.userData.nearOvOp = 350;
    group.current.userData.scolor = "lightblue";
  }, []);

  useFrame(() => {
    if (poss.length % 1000 == 0) {
      setPos(poss.slice(0, 500));
    }
    let date;
    if (firstRef.current) {
      date = new Date(Date.now());
      date.setMilliseconds(0);
      date.setSeconds(0);
    }
    //console.log(poss.length);
    //console.log(group.current.userData.counter);
    if (false && group.current.userData.counter % 250 == 0 && getAgain) {
      if (!firstRef.current)
        date = new Date(poss[poss.length - 1].date).toUTCString();
      const fetchData = async () => {
        let res = await fetch(
          `http://127.0.0.1:8000/duration/uranus?date=${date}&speed=${speed}` //example and simple data
        );
        let response = await res.json();

        setPos(poss.concat(response)); // parse json
        firstRef.current = false;
        setGetAgain(false);
        //console.log(`psss : ${poss.length}`);
      };
      fetchData();
    }
    if (true && group.current.userData.counter < poss.length) {
      group.current.position.set(
        Number(
          poss[group.current.userData.counter].position.x / distanceScaleFactor
        ),
        Number(
          poss[group.current.userData.counter].position.y / distanceScaleFactor
        ),
        Number(
          poss[group.current.userData.counter].position.z / distanceScaleFactor
        )
      );
      //console.log(group.current.userData.counter);
      group.current.userData.counter++;
    }
  }, []);

  const changeSpeed = (newSpeed) => {
    setPos(poss.slice(0, group.current.userData.counter + 10));
    setGetAgain(true);
    console.log(poss);
    setSpeed(newSpeed);
  };

  customData.current["changeUranusSpeed"] = changeSpeed;

  const col = useLoader(TextureLoader, "../img/uranus/uranusmap.jpg");
  return (
    <>
      <group ref={group}>
        <PlanetOverlay planet={group} />
        <mesh ref={uranus}>
          <sphereGeometry args={[25362 / 6000, 50, 50]} />
          <meshPhongMaterial map={col} />
        </mesh>
      </group>
    </>
  );
};
