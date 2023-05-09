import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import React, {
  Suspense,
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  forwardRef,
  memo,
  useMemo,
} from "react";
import { Earth } from "./earth.jsx";
import { Mars } from "./mars.jsx";
import { Jupiter } from "./jupiter.jsx";
import { Saturn } from "./saturn.jsx";
import { Mercury } from "./mercury.jsx";
import { Venus } from "./venus.jsx";
import { Neptune } from "./neptune.jsx";
import { Uranus } from "./uranus.jsx";
import { Sun } from "./sun.jsx";
import * as THREE from "three";
import { PlanetInfo } from "./planetInfo.jsx";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";

export const Skybox = () => {
  const { scene } = useThree();
  const loader = new THREE.CubeTextureLoader();
  const box = loader.load([
    "../img/front.png",
    "../img/back.png",
    "../img/top.png",
    "../img/bottom.png",
    "../img/left.png",
    "../img/right.png",
  ]);
  scene.background = box;

  return <></>;
};
