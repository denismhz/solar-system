import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useState, useRef, createContext, useContext } from "react";
import * as THREE from "three";
import { MyContext } from "./SolarSystemMain.jsx";
import Planet from "./planets/planet.jsx";
import Sun from "./planets/sun.jsx";
import PropTypes from "prop-types";

export const PlanetOverlayContext = createContext();

export const SharedPlanetState = ({ planetData, linePos }) => {
  const distanceScaleFactor = 1000000;
  const { customData } = useContext(MyContext);

  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState(null);
  const [realPos, setRealPos] = useState(null);
  let first = useRef(true);

  const planetPositionIndex = useRef(0);
  const lastPositionUpdate = useRef(0);
  const lastRealPositionUpdate = useRef(0);

  let [nameVis, setNameVis] = useState("visible");
  let [iconVis, setIconVis] = useState("visible");
  let [pathVis, setPathVis] = useState("visible");

  const handleVisibility = () => {
    if (nameVis == "visible" && iconVis == "visible" && pathVis == "visible") {
      setNameVis("hidden");
    } else if (nameVis == "hidden" && iconVis == "visible" && pathVis == "visible") {
      setIconVis("hidden");
    } else if (nameVis == "hidden" && iconVis == "hidden" && pathVis == "visible") {
      setPathVis("hidden")
    } else if(nameVis == "hidden" && iconVis == "hidden" && pathVis == "hidden"){
      setIconVis("visible");
      setNameVis("visible");
      setPathVis("visible")
    }
  };
  customData.current["handleVisibility"] = handleVisibility;

  const handleReset = () => {
    setSpeed(-1);
    console.log("reset");
    planetPositionIndex.current = 0;
    lastRealPositionUpdate.current = 0;
    getRealTimePos();
  };
  customData.current["handleReset"] = handleReset;

  //set speed (timeinterval between positions 60000ms*speed)
  const [speed, setSpeed] = useState(-1);
  const updateSpeed = (newSpeed) => {
    setSpeed(newSpeed);
  };
  customData.current["updateSpeed"] = updateSpeed;

  //get position data and reset if necessary
  const dateTime = useRef(new Date(Date.now()));

  function updatePlanetPosition(group, posArr, lineArr, realPos) {
    if (
      !loading &&
      planetPositionIndex.current < posArr.length &&
      speed != -1
    ) {
      group.current.position.set(
        Number(
          posArr[planetPositionIndex.current].position.x / distanceScaleFactor
        ),
        Number(
          posArr[planetPositionIndex.current].position.y / distanceScaleFactor
        ),
        Number(
          posArr[planetPositionIndex.current].position.z / distanceScaleFactor
        )
      );

      //realtime

      customData.current.setDate(
        new Date(positions[199][planetPositionIndex.current].date)
      );
      if (speed > 0) {
        lineArr.current.push(
          new THREE.Vector3(
            Number(
              posArr[planetPositionIndex.current].position.x /
                distanceScaleFactor
            ),
            Number(
              posArr[planetPositionIndex.current].position.y /
                distanceScaleFactor
            ),
            Number(
              posArr[planetPositionIndex.current].position.z /
                distanceScaleFactor
            )
          )
        );
      }
    }
    //realtime
    if (speed == -1) {
      group.current.position.set(
        Number(realPos.position.x / distanceScaleFactor),
        Number(realPos.position.y / distanceScaleFactor),
        Number(realPos.position.z / distanceScaleFactor)
      );
      customData.current.setDate(
        new Date(realPos.date)
      );
    }
  }

  useFrame(({ clock }) => {
    if (first.current) {
      getAllPositions();
      getRealTimePos();
      first.current = false;
    }
    if (speed > 0 && !loading) planetPositionIndex.current += Number(speed);
    const timeSinceLastUpdate = clock.elapsedTime - lastPositionUpdate.current;
    const timeSinceLastRealUpdate = clock.elapsedTime - lastRealPositionUpdate.current;
    if(timeSinceLastRealUpdate > 60) {
      lastRealPositionUpdate.current = clock.elapsedTime;
      getRealTimePos()
    }
    if (timeSinceLastUpdate >= 1 && !loading && speed > 0) {
      
      getAllPositions();
      lastPositionUpdate.current = clock.elapsedTime;
    }
  });

  const getAllPositions = () => {
    if (positions && positions[199].length > 0 && speed > 0) {
      dateTime.current = new Date(
        positions[199][positions[199].length - 1].date
      ).toUTCString();
    }

    const fetchData = async () => {
      fetch(
        `http://192.168.1.136:8000/duration` + `?date=${dateTime.current}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        response
          .json()
          .then((data) => {
            if (!positions) {
              setPositions(data);
            } else {
              let obj = new Object();
              for (let key in positions) {
                obj[key] = positions[key].concat(data[key]);
              }
              setPositions(obj);
            }
          })
          .catch(() => {})
          .finally(() => {
            setLoading(false);
          });
      });
    };
    fetchData();
  };

  const getRealTimePos = () => {
    const fetchData = async () => {
      fetch(`http://192.168.1.136:8000/now`).then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        response
          .json()
          .then((data) => {
            setRealPos(data);
          })
          .catch(() => {})
          .finally(() => {
            //setLoading(false);
          });
      });
    };
    fetchData();
  };

  const planets = [];
  for (let planet of planetData) {
    planets.push(
      <Planet
        key={planet._id}
        planetData={planet}
        setPosition={updatePlanetPosition}
        positions={positions && positions[planet._id]}
        realPos={realPos && realPos[planet._id]}
        linePos={linePos && linePos[planet._id]}
      />
    );
  }

  return (
    <>
      <PlanetOverlayContext.Provider value={{ nameVis, iconVis, speed, pathVis }}>
        {!loading && planets}
        {loading && (
          <Html>
            <h1 style={{color:"white"}}>Loading...</h1>
          </Html>
        )}
        <Sun />
      </PlanetOverlayContext.Provider>
    </>
  );
};

SharedPlanetState.propTypes = {
  planetData: PropTypes.array,
  linePos: PropTypes.object
};
