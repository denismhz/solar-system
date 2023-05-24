import { useFrame, useLoader } from "@react-three/fiber";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import * as THREE from "three";

import { TextureLoader } from "three/src/loaders/TextureLoader";

import "../styles.css";

import { PlanetOverlay } from "../planetOverlay";

import { PlanetPath } from "../path";

export const Earth = ({
  speed,
  getPosition,
  speedChanged,
  data,
  setPosition,
}) => {
  let distanceScaleFactor = 1000000;
  const [posArr, setPosArr] = useState(data);
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

  useEffect(() => {}, []);
  useFrame(({ clock }) => {
    const timeSinceLastUpdate = clock.elapsedTime - lastPositionUpdate.current;
    if (timeSinceLastUpdate >= 3) {
      //console.log("gethis");
      getPosition("earth", setPosArr, posArr);
      lastPositionUpdate.current = clock.elapsedTime;
      //console.log(posArr);
      //console.log(group.current);
    }
    //console.log("arrlength" + posArr.length);
    clouds.current.rotation.y += 0.00025;
    earth.current.rotation.y += 0.00015;

    if (posArr) setPosition(group, posArr, lineArr);

    //if speed is 0 set the date to current date get from posArr
    //search for current date in posArr an set planetPositionIndex
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
        {true && (
          <line ref={line}>
            <bufferGeometry />
            <lineBasicMaterial
              color={"hotpink"}
              transparent={true}
              opacity={0.5}
              linewidth={2}
            />
          </line>
        )}
      </group>
    </>
  );
};
