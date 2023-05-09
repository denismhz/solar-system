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
import { PlanetInfo } from "./planetInfo";
import { PlanetPath } from "./path";
import { MyContext } from "./Scene3";

export const Earth = ({ positions }) => {
  let distanceScaleFactor = 1000000;
  const [poss, setPos] = useState([]);
  const [lineposs, setLinePos] = useState([]);
  const [getAgain, setGetAgain] = useState(false);
  const [speed, setSpeed] = useState(60);
  const line = useRef();
  const clouds = useRef("clouds");
  const earth = useRef();
  const group = useRef();
  const firstRef = useRef(true);
  let linePoss = [];
  const { customData } = useContext(MyContext);

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Earth";
    group.current.userData.nearOvOp = 60;
    group.current.userData.scolor = "lightgreen";
  }, []);

  function datas() {
    return group;
  }

  let currLinePoss = [];

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
          `http://127.0.0.1:8000/duration/earth?date=${date}&speed=${speed}` //example and simple data
        );
        let response = await res.json();

        setPos(poss.concat(response)); // parse json
        firstRef.current = false;
        setGetAgain(false);
        //console.log(`psss : ${poss.length}`);
      };
      fetchData();
    }
    clouds.current.rotation.y += 0.00025;
    earth.current.rotation.y += 0.00015;
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

  customData.current["changeEarthSpeed"] = changeSpeed;

  const col = useLoader(TextureLoader, "../img/earth/6k_earth_daymap.jpg");
  const bump = useLoader(TextureLoader, "../img/earth/earth_bump_1k.jpg");
  const spec = useLoader(
    TextureLoader,
    "../img/earth/6k_earth_specular_map.jpg"
  );
  const norm = useLoader(TextureLoader, "../img/earth/6k_earth_normal_map.jpg");
  const cloudMap = useLoader(TextureLoader, "../img/earth/6k_earth_clouds.jpg");
  const axisPoints = [
    new THREE.Vector3(0, 6371.0 / 6000 + 0.5, 0),
    new THREE.Vector3(0, -(6371.0 / 6000 + 0.5), 0),
  ];
  useLayoutEffect(() => {
    line.current.geometry.setFromPoints(axisPoints);
  });
  return (
    <>
      <PlanetPath
        positions={poss.slice(0, 1000)}
        linePos={poss}
        planet={group}
        lineAt={group.current ? group.current.userData.counter : 0}
        color={"lightgreen"}
        datas={datas}
        lineLength={20}
      />
      <group ref={group}>
        <PlanetOverlay planet={group} />
        <mesh ref={earth}>
          <sphereGeometry args={[6371.0 / 6000, 50, 50]} />
          <meshPhongMaterial
            map={col}
            bumpMap={bump}
            specularMap={spec}
            normalMap={norm}
            bumpScale={0.2}
            shininess={0.5}
          />
        </mesh>
        <mesh ref={clouds}>
          <sphereGeometry args={[6371.0 / 6000 + 0.01, 50, 50]} />
          <meshPhongMaterial map={cloudMap} transparent={true} opacity={0.5} />
        </mesh>
        <line ref={line}>
          <bufferGeometry />
          <lineBasicMaterial
            color={"hotpink"}
            transparent={true}
            opacity={0.5}
            linewidth={2}
          />
        </line>
      </group>
    </>
  );
};
