import { useFrame, useLoader } from "@react-three/fiber";
import React, { useRef, useLayoutEffect, useState } from "react";
import * as THREE from "three";
import glsl from "glslify";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import "../styles.css";

import { PlanetOverlay } from "../planetOverlay";
import { PlanetPath } from "../path";

export const Uranus = ({
  speed,
  speedChanged,
  getPosition,
  setPosition,
  data,
}) => {
  let distanceScaleFactor = 1000000;
  const [posArr, setPosArr] = useState(data);
  const lineArr = useRef([]);
  const lastPositionUpdate = useRef(0);

  let planetPositionIndex = useRef(0);

  const uranus = useRef();
  const group = useRef();

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Uranus";
    group.current.userData.nearOvOp = 350;
    group.current.userData.scolor = "lightblue";
  }, []);

  useFrame(({ clock }) => {
    const timeSinceLastUpdate = clock.elapsedTime - lastPositionUpdate.current;
    if (timeSinceLastUpdate >= 2) {
      //console.log("gethis");
      getPosition("uranus", setPosArr, posArr, planetPositionIndex.current);
      lastPositionUpdate.current = clock.elapsedTime;
    }
    //console.log("arrlength" + posArr.length);

    //if speed is 0 set the date to current date get from posArr
    //search for current date in posArr an set planetPositionIndex
    setPosition(group, posArr, lineArr);
  }, []);

  const col = useLoader(TextureLoader, "../img/uranus/uranusmap.jpg");
  return (
    <>
      <PlanetPath
        linePos={lineArr.current}
        planet={group}
        color={"lightblue"}
        lineLength={200}
      />
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
