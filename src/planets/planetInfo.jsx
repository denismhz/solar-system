import { useState, useEffect, useContext } from "react";
import { MyContext } from "../SolarSystemMain";
import PropTypes from "prop-types";

export const PlanetInfo = (props) => {
  const [visibility, setVisibility] = useState("hidden");
  const { customData } = useContext(MyContext);
  const [planetData, setPlanetData] = useState({ name: "Default" });

  useEffect(() => {
    const showInfo = (planet) => {
      props.planetInfo.forEach((oplanet) => {
        if (planet.name == oplanet.name) {
          setPlanetData(oplanet);
        }
      });
      setVisibility("visible");
    };
    if (showInfo) customData.current["showInfo"] = showInfo;
  }, [customData, planetData, props.planetInfo]);

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
        <img id="plInfoImg" src={`${planetData.name.toLowerCase()}.jpg`}></img>
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
};

PlanetInfo.propTypes = {
  planet: PropTypes.object,
  planetInfo: PropTypes.array
};
