import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { shaderMaterial, OrbitControls, Line } from "@react-three/drei";
import React, {
  useRef,
  Suspense,
  useLayoutEffect,
  useState,
  useContext,
} from "react";
import * as THREE from "three";
import { MyContext } from "./Scene3";
import glsl from "glslify";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { PlanetOverlay } from "./planetOverlay";
import { PlanetPath } from "./path";

export const Mars = ({ speed, getPosition, speedChanged }) => {
  const [posArr, setPosArr] = useState([]);
  const lineArr = useRef([]);
  const lastPositionUpdate = useRef(0);

  let planetPositionIndex = useRef(0);
  const mars = useRef("mars");
  const group = useRef("group");
  const col = useLoader(TextureLoader, "../img/mars/mars_1k_color.jpg");
  const bump = useLoader(TextureLoader, "../img/mars/mars_1k_topo.jpg");
  const norm = useLoader(TextureLoader, "../img/mars/mars_1k_normal.jpg");
  let distanceScaleFactor = 1000000;

  useLayoutEffect(() => {
    group.current.userData.name = "Mars";
    group.current.userData.nearOvOp = 40;
    group.current.userData.scolor = "orange";
  }, []);

  useFrame(({ clock }) => {
    //getPosition("mars", setPosArr, posArr, planetPositionIndex.current);
    const timeSinceLastUpdate = clock.elapsedTime - lastPositionUpdate.current;
    //console.log(speedChanged);
    if (timeSinceLastUpdate >= 2 || speedChanged) {
      getPosition("mars", setPosArr, posArr, planetPositionIndex.current);
      //console.log(planetPositionIndex);
      //console.log("getpos");
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

  return (
    <>
      <PlanetPath
        linePos={lineArr.current}
        planet={group}
        color={"orange"}
        lineLength={20}
      />
      <group ref={group}>
        <PlanetOverlay planet={group} />
        <mesh ref={mars}>
          <sphereGeometry args={[3389.5 / 6000, 50, 50]} />
          <meshPhongMaterial
            map={col}
            bumpMap={bump}
            normalMap={norm}
            bumpScale={0.3}
          />
        </mesh>
      </group>
    </>
  );
};
