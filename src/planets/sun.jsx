import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { shaderMaterial, OrbitControls, Line } from "@react-three/drei";
import React, { useRef, Suspense, useLayoutEffect } from "react";
import * as THREE from "three";
import glsl from "glslify";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { PlanetOverlay } from "../planetOverlay";

export const Sun = ({ positions }) => {
  const mars = useRef("mars");
  const group = useRef("group");
  const col = useLoader(TextureLoader, "../img/sun/sun_uv.jpg");
  let distanceScaleFactor = 1000000;

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Sun";
    group.current.userData.nearOvOp = 800;
    group.current.userData.scolor = "white";
  }, []);

  useFrame(() => {
    if (false) {
      group.current.position.set(
        Number(
          positions[group.current.userData.counter].x / distanceScaleFactor
        ),
        Number(
          positions[group.current.userData.counter].y / distanceScaleFactor
        ),
        Number(
          positions[group.current.userData.counter].z / distanceScaleFactor
        )
      );
      group.current.userData.counter++;
    }
  });
  return (
    <group ref={group}>
      <PlanetOverlay planet={group} />
      <mesh ref={mars}>
        <sphereGeometry args={[100000 / 6000, 50, 50]} />
        <meshPhongMaterial emissiveMap={col} emmisiveIntensite={1} />
      </mesh>
    </group>
  );
};
