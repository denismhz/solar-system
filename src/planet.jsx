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
import { PlanetOverlayContext } from "./SharedPlanetState";

export const Planet = (props) => {
  const distanceScaleFactor = 1000000;
  //These are the props i need
  let allPosArr = useRef([]);

  let speed = props.speed;
  const lineArr = useRef([]);
  const line = useRef();
  const clouds = useRef("clouds");
  const earth = useRef();
  const group = useRef();

  //let planetPositionIndex = props.planetPosIndex;
  let planetPositionIndex = useRef(0);

  useLayoutEffect(() => {
    group.current.userData.name = props.planetData.name;
    group.current.userData.nearOvOp = props.planetData.nearOvOp;
    group.current.userData.scolor = props.planetData.scolor;
  });

  useEffect(() => {
    allPosArr.current = allPosArr.current.concat(props.posArr);
  });

  useFrame(() => {
    //console.log(allPosArr.current.length);
    //console.log("arrlength" + posArr.length);
    clouds.current.rotation.y += 0.00025;
    earth.current.rotation.y += 0.00015;

    //if speed is 0 set the date to current date get from posArr
    //search for current date in posArr and set planetPositionIndex

    //if speed > 0 update positions
    if (
      true &&
      planetPositionIndex.current < allPosArr.current.length &&
      allPosArr.current.length > 0 &&
      speed > 0
    ) {
      console.log("herer");
      group.current.position.set(
        Number(
          allPosArr.current[planetPositionIndex.current].x / distanceScaleFactor
        ),
        Number(
          allPosArr.current[planetPositionIndex.current].y / distanceScaleFactor
        ),
        Number(
          allPosArr.current[planetPositionIndex.current].z / distanceScaleFactor
        )
      );
      if (speed > 0) planetPositionIndex.current += Number(1);
      lineArr.current.push(
        new THREE.Vector3(
          Number(
            allPosArr.current[planetPositionIndex.current].x /
              distanceScaleFactor
          ),
          Number(
            allPosArr.current[planetPositionIndex.current].y /
              distanceScaleFactor
          ),
          Number(
            allPosArr.current[planetPositionIndex.current].z /
              distanceScaleFactor
          )
        )
      );
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
      <PlanetPath
        linePos={lineArr.current}
        color={"lightgreen"}
        lineLength={300}
      />
      <group ref={group}>
        <PlanetOverlay planet={group} />
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
