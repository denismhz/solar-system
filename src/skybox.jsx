import { useThree } from "@react-three/fiber";

import * as THREE from "three";
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
