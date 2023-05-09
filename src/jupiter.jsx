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

export const Jupiter = ({ positions }) => {
  const [poss, setPos] = useState([]);
  const [lineposs, setLinePos] = useState([]);
  const [getAgain, setGetAgain] = useState(false);
  const [speed, setSpeed] = useState(60);
  const jupiter = useRef("jupiter");
  const group = useRef();
  const col = useLoader(TextureLoader, "../img/jupiter/jupiter2_4k.jpg");

  let distanceScaleFactor = 1000000;

  const firstRef = useRef(true);
  let linePoss = [];
  const { customData } = useContext(MyContext);

  useEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Jupiter";
    group.current.userData.nearOvOp = 800;
    group.current.userData.scolor = "yellow";
  });

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
          `http://127.0.0.1:8000/duration/jupiter?date=${date}&speed=${speed}` //example and simple data
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

  customData.current["changeJupiterSpeed"] = changeSpeed;
  return (
    <>
      <PlanetPath
        linePos={poss}
        planet={group}
        color={"yellow"}
        lineLength={20}
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
