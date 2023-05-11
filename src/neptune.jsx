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
import { PlanetInfo } from "./planetInfo";

import { PlanetOverlay } from "./planetOverlay";
import { PlanetPath } from "./path";
import { MyContext } from "./Scene3";

export const Neptune = ({ positions }) => {
  const [poss, setPos] = useState([]);
  const [lineposs, setLinePos] = useState([]);
  const [getAgain, setGetAgain] = useState(false);
  const [speed, setSpeed] = useState(60);
  let distanceScaleFactor = 1000000;
  const neptune = useRef();
  const group = useRef();

  const firstRef = useRef(true);
  let linePoss = [];
  const { customData } = useContext(MyContext);

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Neptune";
    group.current.userData.nearOvOp = 500;
    group.current.userData.scolor = "darkblue";
  }, []);

  useFrame(() => {
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

  customData.current["changeNeptuneSpeed"] = changeSpeed;
  const col = useLoader(TextureLoader, "../img/neptune/neptunemap.jpg");
  return (
    <>
      <group ref={group}>
        <PlanetOverlay planet={group} />
        <mesh ref={neptune}>
          <sphereGeometry args={[24622 / 6000, 50, 50]} />
          <meshPhongMaterial map={col} />
        </mesh>
      </group>
    </>
  );
};
