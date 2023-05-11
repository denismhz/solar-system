import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import React, {
  useRef,
  Suspense,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import * as THREE from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import "./styles.css";

import { PlanetOverlay } from "./planetOverlay";
import { PlanetPath } from "./path";

export const Mercury = ({ speed, getPosition, speedChanged }) => {
  const [posArr, setPosArr] = useState([]);
  const lineArr = useRef([]);
  let planetPositionIndex = useRef(0);
  let distanceScaleFactor = 1000000;
  const mercury = useRef();
  const lastPositionUpdate = useRef(0);
  const group = useRef();

  useLayoutEffect(() => {
    group.current.userData.name = "Mercury";
    group.current.userData.nearOvOp = 20;
    group.current.userData.scolor = "#a34f5f";
  }, []);

  useFrame(({ clock }) => {
    //getPosition("mercury", setPosArr, posArr, planetPositionIndex.current);
    const timeSinceLastUpdate = clock.elapsedTime - lastPositionUpdate.current;
    if (timeSinceLastUpdate >= 2 || speedChanged) {
      //console.log("gethis");
      getPosition("mercury", setPosArr, posArr, planetPositionIndex.current);
      lastPositionUpdate.current = clock.elapsedTime;
    }

    //if speed is 0 set the date to current date get from posArr
    //search for current date in posArr an set planetPositionIndex
    if (speed == 0) planetPositionIndex.current = 0;
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
  const col = useLoader(TextureLoader, "../img/mercury/mercurymap.jpg");
  const bump = useLoader(TextureLoader, "../img/mercury/mercurybump.jpg");
  return (
    <>
      <PlanetPath
        linePos={lineArr.current}
        planet={group}
        color={"#a34f5f"}
        lineLength={100}
      />
      <group ref={group}>
        <PlanetOverlay planet={group} />
        <mesh ref={mercury}>
          <sphereGeometry args={[2439.7 / 6000, 50, 50]} />
          <meshPhongMaterial map={col} bumpMap={bump} bumpScale={0.3} />
        </mesh>
      </group>
    </>
  );
};
