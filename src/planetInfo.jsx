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
  forwardRef,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { MyContext } from "./Scene3";
import saturnImage from "./saturn.jpg";

import "./styles.css";

import PropTypes from "prop-types";

export const PlanetInfo = memo(
  forwardRef(function PlanetInfo(props, ref) {
    const navigate = useNavigate();
    const [visibility, setVisibility] = useState("hidden");
    const { customData } = useContext(MyContext);
    const [planetData, setPlanetData] = useState({ name: "Default" });

    useEffect(() => {
      const showInfo = (planet) => {
        if (planet && planet.name) setPlanetData({ name: planet.name });
        console.log(planetData);
        setVisibility("visible");
      };
      if (showInfo) customData.current["showInfo"] = showInfo;
    }, [customData, planetData]);

    const someEventHandler = () => {
      navigate("/");
    };

    function closeInfo() {
      setVisibility("hidden");
    }

    return (
      <div className="planetInfo" style={{ visibility: visibility }}>
        <div className="wrapper">
          <h1>{planetData.name}</h1>
          <img src={saturnImage}></img>
          <p>
            Adorned with a dazzling, complex system of icy rings, Saturn is
            unique in our solar system. The other giant planets have rings, but
            none are as spectacular as Saturn's.
          </p>
          <button type="button" onClick={closeInfo}>
            Visit
          </button>
        </div>
      </div>
    );
  })
);

PlanetInfo.propTypes = {
  planet: PropTypes.object,
};
