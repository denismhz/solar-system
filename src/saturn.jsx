import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { shaderMaterial, OrbitControls, Line } from "@react-three/drei";
import React, {
  useRef,
  Suspense,
  useLayoutEffect,
  useState,
  useContext,
} from "react";
import * as THREE from "three";
import glsl from "glslify";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { PlanetOverlay } from "./planetOverlay";
import { PlanetPath } from "./path";
import { MyContext } from "./Scene3";

const SaturnRingMaterial = shaderMaterial(
  {
    ringCol: 0,
    ringAlpha: 0,
    innerRadius: 58232 / 6000 + 0,
    outerRadius: 58232 / 6000 + 0,
  },
  glsl`
varying vec3 vPos;

void main() {
  vPos = position;
  vec3 viewPosition = (modelViewMatrix * vec4(position, 1.)).xyz;
  gl_Position = projectionMatrix * vec4(viewPosition, 1.);
}
`,
  glsl`
uniform sampler2D ringCol;
uniform sampler2D ringAlpha;
uniform float innerRadius;
uniform float outerRadius;

varying vec3 vPos;

vec4 color() {
  vec2 uv = vec2(0);
  uv.x = (length(vPos) - innerRadius) / (innerRadius + outerRadius);  
  
  vec4 pixel = texture2D(ringCol, uv);
  vec4 pixel2 = texture2D(ringAlpha, uv);
  pixel[3] = pixel2[0];
  if (pixel[3] <= 0.01) {
    discard;
  }
  return pixel;
}

void main() {
  gl_FragColor = color();
}
`
);

extend({ SaturnRingMaterial });

export const Saturn = ({ positions }) => {
  const [poss, setPos] = useState([]);
  const [lineposs, setLinePos] = useState([]);
  const [getAgain, setGetAgain] = useState(false);
  const [speed, setSpeed] = useState(60);
  const saturn = useRef("saturn");
  const group = useRef("group");
  const col = useLoader(TextureLoader, "../img/saturn/saturnmap.jpg");
  const ringCol = useLoader(TextureLoader, "../img/saturn/saturnringcolor.jpg");
  const ringAlpha = useLoader(
    TextureLoader,
    "../img/saturn/saturnringpattern.gif"
  );
  let distanceScaleFactor = 1000000;

  const firstRef = useRef(true);
  let linePoss = [];
  const { customData } = useContext(MyContext);

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Saturn";
    group.current.userData.nearOvOp = 800;
    group.current.userData.scolor = "red";
  }, []);

  useFrame(() => {
    if (true && group.current.userData.counter < poss.length) {
      group.current.position.set(
        Number(
          poss[group.current.userData.counter].position.x / distanceScaleFactor
        ),
        Number(
          poss[group.current.userData.counter].position.y / distanceScaleFactor
        ),
        Number(
          poss[group.current.userData.counter].position.z / distanceScaleFactor
        )
      );
      //console.log(group.current.userData.counter);
      group.current.userData.counter++;
    }
  }, []);

  const changeSpeed = (newSpeed) => {
    setPos(poss.slice(0, group.current.userData.counter + 10));
    setGetAgain(true);
    console.log(poss);
    setSpeed(newSpeed);
  };

  customData.current["changeSaturnSpeed"] = changeSpeed;
  return (
    <>
      <group ref={group}>
        <PlanetOverlay planet={group} />
        <mesh ref={saturn}>
          <sphereGeometry args={[58232 / 6000, 50, 50]} />
          <meshPhongMaterial map={col} />
        </mesh>
        <mesh>
          <ringGeometry args={[58232 / 6000 + 1, 58232 / 6000 + 5, 100, 100]} />
          <saturnRingMaterial
            ringCol={ringCol}
            ringAlpha={ringAlpha}
            transparent={true}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </>
  );
};
