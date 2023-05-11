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
import { useControls } from "leva";
import * as THREE from "three";
import glsl from "glslify";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { PlanetOverlay } from "./planetOverlay";
import { PlanetOverlayContext } from "./SharedPlanetState";

export const PlanetPath = ({
  positions,
  linePos,
  color,
  datas,
  lineLength,
  lineAt,
  planet,
}) => {
  const lineref = useRef();
  const { speed } = useContext(PlanetOverlayContext);

  useLayoutEffect(() => {});

  useEffect(() => {});

  /* const cutPath = (path, maxLength) => {
    if (getLength(path) > maxLength) {
      path.shift();
    }
  };*/

  //from chatgpt very nice :D
  const cutPath = (path, maxLength) => {
    let length = getLength(path);
    while (length > maxLength && path.length >= 2) {
      const firstPoint = path[0];
      const secondPoint = path[1];
      const segmentLength = firstPoint.distanceTo(secondPoint);
      if (segmentLength > maxLength) {
        // If the first segment is longer than the maximum length,
        // split it into multiple segments of the maximum length.
        const numSegments = Math.ceil(segmentLength / maxLength);
        const segmentDirection = secondPoint
          .clone()
          .sub(firstPoint)
          .normalize();
        const segmentLength = segmentLength / numSegments;
        const newPoints = [firstPoint];
        for (let i = 1; i < numSegments; i++) {
          const newPoint = firstPoint
            .clone()
            .add(segmentDirection.clone().multiplyScalar(segmentLength * i));
          newPoints.push(newPoint);
        }
        newPoints.push(secondPoint);
        path.splice(0, 2, ...newPoints);
        length = getLength(path);
      } else {
        path.shift();
        length -= segmentLength;
      }
    }
  };

  function getLength(arrV3) {
    let sum = 0;
    for (var i = 0; i < arrV3.length - 1; i += 2) {
      sum += arrV3[i].distanceTo(arrV3[i + 1]);
    }
    return sum;
  }

  const lineGeometry = new THREE.BufferGeometry();
  useFrame(() => {
    if (speed === 0) {
      linePos.length = 0;
      return;
    }
    lineref.current.geometry.setFromPoints(linePos);
    lineref.current.geometry.setDrawRange(0, Infinity);
    cutPath(linePos, lineLength);
    //console.log(getLength(linePos));
  });
  return (
    <>
      <line ref={lineref} geometry={lineGeometry} frustumCulled={false}>
        <lineBasicMaterial color={color} />
      </line>
    </>
  );
};
