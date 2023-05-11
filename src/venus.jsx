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
import { PlanetPath } from "./path";
import { MyContext } from "./Scene3";

export const Venus = ({ speed, speedChanged, getPosition }) => {
  let distanceScaleFactor = 1000000;
  const [posArr, setPosArr] = useState([]);
  const lineArr = useRef([]);
  const lastPositionUpdate = useRef(0);

  let planetPositionIndex = useRef(0);
  const venus = useRef();
  const group = useRef();
  const { customData } = useContext(MyContext);

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Venus";
    group.current.userData.nearOvOp = 20;
    group.current.userData.scolor = "brown";
  }, []);

  useFrame(({ clock }) => {
    const timeSinceLastUpdate = clock.elapsedTime - lastPositionUpdate.current;
    if (timeSinceLastUpdate >= 2 || speedChanged) {
      //console.log("gethis");
      getPosition("venus", setPosArr, posArr, planetPositionIndex.current);
      lastPositionUpdate.current = clock.elapsedTime;
    }
    //console.log("arrlength" + posArr.length);

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

  const col = useLoader(TextureLoader, "../img/venus/venusmap.jpg");
  const bump = useLoader(TextureLoader, "../img/venus/venusbump.jpg");
  return (
    <>
      <PlanetPath
        linePos={lineArr.current}
        planet={group}
        color={"brown"}
        lineLength={100}
      />
      <group ref={group}>
        <PlanetOverlay planet={group} />
        <mesh ref={venus}>
          <sphereGeometry args={[6051.8 / 6000, 50, 50]} />
          <meshPhongMaterial map={col} bumpMap={bump} bumpScale={0.3} />
        </mesh>
      </group>
    </>
  );
};
