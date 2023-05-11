import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { shaderMaterial, OrbitControls, Line } from "@react-three/drei";
import React, {
  useRef,
  Suspense,
  useLayoutEffect,
  useEffect,
  useState,
  useContext,
} from "react";
import * as THREE from "three";
import glsl from "glslify";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { PlanetOverlay } from "./planetOverlay";
import { PlanetPath } from "./path";
import { MyContext } from "./Scene3";

export const Jupiter = ({ getPosition, speed, speedChanged }) => {
  const group = useRef();
  const col = useLoader(TextureLoader, "../img/jupiter/jupiter2_4k.jpg");

  const [posArr, setPosArr] = useState([]);
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
    if (timeSinceLastUpdate >= 2 || speedChanged) {
      //console.log("gethis");
      getPosition("jupiter", setPosArr, posArr, planetPositionIndex.current);
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
      //console.log(posArr.length);
      //console.log(planetPositionIndex.current);
    }
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
