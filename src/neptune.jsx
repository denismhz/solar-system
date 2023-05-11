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
import { PlanetInfo } from "./planetInfo";

import { PlanetOverlay } from "./planetOverlay";
import { PlanetPath } from "./path";
import { MyContext } from "./Scene3";

export const Neptune = ({ speedChanged, getPosition, speed }) => {
  const [poss, setPos] = useState([]);
  let distanceScaleFactor = 1000000;
  const neptune = useRef();
  const group = useRef();
  const lineArr = useRef([]);

  const [posArr, setPosArr] = useState([]);

  let planetPositionIndex = useRef(0);

  const { customData } = useContext(MyContext);
  const lastPositionUpdate = useRef(0);

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Neptune";
    group.current.userData.nearOvOp = 500;
    group.current.userData.scolor = "darkblue";
  }, []);

  useFrame(({ clock }) => {
    const timeSinceLastUpdate = clock.elapsedTime - lastPositionUpdate.current;
    if (timeSinceLastUpdate >= 2 || speedChanged) {
      //console.log("gethis");
      getPosition("neptune", setPosArr, posArr, planetPositionIndex.current);
      lastPositionUpdate.current = clock.elapsedTime;
    }
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

  const changeSpeed = (newSpeed) => {
    setPos(poss.slice(0, group.current.userData.counter + 10));
    setGetAgain(true);
    console.log(poss);
    setSpeed(newSpeed);
  };

  customData.current["changeNeptuneSpeed"] = changeSpeed;
  const col = useLoader(TextureLoader, "../img/neptune/neptunemap.jpg");
  return (
    <>
      <PlanetPath
        linePos={lineArr.current}
        planet={group}
        color={"darkblue"}
        lineLength={20}
      />
      <group ref={group}>
        <PlanetOverlay planet={group} />
        <mesh ref={neptune}>
          <sphereGeometry args={[24622 / 6000, 50, 50]} />
          <meshPhongMaterial map={col} />
        </mesh>
      </group>
    </>
  );
};
