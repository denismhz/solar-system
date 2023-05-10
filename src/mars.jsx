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

export const Mars = ({ positions }) => {
  const mars = useRef("mars");
  const group = useRef("group");
  const [poss, setPos] = useState([]);
  const [getAgain, setGetAgain] = useState(false);
  const [speed, setSpeed] = useState(60);
  const firstRef = useRef(true);
  const col = useLoader(TextureLoader, "../img/mars/mars_1k_color.jpg");
  const bump = useLoader(TextureLoader, "../img/mars/mars_1k_topo.jpg");
  const norm = useLoader(TextureLoader, "../img/mars/mars_1k_normal.jpg");
  let distanceScaleFactor = 1000000;
  const { customData } = useContext(MyContext);

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Mars";
    group.current.userData.nearOvOp = 40;
    group.current.userData.scolor = "orange";
  }, []);

  useFrame(() => {
    if (poss.length % 1000 == 0) {
      setPos(poss.slice(0, 500));
    }
    let date;
    if (firstRef.current) {
      date = new Date(Date.now());
      date.setMilliseconds(0);
      date.setSeconds(0);
    }
    //console.log(poss.length);
    //console.log(group.current.userData.counter);
    if (group.current.userData.counter % 250 == 0 || getAgain) {
      if (!firstRef.current)
        date = new Date(poss[poss.length - 1].date).toUTCString();
      const fetchData = async () => {
        let res = await fetch(
          `http://127.0.0.1:8000/duration/mars?date=${date}&speed=${speed}` //example and simple data
        );
        let response = await res.json();

        setPos(poss.concat(response)); // parse json
        firstRef.current = false;
        setGetAgain(false);
        //console.log(`psss : ${poss.length}`);
      };
      fetchData();
    }
    if (true && group.current.userData.counter < poss.length) {
      group.current.position.set(
        Number(
          poss[group.current.userData.counter].position.x / distanceScaleFactor
        ),
        Number(
          poss[group.current.userData.counter].position.y / distanceScaleFactor
        ),
        Number(
          poss[group.current.userData.counter].position.z / distanceScaleFactor
        )
      );
      //console.log(group.current.userData.counter);
      group.current.userData.counter++;
    }
  }, []);

  const changeSpeed = (newSpeed) => {
    setPos(poss.slice(0, group.current.userData.counter + 10));
    setGetAgain(true);
    console.log(poss);
    setSpeed(newSpeed);
  };

  customData.current["changeMarsSpeed"] = changeSpeed;
  return (
    <>
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
