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

export const Earth = ({ speed, getPosition, speedChanged }) => {
  let distanceScaleFactor = 1000000;
  const [posArr, setPosArr] = useState([]);
  const lineArr = useRef([]);
  const line = useRef();
  const clouds = useRef("clouds");
  const earth = useRef();
  const group = useRef();
  const first = useRef(true);
  const lastPositionUpdate = useRef(0);

  let planetPositionIndex = useRef(0);

  useLayoutEffect(() => {
    group.current.userData.name = "Earth";
    group.current.userData.nearOvOp = 60;
    group.current.userData.scolor = "lightgreen";
  });

  useFrame(({ clock }) => {
    const timeSinceLastUpdate = clock.elapsedTime - lastPositionUpdate.current;
    if (timeSinceLastUpdate >= 2 || speedChanged) {
      //console.log("gethis");
      getPosition("earth", setPosArr, posArr, planetPositionIndex.current);
      lastPositionUpdate.current = clock.elapsedTime;
      //console.log(group.current);
    }
    //console.log("arrlength" + posArr.length);
    clouds.current.rotation.y += 0.00025;
    earth.current.rotation.y += 0.00015;

    //if speed is 0 set the date to current date get from posArr
    //search for current date in posArr an set planetPositionIndex
    if (speed == 0) planetPositionIndex.current = 0;
    if (
      true &&
      planetPositionIndex.current < posArr.length &&
      posArr.length > 0
    ) {
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
      planetPositionIndex.current += Number(1);
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
        planet={group}
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
