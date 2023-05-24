import { extend, useFrame, useLoader } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import React, { useRef, useLayoutEffect, useState } from "react";
import * as THREE from "three";
import glsl from "glslify";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { PlanetOverlay } from "../planetOverlay";
import { PlanetPath } from "../path";

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

export const Saturn = ({
  speed,
  speedChanged,
  getPosition,
  setPosition,
  data,
}) => {
  const [posArr, setPosArr] = useState(data);
  const lineArr = useRef([]);
  const lastPositionUpdate = useRef(0);

  let planetPositionIndex = useRef(0);
  const saturn = useRef("saturn");
  const group = useRef("group");
  const col = useLoader(TextureLoader, "../img/saturn/saturnmap.jpg");
  const ringCol = useLoader(TextureLoader, "../img/saturn/saturnringcolor.jpg");
  const ringAlpha = useLoader(
    TextureLoader,
    "../img/saturn/saturnringpattern.gif"
  );
  let distanceScaleFactor = 1000000;

  useLayoutEffect(() => {
    group.current.userData.counter = 0;
    group.current.userData.name = "Saturn";
    group.current.userData.nearOvOp = 800;
    group.current.userData.scolor = "red";
  }, []);

  useFrame(({ clock }) => {
    const timeSinceLastUpdate = clock.elapsedTime - lastPositionUpdate.current;
    if (timeSinceLastUpdate >= 2) {
      //console.log("gethis");
      getPosition("saturn", setPosArr, posArr, planetPositionIndex.current);
      lastPositionUpdate.current = clock.elapsedTime;
    }
    //console.log("arrlength" + posArr.length);

    //if speed is 0 set the date to current date get from posArr
    //search for current date in posArr an set planetPositionIndex
    setPosition(group, posArr, lineArr);
  }, []);

  return (
    <>
      <PlanetPath
        linePos={lineArr.current}
        planet={group}
        color={"red"}
        lineLength={300}
      />
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
