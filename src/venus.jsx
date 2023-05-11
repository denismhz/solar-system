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

export const Venus = ({ positions }) => {
  let distanceScaleFactor = 1000000;
  const venus = useRef();
  const group = useRef();
  const firstRef = useRef(true);
  const [poss, setPos] = useState([]);
  const [lineposs, setLinePos] = useState([]);
  const [getAgain, setGetAgain] = useState(false);
  const [speed, setSpeed] = useState(60);
  const { customData } = useContext(MyContext);

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Venus";
    group.current.userData.nearOvOp = 20;
    group.current.userData.scolor = "brown";
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
    if (false && group.current.userData.counter < poss.length) {
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

  customData.current["changeVenusSpeed"] = changeSpeed;

  const col = useLoader(TextureLoader, "../img/venus/venusmap.jpg");
  const bump = useLoader(TextureLoader, "../img/venus/venusbump.jpg");
  return (
    <>
      <group ref={group}>
        <PlanetOverlay planet={group} />
        <mesh ref={venus}>
          <sphereGeometry args={[6051.8 / 6000, 50, 50]} />
          <meshPhongMaterial map={col} bumpMap={bump} bumpScale={0.3} />
        </mesh>
      </group>
    </>
  );
};
