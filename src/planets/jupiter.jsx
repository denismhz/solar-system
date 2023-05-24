import { useFrame, useLoader } from "@react-three/fiber";
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { PlanetOverlay } from "../planetOverlay";
import { PlanetPath } from "../path";

export const Jupiter = ({
  getPosition,
  speed,
  speedChanged,
  setPosition,
  data,
}) => {
  const group = useRef();
  const col = useLoader(TextureLoader, "../img/jupiter/jupiter2_4k.jpg");

  const [posArr, setPosArr] = useState(data);
  const lineArr = useRef([]);

  let planetPositionIndex = useRef(0);
  const lastPositionUpdate = useRef(0);

  let distanceScaleFactor = 1000000;

  useEffect(() => {
    group.current.userData.name = "Jupiter";
    group.current.userData.nearOvOp = 800;
    group.current.userData.scolor = "yellow";
  });

  useFrame(({ clock }) => {
    //getPosition("jupiter", setPosArr, posArr, planetPositionIndex.current);
    const timeSinceLastUpdate = clock.elapsedTime - lastPositionUpdate.current;
    if (timeSinceLastUpdate >= 2) {
      //console.log("gethis");
      getPosition("jupiter", setPosArr, posArr, planetPositionIndex.current);
      lastPositionUpdate.current = clock.elapsedTime;
    }

    //if speed is 0 set the date to current date get from posArr
    //search for current date in posArr an set planetPositionIndex
    setPosition(group, posArr, lineArr);
  }, []);

  return (
    <>
      <PlanetPath
        linePos={lineArr.current}
        planet={group}
        color={"yellow"}
        lineLength={400}
      />
      <group ref={group}>
        <PlanetOverlay planet={group} />
        <mesh>
          <sphereGeometry args={[69911 / 6000, 50, 50]} />
          <meshPhongMaterial map={col} />
        </mesh>
      </group>
    </>
  );
};
