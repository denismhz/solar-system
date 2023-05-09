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
import { PlanetInfo } from "./planetInfo";
import { PlanetPath } from "./path";
import { MyContext } from "./Scene3";

export const Earth = ({ positions, speed, getPosition, nameVis, iconVis }) => {
  let distanceScaleFactor = 1000000;
  const [poss, setPos] = useState([]);
  const [lineposs, setLinePos] = useState([]);
  const [getAgain, setGetAgain] = useState(false);
  //const [speed, setSpeed] = useState(60);
  const line = useRef();
  const clouds = useRef("clouds");
  const earth = useRef();
  const group = useRef();
  const firstRef = useRef(true);
  let linePoss = [];
  const { customData } = useContext(MyContext);

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Earth";
    group.current.userData.nearOvOp = 60;
    group.current.userData.scolor = "lightgreen";
  }, []);

  function datas() {
    return group;
  }

  useEffect(() => {
    console.log(speed);
  }, [speed]);

  let currLinePoss = [];

  useFrame(() => {
    //console.log(nameVis);
    clouds.current.rotation.y += 0.00025;
    earth.current.rotation.y += 0.00015;
    getPosition("earth", setPos, poss, group.current.userData.counter);
    console.log(poss);
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

  const col = useLoader(TextureLoader, "../img/earth/6k_earth_daymap.jpg");
  const bump = useLoader(TextureLoader, "../img/earth/earth_bump_1k.jpg");
  const spec = useLoader(
    TextureLoader,
    "../img/earth/6k_earth_specular_map.jpg"
  );
  const norm = useLoader(TextureLoader, "../img/earth/6k_earth_normal_map.jpg");
  const cloudMap = useLoader(TextureLoader, "../img/earth/6k_earth_clouds.jpg");
  const axisPoints = [
    new THREE.Vector3(0, 6371.0 / 6000 + 0.5, 0),
    new THREE.Vector3(0, -(6371.0 / 6000 + 0.5), 0),
  ];
  useLayoutEffect(() => {
    line.current.geometry.setFromPoints(axisPoints);
  });
  return (
    <>
      <group ref={group}>
        <PlanetOverlay planet={group} nameVis={nameVis} iconVis={iconVis} />
        <mesh ref={earth}>
          <sphereGeometry args={[6371.0 / 6000, 50, 50]} />
          <meshPhongMaterial
            map={col}
            bumpMap={bump}
            specularMap={spec}
            normalMap={norm}
            bumpScale={0.2}
            shininess={0.5}
          />
        </mesh>
        <mesh ref={clouds}>
          <sphereGeometry args={[6371.0 / 6000 + 0.01, 50, 50]} />
          <meshPhongMaterial map={cloudMap} transparent={true} opacity={0.5} />
        </mesh>
        <line ref={line}>
          <bufferGeometry />
          <lineBasicMaterial
            color={"hotpink"}
            transparent={true}
            opacity={0.5}
            linewidth={2}
          />
        </line>
      </group>
    </>
  );
};
