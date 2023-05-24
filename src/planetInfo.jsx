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
import saturnImage from "./planet_overlay_img/saturn.jpg";

import "./styles.css";

import PropTypes from "prop-types";

export const PlanetInfo = memo(
  forwardRef(function PlanetInfo(props, ref) {
    const navigate = useNavigate();
    const [visibility, setVisibility] = useState("hidden");
    const { customData } = useContext(MyContext);
    const [planetData, setPlanetData] = useState({ name: "Default" });

    function getPlanetDataAtName() {}

    useEffect(() => {
      console.log(props.planetInfo);
      const showInfo = (planet) => {
        props.planetInfo.forEach((oplanet) => {
          if (planet.name == oplanet.name) {
            setPlanetData(oplanet);
          }
        });
        //if (planet && planet.name) setPlanetData({ name: planet.name });
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
      <div
        className={visibility == "visible" ? "planetInfo" : "planetInfoFadeIn"}
        style={{ visibility: visibility }}
      >
        <div className="wrapper">
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={closeInfo}
          >
            X
          </button>
          <h1>{planetData.name}</h1>
          <img src={saturnImage}></img>
          <p>{planetData.Description}</p>
          <div className="data-wrapper">
            <div className="data">
              <span style={{ color: planetData.color }} className="data-1">
                {planetData.LOY}
              </span>
              <span className="data-2">Earth Days/Years</span>
            </div>
            <div className="data">
              <span style={{ color: planetData.color }} className="data-1">
                {planetData.DFS}
              </span>
              <span className="data-2">AU</span>
              <span className="data-3">Distance from Sun</span>
            </div>
            <div className="data">
              <span style={{ color: planetData.color }} className="data-1">
                {planetData.Moons}
              </span>
              <span className="data-2">Moons</span>
            </div>
            <div className="data">
              <span style={{ color: planetData.color }} className="data-1">
                {planetData.Radius}
              </span>
              <span className="data-2">Radius</span>
              <span className="data-3">Kilometers</span>
            </div>
          </div>
        </div>
      </div>
    );
  })
);

PlanetInfo.propTypes = {
  planet: PropTypes.object,
};
