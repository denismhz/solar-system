import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PositionPoint } from "@react-three/drei";
import React, {
  Suspense,
  useRef,
  createContext,
  memo,
  useState,
  useContext,
} from "react";
import * as THREE from "three";

import { ScreenOverlay } from "./omnioverlay.jsx";
import { SharedPlanetState } from "./SharedPlanetState.jsx";
import { Skybox } from "./skybox.jsx";
import { MyContext } from "./Scene3.jsx";

export const CameraController = () => {
  const { customData } = useContext(MyContext);
  const [distance, setDistance] = useState(5);
  const [lookAt, setLookAt] = useState(new THREE.Vector3(0, 0, 0));
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 200));
  const [animate, setAnimate] = useState(true);
  const { camera } = useThree();
  const state = useThree();

  const relativePosition = new THREE.Vector3(0, 0, distance);

  const handleLookAt = (pos) => {
    setLookAt(pos);
  };
  customData.current["handleLookAt"] = handleLookAt;

  const handlePosition = (pos) => {
    const newPosition = pos.clone().add(relativePosition);
    setPosition(newPosition);
    setAnimate(true);
    //console.log(newPosition);
  };
  customData.current["handlePosition"] = handlePosition;

  useFrame(() => {
    //console.log(state);
    if (animate) {
      camera.position.lerp(position, 0.1);
      camera.lookAt(lookAt);
      if (camera.position.distanceTo(position) < 0.1) {
        setAnimate(false);
      }
    }

    //cameraRef.current.position.addScalar(2);
    //camera.position.addScalar(1);
    //console.log(camera);
  });
  return <></>;
};
