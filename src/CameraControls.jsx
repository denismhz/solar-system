import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PositionPoint } from "@react-three/drei";
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

export const CameraController = () => {
  const { customData } = useContext(MyContext);
  const [distance, setDistance] = useState(5);
  const [lookAt, setLookAt] = useState(new THREE.Vector3(0, 0, 0));
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 200));
  const [animate, setAnimate] = useState(false);
  const { camera } = useThree();
  const [currObj, setCurrObj] = useState(undefined);
  const mycam = useRef();
  const cameraGroupRef = useRef();
  const set = useThree(({ set }) => set);
  const size = useThree(({ size }) => size);

  useLayoutEffect(() => {
    if (mycam.current) {
      mycam.current.aspect = size.width / size.height;
      mycam.current.updateProjectionMatrix();
    }
  }, [size]);

  const handleLookAt = (pos) => {
    setLookAt(pos);
  };
  customData.current["handleLookAt"] = handleLookAt;

  const handleDistance = (obj) => {
    setDistance(obj.children[1].geometry.boundingSphere.radius * 1.5);
  };

  const handlePosition = (pos, obj) => {
    mycam.current.updateMatrixWorld();
    const newPosition = pos
      .clone()
      .add(
        new THREE.Vector3(
          0,
          0,
          obj.children[1].geometry.boundingSphere.radius * 2.5
        )
      );

    setCurrObj(obj);
    setPosition(newPosition);
    setAnimate(true);
    //console.log(newPosition);
  };
  customData.current["handlePosition"] = handlePosition;

  useFrame(() => {
    console.log(mycam);
    let rp = undefined;
    cameraGroupRef.current.position.set(new THREE.Vector3(0, 0, 200));
    //camera.updateProjectionMatrix();
    if (currObj) {
      rp = currObj.position
        .clone()
        .add(
          new THREE.Vector3(
            0,
            0,
            currObj.children[1].geometry.boundingSphere.radius * 2.5
          )
        );
    }
    //console.log(state);

    if (animate && currObj) {
      //update relative position

      setPosition();
      camera.position.lerp(rp, 0.02);
      camera.lookAt(lookAt);

      //console.log(currObj);
      if (camera.position.distanceTo(rp) < 0.1) {
        //camera.quaternion.slerp(currObj.quaternion, 0.2);
        setAnimate(false);
      }
    }
    //cameraRef.current.position.addScalar(2);
    //camera.position.addScalar(1);
    //console.log(camera);
  });
  return (
    <group ref={cameraGroupRef}>
      <perspectiveCamera
        ref={mycam}
        position={[0, 0, 100]}
        fov={75}
        aspect={window.innerWidth / window.innerHeight}
        near={0.1}
        far={1000}
      />
    </group>
  );
};
