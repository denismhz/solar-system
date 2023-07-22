import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useRef, useLayoutEffect } from "react";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { PlanetOverlay } from "./planetOverlay";
import { PlanetPath } from "./path";
import PropTypes from "prop-types";

const Planet = ({ planetData, setPosition, positions, realPos, linePos }) => {
  const lineArr = useRef([]);

  const colorMap = useLoader(
    TextureLoader,
    `../img/${planetData.name.toLowerCase()}/color.jpg`
  );

  useFrame(() => {
    if (positions) setPosition(group, positions, lineArr, realPos);
  });

  useLayoutEffect(() => {
    group.current.userData.name = planetData.name;
    group.current.userData.nearOvOp = planetData.overlayVisibilityDistance;
    group.current.userData.scolor = planetData.color;
  });

  useThree(() => {});

  const group = useRef();

  return (
    <>
      <PlanetPath
        linePos={lineArr.current}
        linePoss={linePos}
        planet={{
          name: planetData.name,
          id: planetData._id,
          year: planetData.LOY,
        }}
        color={planetData.color}
        lineLength={200}
      />
      <group ref={group}>
        <PlanetOverlay planet={group} />
        <mesh>
          <sphereGeometry args={[planetData.Radius / 6000, 100, 100]} />
          <meshPhongMaterial map={colorMap} />
        </mesh>
      </group>
    </>
  );
};

Planet.propTypes = {
  planetData: PropTypes.object,
  setPosition: PropTypes.func,
  positions: PropTypes.array,
  realPos: PropTypes.object,
  linePos: PropTypes.array,
};

export default Planet;
