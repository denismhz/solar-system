import { Canvas } from "@react-three/fiber";
import React, {
  Suspense,
  useRef,
  createContext,
  memo,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";

import { ScreenOverlay } from "./omnioverlay.jsx";
import { SharedPlanetState } from "./SharedPlanetState.jsx";
import { Skybox } from "./skybox.jsx";
import { CustomCamera } from "./customCamera.jsx";

export const MyContext = createContext();

const SolarSystemScene = () => {
  const controls = useRef();
  let customData = useRef({});
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pinfo, setPinfo] = useState(null);
  const [err, setErr] = useState(null);
  //const { progress } = useProgress();

  useLayoutEffect(() => {
    const fetchPlanetInfo = async () => {
      fetch(`http://127.0.0.1:8000/planetInfo`).then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        //setLoading(true);
        response
          .json()
          .then((data) => {
            setPinfo(data);
            setErr(null);
          })
          .catch((err) => {
            setPinfo(null);
            setErr(err.message);
          })
          .finally(() => {
            //setLoading(false);
          });
      });
    };
    fetchPlanetInfo();
    const currDate = new Date(Date.now());
    currDate.setSeconds(0);
    currDate.setMilliseconds(0);
    console.log("useEffect init");
    const fetchData = async () => {
      fetch(
        `http://127.0.0.1:8000/duration?date=${currDate.toISOString()}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        setLoading(true);
        response
          .json()
          .then((data) => {
            setInitialData(data);
            setErr(null);
          })
          .catch((err) => {
            setInitialData(null);
            setErr(err.message);
          })
          .finally(() => {
            setLoading(false);
          });
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    //console.log(progress);
  });

  return (
    <Suspense fallback={<div className="loadingScreen">Suspense</div>}>
      {!loading && (
        <>
          <MyContext.Provider value={{ controls, customData }}>
            {!loading && <ScreenOverlay planetInfo={pinfo} />}

            {loading && <div className="loadingScreen">Loading</div>}
            {!loading && (
              <Canvas
              /*camera={{
              position: [0, 0, 100],
              fov: 75,
              near: 0.1,
              far: 1000,
            }}*/
              >
                <CustomCamera />
                <Skybox />
                <ambientLight intensity={0.5} />
                <SharedPlanetState initialData={initialData} />
              </Canvas>
            )}
          </MyContext.Provider>
        </>
      )}
    </Suspense>
  );
};

const Smemo = memo(SolarSystemScene, true);

export default Smemo;
