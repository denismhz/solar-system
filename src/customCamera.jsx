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

export function CustomCamera(props) {
  const { customData } = useContext(MyContext);
  const [distance, setDistance] = useState(5);
  const [lookAt, setLookAt] = useState(new THREE.Vector3(0, 0, 0));
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 200));
  const [animate, setAnimate] = useState(false);

  const [currObj, setCurrObj] = useState(undefined);

  const handleLookAt = (pos) => {
    setLookAt(pos);
  };
  customData.current["handleLookAt"] = handleLookAt;

  const handlePosition = (pos, obj) => {
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

  const cameraRef = useRef();
  const set = useThree(({ set }) => set);
  const size = useThree(({ size }) => size);
  const camGroup = useRef();

  useLayoutEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.aspect = size.width / size.height;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [size, props]);

  useLayoutEffect(() => {
    set({ camera: cameraRef.current });
  }, []);

  let i = 0;

  useFrame(({ clock }) => {
    cameraRef.current.updateProjectionMatrix();
    //console.log(cameraRef.current.position);
    //console.log(camGroup.current.position);
    //cameraRef.current.position.add(new THREE.Vector3(1, 0, 0));
    //camGroup.current.position.add(new THREE.Vector3(0, 0, 1));
    //let rp = undefined;
    //camGroup.current.position.copy(new THREE.Vector3(0, 0, 600));
    //camera.updateProjectionMatrix();
    let rp = undefined;
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
      camGroup.current.position.lerp(currObj.position, 0.02);
      //set Camera position
      /*cameraRef.current.position.lerp(
        new THREE.Vector3(
          0,
          0,
          currObj.children[1].geometry.boundingSphere.radius * 2.5
        ),
        0.01
      );*/
      cameraRef.current.lookAt(lookAt);
      cameraRef.current.position.x = Math.cos(i) * 3;
      cameraRef.current.position.y = Math.sin(2) * 3;

      i += 0.1;

      //console.log(currObj);
      if (camGroup.current.position.distanceTo(currObj.position) < 0.1) {
        //camera.quaternion.slerp(currObj.quaternion, 0.2);
        //setAnimate(false);
      }
    }
    //cameraRef.current.position.addScalar(2);
    //camera.position.addScalar(1);
    //console.log(camera);*/
  });

  return (
    <group ref={camGroup} position={[0, 0, 200]}>
      <perspectiveCamera
        ref={cameraRef}
        position={[0, 0, 0]}
        fov={75}
        near={0.1}
        far={1000}
      />
    </group>
  );
}
