import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { shaderMaterial, OrbitControls, Line } from "@react-three/drei";
import React, {
  useRef,
  Suspense,
  useLayoutEffect,
  useEffect,
  useState,
} from "react";
import { useControls } from "leva";
import * as THREE from "three";
import glsl from "glslify";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { PlanetOverlay } from "./planetOverlay";

export const PlanetPath = ({
  positions,
  linePos,
  color,
  datas,
  lineLength,
  lineAt,
  planet,
}) => {
  let distanceScaleFactor = 1000000;
  const otherPoints = useRef([]);
  const counter = useRef(0);
  const shiftCounter = useRef(0);
  const [points, setPoints] = useState([]);

  /*const points = positions.map(
    (pos) =>
      new THREE.Vector3(
        pos.x / distanceScaleFactor,
        pos.y / distanceScaleFactor,
        pos.z / distanceScaleFactor
      )
  );*/
  const lineref = useRef();
  //if (lineref) lineref.current.userData.counter = 0;

  useLayoutEffect(() => {
    if (linePos) {
      for (var i = linePos.length - 1; i >= 0; i--) {
        otherPoints.current[i] = new THREE.Vector3(
          linePos[i].position.x / distanceScaleFactor,
          linePos[i].position.y / distanceScaleFactor,
          linePos[i].position.z / distanceScaleFactor
        );
      }
    }
    //console.log(otherPoints);
  });

  useEffect(() => {}, []);

  function getLength(arrV3) {
    let sum = 0;
    for (var i = 0; i < arrV3.length - 1; i += 2) {
      sum += arrV3[i].distanceTo(arrV3[i + 1]);
    }
    return sum;
  }
  useFrame(() => {
    //console.log(planet);
    /*    if (planet) {
      otherPoints.current.push(planet.current.position);
      //console.log(planet.current.position);
    }
    if (otherPoints.current.length > 0) {
      //console.log(otherPoints.current);
      //console.log(asd);
      lineref.current.geometry.setFromPoints(asd);
      lineref.current.geometry.setDrawRange(0, Infinity);

      //console.log(otherPoints);
    }*/
    //console.log(otherPoints);
    //var start = 0;
    //if (counter.current > lineLength) start = counter.current - lineLength;
    var realpoints = otherPoints.current.slice(
      shiftCounter.current,
      counter.current
    );
    //console.log(getLength(realpoints));
    if (realpoints.length > 0) {
      lineref.current.geometry.setFromPoints(realpoints);
      if (getLength(realpoints) > lineLength) {
        //console.log("cut");
        shiftCounter.current++;
        //realpoints.shift();
      }
    }

    lineref.current.geometry.setDrawRange(0, Infinity);
    counter.current++;
    //console.log(counter.current);
  });
  return (
    <>
      <line ref={lineref} frustumCulled={false}>
        <bufferGeometry />
        <lineBasicMaterial color={color} />
      </line>
    </>
  );
};
