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

import { MyContext } from "./SolarSystemMain.jsx";

export function CustomCamera(props) {
  const { customData } = useContext(MyContext);
  const [animate, setAnimate] = useState(false);
  const [zoom, setZoom] = useState(true);
  const [pos, setPos] =useState();
  const mouseDown = useRef(false);
  const mouseUp = useRef(false);
  const dist = useRef(60);
  let _mouseStart = useRef(new THREE.Vector2(0, 0));
  let _mouseEnd = useRef(new THREE.Vector2(0, 0));
  let distance = useRef(200);
  const [globalQuaternion, setGlobalQuaternion] = useState(
    new THREE.Quaternion()
  );

  const [currObj, setCurrObj] = useState(undefined);
  let rotate = useRef(true);

  const handleMouseWheel = (event) => {
    const delta = Math.sign(event.deltaY);
    handleZoom(delta);
  };

  const handleMouseMove = (event) => {
    if (mouseDown.current && rotate.current) {
      _mouseEnd.current = new THREE.Vector2(event.clientX, event.clientY);
      const deltaX = -event.movementX;
      const deltaY = -event.movementY;

      const rotationSpeed = 0.005;

      // Create quaternions for rotation around X and Y axes
      const quaternionX = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        deltaY * 0.01
      );
      const quaternionY = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        deltaX * rotationSpeed
      );

      const quaternionZ = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 0, 1),
        0
      );

      // Combine the quaternions
      const deltaQuaternion = quaternionY
        .multiply(quaternionX)
        .multiply(quaternionZ);

      // Apply the rotation to the camera quaternion
      if (camGroup && camGroup.current.quaternion) {
        const finalQuaternion = camGroup.current.quaternion.clone();
        finalQuaternion.multiply(deltaQuaternion);

        const slerpSpeed = 0.3; // Adjust this value to control the smoothness

        camGroup.current.quaternion.slerp(finalQuaternion, slerpSpeed);
      }
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

  const handleZoom = (delta) => {
    let zoomSpeed = 0.03;
    if (camGroup && cameraRef) {
      zoomSpeed *= cameraRef.current.position.distanceTo(
        camGroup.current.position
      );
    }
    function newDistance(prevDistance) {
      const newDistance = prevDistance + delta * zoomSpeed;
      return Math.max(dist.current, newDistance); // Adjust the minimum distance as needed
    }
    distance.current = newDistance(distance.current);
  };
  customData.current["handleZoom"] = handleZoom;

  const handlePosition = (pos, obj) => {
    if (currObj) {
      currObj.remove(camGroup.current);
      setGlobalQuaternion(new THREE.Quaternion());
    }

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
      setPos(camGroup.current.position);
    }
    //cameraRef.current.position.copy(new THREE.Vector3(0, 0, 400));
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleMouseWheel);
  }, [size, props]);

  useLayoutEffect(() => {
    set({ camera: cameraRef.current });
  });

  let lerpedilerp = useRef(0.01);

  function easeIn(t){
    return t*t;
  }

  function myLerp(v3Start, v3End, t){
    return new THREE.Vector3(
      v3Start.x + (v3End.x - v3Start.x)*t,
      v3Start.y + (v3End.y - v3Start.y)*t,
      v3Start.z + (v3End.z - v3Start.z)*t
    )
  }

  useFrame(({ clock }) => {
    cameraRef.current.updateProjectionMatrix();

    if (animate && currObj) {
      setZoom(false);
      distance.current =
        currObj.children[1].geometry.boundingSphere.radius * 2.5;
      dist.current = currObj.children[1].geometry.boundingSphere.radius * 2.5;
      //camGroup.current.position.lerp(currObj.position,lerpedilerp.current);
      //camGroup.current.position.copy(myLerp(pos, currObj.position, 0.5));

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
      camGroup.current.quaternion.copy(globalQuaternion);

      rotate.current = false;
      lerpedilerp.current *= 1.08;
      //console.log(camGroup.current.position.distanceTo(currObj.position));

      if (camGroup.current.position.distanceTo(currObj.position) < 0.3) {
        currObj.add(camGroup.current);
        camGroup.current.position.copy(new THREE.Vector3(0, 0, 0), 0.2);

        rotate.current = true;
        lerpedilerp.current = 0.01;
        setZoom(true);
        setAnimate(false);
      }
    }
    if (rotate.current && currObj) {
      
    }
    if (zoom && cameraRef.current) {
      cameraRef.current.position.copy(
        new THREE.Vector3(0, 0, distance.current)
      );
    }
  });

  return (
    <group ref={camGroup} position={[0, 0, 0]}>
      <perspectiveCamera
        ref={cameraRef}
        position={[0, 0, 0]}
        fov={75}
        near={0.1}
        far={1000000}
      />
    </group>
  );
}
