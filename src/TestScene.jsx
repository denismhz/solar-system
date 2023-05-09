import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Earth } from "./earth.jsx";
import { Mars } from "./mars.jsx";
import { Jupiter } from "./jupiter.jsx";
import { Saturn } from "./saturn.jsx";
import * as THREE from "three";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";

const TestScene = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    console.log("useeffect called");
    const fetchData = async () => {
      let res = await fetch(
        "http://127.0.0.1:8000/duration" //example and simple data
      );
      let response = await res.json();
      setData(response); // parse json
      console.log(response);
    };
    fetchData();
  }, []);

  const Skybox = () => {
    const { scene } = useThree();
    const loader = new THREE.CubeTextureLoader();
    const box = loader.load([
      "../img/skybox/front.png",
      "../img/skybox/back.png",
      "../img/skybox/top.png",
      "../img/skybox/bottom.png",
      "../img/skybox/left.png",
      "../img/skybox/right.png",
    ]);
    scene.background = box;
    return null;
  };

  if (data)
    return (
      <>
        <Canvas camera={{ position: [0, 0, 15] }}>
          <ambientLight intensity={0.1} />
          <pointLight position={[15, 15, 15]} intensity={0.5} />
          <Suspense fallback={null}>
            <Earth parentToChild={data["399"]} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </>
    );
};

export default TestScene;
