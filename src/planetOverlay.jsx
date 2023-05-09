import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import {
  shaderMaterial,
  OrbitControls,
  Line,
  Html,
  Text,
} from "@react-three/drei";
import React, {
  useRef,
  Suspense,
  useLayoutEffect,
  useState,
  useEffect,
  useContext,
} from "react";
import * as THREE from "three";
import { MyContext } from "./Scene3";

import "./styles.css";

import PropTypes from "prop-types";

export const PlanetOverlay = ({ planet }) => {
  const ref = useRef();
  let [opacity, setOpacity] = useState(0);
  let [minDistance, setMinDistance] = useState(0);
  let [scolor, setSColor] = useState("white");
  let [follow, setFollow] = useState(false);
  const { camera } = useThree();
  const [name, setName] = useState("Undefined");
  const svgStyle = { height: "20px", width: "20px", stroke: scolor };
  var { controls } = useContext(MyContext);
  const { customData } = useContext(MyContext);

  const handleClick = React.useCallback(
    (event) => {
      // prevent context menu from opening on right-click
      event.preventDefault();

      // synthetic event
      /*switch (event.type) {
      case "click":
        message = `Left click (synthetic event)`;
        break;
      case "contextmenu":
        message = `Right click (synthetic event)`;
        break;
    }*/

      // native event
      switch (event.nativeEvent.button) {
        case 0:
          controls.current.target.copy(planet.current.position.clone());
          customData.current.showInfo(planet.current.userData);
          console.log(customData);
          //startFollow();
          break;
        case 2:
          //endFollow();
          break;
      }
    },
    [controls, planet, customData]
  );

  useEffect(() => {
    setName(planet.current.userData.name);
    setMinDistance(planet.current.userData.nearOvOp);
    setSColor(planet.current.userData.scolor);
  }, [planet, name, minDistance, customData]);

  useFrame(() => {
    var distance = camera.position.distanceTo(planet.current.position);
    if (distance < minDistance) {
      setOpacity(0);
    } else {
      setOpacity(1);
    }
    if (follow && controls) {
      controls.current.target.copy(planet.current.position.clone());
      controls.current.maxDistance = 20;
    }
  }, []);

  function startFollow() {
    console.log(ref === ref);
    setFollow(true);
  }

  function endFollow() {
    setFollow(false);
    controls.current.reset();
  }

  return (
    <>
      <Html
        ref={ref}
        zIndexRange={[11, 0]}
        className="overlay"
        style={{ opacity: opacity }}
      >
        <div className="wrapper">
          <span
            className="icon"
            onClick={handleClick}
            onContextMenu={handleClick}
          >
            <svg
              onMouseEnter={() => setSColor("blue")}
              onMouseLeave={() => setSColor(planet.current.userData.scolor)}
              style={svgStyle}
            >
              <circle cx="10" cy="10" r="9" strokeWidth="1" fill="none" />
            </svg>
          </span>
          <span className="content">{name}</span>
        </div>
      </Html>
    </>
  );
};

PlanetOverlay.propTypes = {
  planet: PropTypes.object,
};
