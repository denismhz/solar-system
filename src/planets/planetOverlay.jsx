import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import React, { useState, useEffect, useContext } from "react";
import * as THREE from "three";
import { MyContext } from "../SolarSystemMain";
import PropTypes from "prop-types";
import { PlanetOverlayContext } from "../SharedPlanetState";

export const PlanetOverlay = ({ planet }) => {
  let [opacity, setOpacity] = useState(0);
  let [minDistance, setMinDistance] = useState(0);
  const { nameVis, iconVis } = useContext(PlanetOverlayContext);

  let [scolor, setSColor] = useState("white");
  const { camera } = useThree();
  const [name, setName] = useState("Undefined");
  const svgStyle = { height: "20px", width: "20px", stroke: scolor };
  const { customData } = useContext(MyContext);

  const handleClick = React.useCallback(
    (event) => {
      // prevent context menu from opening on right-click
      event.preventDefault();
      // native event
      switch (event.nativeEvent.button) {
        case 0:
          customData.current.showInfo(planet.current.userData);
          customData.current.handlePosition(
            planet.current.position,
            planet.current
          );
          break;
        case 2:
          break;
      }
    },
    [planet, customData]
  );

  useEffect(() => {
    setName(planet.current.userData.name);
    setMinDistance(planet.current.userData.nearOvOp);
    setSColor(planet.current.userData.scolor);
  }, [planet, name, minDistance, customData, iconVis, nameVis]);

  useFrame(() => {
    let worldpos = new THREE.Vector3();
    camera.getWorldPosition(worldpos);
    var distance = worldpos.distanceTo(planet.current.position);
    if (distance < minDistance) {
      setOpacity(0);
    } else {
      setOpacity(1);
    }
  });

  return (
    <>
      <Html
        zIndexRange={[11, 0]}
        className="overlay"
        style={{ opacity: opacity }}
      >
        <div className="wrapper">
          <span
            className="icon"
            onClick={handleClick}
            onContextMenu={handleClick}
            style={{ visibility: iconVis }}
          >
            <svg
              onMouseEnter={() => setSColor("lightgrey")}
              onMouseLeave={() => setSColor(planet.current.userData.scolor)}
              style={svgStyle}
            >
              <circle cx="10" cy="10" r="9" strokeWidth="1" fill="none" />
            </svg>
          </span>
          <span className="content" style={{ visibility: nameVis }}>
            {name}
          </span>
        </div>
      </Html>
    </>
  );
};

PlanetOverlay.propTypes = {
  planet: PropTypes.object,
};
