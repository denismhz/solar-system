import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PositionPoint,
  TrackballControls,
  ArcballControls,
} from "@react-three/drei";
import React, {
  Suspense,
  useRef,
  createContext,
  memo,
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
} from "react";
import * as THREE from "three";

import { ScreenOverlay } from "./omnioverlay.jsx";
import { SharedPlanetState } from "./SharedPlanetState.jsx";
import { Skybox } from "./skybox.jsx";
import { MyContext } from "./Scene3.jsx";

export function CustomCamera(props) {
  const { customData } = useContext(MyContext);
  const [lookAt, setLookAt] = useState(new THREE.Vector3(0, 0, 0));
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 200));
  const [animate, setAnimate] = useState(false);
  const mouseDown = useRef(false);
  const mouseUp = useRef(false);
  let _mouseStart = useRef(new THREE.Vector2(0, 0));
  let _mouseEnd = useRef(new THREE.Vector2(0, 0));
  let distance = useRef(200);

  const [currObj, setCurrObj] = useState(undefined);
  let rotate = useRef(true);

  const handleMouseWheel = (event) => {
    const delta = Math.sign(event.deltaY);
    handleZoom(delta);
  };

  const handleMouseMove = (event) => {
    if (mouseDown.current && rotate.current) {
      _mouseEnd.current = new THREE.Vector2(event.clientX, event.clientY);
      const deltaX = event.movementX;
      const deltaY = event.movementY;

      const rotationSpeed = 0.005;

      // Create quaternions for rotation around X and Y axes
      const quaternionX = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        deltaY * rotationSpeed
      );
      const quaternionY = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        deltaX * rotationSpeed
      );

      // Combine the quaternions
      const deltaQuaternion = quaternionY.multiply(quaternionX);

      // Apply the rotation to the camera quaternion
      if (camGroup.current.quaternion)
        camGroup.current.quaternion.multiply(deltaQuaternion);
    }
  };

  const handleMouseDown = (event) => {
    _mouseStart.current = new THREE.Vector2(event.clientX, event.clientY);
    mouseDown.current = true;
    mouseUp.current = false;
  };

  const handleMouseUp = (event) => {
    mouseDown.current = false;
    mouseUp.current = true;
  };

  const handleLookAt = (pos) => {
    setLookAt(pos);
  };
  customData.current["handleLookAt"] = handleLookAt;

  const handleZoom = (delta) => {
    let zoomSpeed = 0.01;
    if (camGroup && cameraRef) {
      zoomSpeed *= cameraRef.current.position.distanceTo(
        camGroup.current.position
      );
      //console.log("asdasd");
    }

    function newDistance(prevDistance) {
      const newDistance = prevDistance + delta * zoomSpeed;
      return Math.max(0, newDistance); // Adjust the minimum distance as needed
    }
    distance.current = newDistance(distance.current);
    //console.log(distance);
  };
  customData.current["handleZoom"] = handleZoom;

  const handlePosition = (pos, obj) => {
    if (currObj) currObj.remove(camGroup.current);

    setCurrObj(obj);

    setAnimate(true);
  };
  customData.current["handlePosition"] = handlePosition;

  const cameraRef = useRef();
  const set = useThree(({ set }) => set);
  const size = useThree(({ size }) => size);
  const camGroup = useRef();

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.aspect = size.width / size.height;
      cameraRef.current.updateProjectionMatrix();
    }
    cameraRef.current.position.copy(new THREE.Vector3(0, 0, 400));
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleMouseWheel);
  }, [size, props]);

  useLayoutEffect(() => {
    set({ camera: cameraRef.current });
  });

  let lerpedilerp = useRef(0.01);

  useFrame(({ clock }) => {
    cameraRef.current.updateProjectionMatrix();

    if (animate && currObj) {
      distance.current =
        currObj.children[1].geometry.boundingSphere.radius * 2.5;
      camGroup.current.position.lerp(currObj.position, lerpedilerp.current);
      cameraRef.current.position.lerp(
        new THREE.Vector3(
          0,
          0,
          currObj.children[1].geometry.boundingSphere.radius * 2.5
        ),
        lerpedilerp.current
      );

      cameraRef.current.lookAt(currObj.position);

      rotate.current = false;
      lerpedilerp.current *= 1.1;
      //console.log(camGroup.current.position.distanceTo(currObj.position));

      if (camGroup.current.position.distanceTo(currObj.position) < 0.1) {
        currObj.add(camGroup.current);
        camGroup.current.position.copy(new THREE.Vector3(0, 0, 0), 0.2);
        rotate.current = true;
        setAnimate(false);
      }
    }
    if (rotate.current && currObj) {
      /*       cameraRef.current.quaternion.multiply(lastQ.current); */
      //camGroup.current.rotation.x += 0.005;
      lerpedilerp.current = 0.01;
      if (
        distance.current >
        currObj.children[1].geometry.boundingSphere.radius * 2.5
      ) {
        cameraRef.current.position.copy(
          new THREE.Vector3(0, 0, distance.current)
        );
      }
    }
  });

  return (
    <group ref={camGroup} position={[0, 0, 0]}>
      <perspectiveCamera
        ref={cameraRef}
        position={[0, 0, 0]}
        fov={75}
        near={0.1}
        far={10000}
      />
    </group>
  );
}
