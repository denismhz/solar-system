import { useContext, useState } from "react";
import { PlanetInfo } from "./planetInfo.jsx";
import { MyContext } from "../SolarSystemMain.jsx";

export const ScreenOverlay = (props) => {
  const { customData } = useContext(MyContext);

  const [date, setDate] = useState();
  customData.current["setDate"] = setDate;

  const handleChange = () => {
    customData.current.updateSpeed(0);
  };

  const handleChange0 = () => {
    customData.current.updateSpeed(3);
  };

  const handleChange1 = () => {
    customData.current.updateSpeed(8);
  };

  const handleChange2 = () => {
    customData.current.updateSpeed(20);
  };

  const handleReset = () => {
    customData.current.handleReset();
  };

  const handlePlanetOverlayVisibility = () => {
    customData.current.handleVisibility();
  };

  return (
    <>
      <div className="btn-toolbar slidecontainer">
        <div className="btn-group mr-2" role="group">
          <button onClick={handleReset} className="btn btn-primary">
            &lt;
          </button>
          <button onClick={handleChange} className="btn btn-primary">
            II
          </button>
          <button onClick={handleChange0} className="btn btn-primary">
            &gt;
          </button>
          <button onClick={handleChange1} className="btn btn-primary">
            &gt;&gt;
          </button>
          <button onClick={handleChange2} className="btn btn-primary">
            &gt;&gt;&gt;
          </button>
        </div>
        <div className="btn-group" role="group">
          <button
            onClick={handlePlanetOverlayVisibility}
            className="btn btn-primary"
          >
            O
          </button>
        </div>
      </div>
      <div className="date">
        <span className="dateSpan" style={{ color: "white" }}>
          {date && date.toUTCString()}
        </span>
      </div>
      <PlanetInfo planetInfo={props.planetInfo} />
    </>
  );
};
