import { useFrame, useLoader } from "@react-three/fiber";
import React, { useRef, useLayoutEffect, useState, useContext } from "react";
import * as THREE from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import "../styles.css";

import { PlanetOverlay } from "../planetOverlay";
import { PlanetPath } from "../path";
import { MyContext } from "../Scene3";

export const Neptune = ({
  speedChanged,
  getPosition,
  speed,
  setPosition,
  data,
}) => {
  const [poss, setPos] = useState(data);
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
    if (timeSinceLastUpdate >= 2) {
      //console.log("gethis");
      getPosition("neptune", setPosArr, posArr, planetPositionIndex.current);
      lastPositionUpdate.current = clock.elapsedTime;
    }
    setPosition(group, posArr, lineArr);
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
