import { useFrame } from "@react-three/fiber";
import React, { useRef, useContext, useLayoutEffect, useState } from "react";
import * as THREE from "three";
import { PlanetOverlayContext } from "../SharedPlanetState";

export const PlanetPath = ({
  linePos,
  color,
  lineLength,
  planet,
}) => {
  const lineref = useRef();
  const lineArr = useRef([]);
  const first = useRef(true);
  const [loading, setLoading] = useState();
  const { speed } = useContext(PlanetOverlayContext);
  const [linePoss, setLinePoss] = useState(null);
  const [second, setSecond] = useState(false);
  const asd = useContext(PlanetOverlayContext);

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

  const distanceScaleFactor = 1000000;

  useLayoutEffect(() => {
    if (second && linePoss) {
      linePoss.forEach((element) => {
        element.position.x = element.position.x / distanceScaleFactor;
        element.position.y = element.position.y / distanceScaleFactor;
        element.position.z = element.position.z / distanceScaleFactor;
        lineArr.current.push(
          new THREE.Vector3(
            element.position.x,
            element.position.y,
            element.position.z
          )
        );
      });
      

      setSecond(false);
    }
    if(first.current){
      const fetchLinePos = async () => {
        fetch(
          `http://127.0.0.1:8000/duration/line?name=${planet.name}&id=${planet.id}&LOY=${planet.year}`
        ).then((response) => {
          if (!response.ok) {
            throw new Error(
              `This is an HTTP error: The status is ${response.status}`
            );
          }
          setLoading(true);
          response
            .json()
            .then((data) => {
              setLinePoss(data)
              setSecond(true);

            })
            .catch(() => {})
            .finally(() => {
              setLoading(false);
            });
        });
      };
      fetchLinePos();
      first.current = false;
    }
    //console.log(lineArr.current);
  },[linePoss, planet, second]);

  const lineGeometry = new THREE.BufferGeometry();
  useFrame(() => {
    let vis = Infinity;
    if(asd.pathVis == "hidden") vis = 0;
    else vis = Infinity;
    lineref.current.geometry.setFromPoints(lineArr.current);
    lineref.current.geometry.setDrawRange(0, vis);
    //cutPath(linePos, lineLength);
  });
  return (
    <>
      <line ref={lineref} geometry={lineGeometry} frustumCulled={false}>
        <lineBasicMaterial color={color} />
      </line>
    </>
  );
};
