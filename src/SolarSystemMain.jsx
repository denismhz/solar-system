import { Canvas } from "@react-three/fiber";
import {
  Suspense,
  useRef,
  createContext,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";

import { ScreenOverlay } from "./planets/omnioverlay.jsx";
import { SharedPlanetState } from "./SharedPlanetState.jsx";
import { Skybox } from "./Skybox.jsx";
import { CustomCamera } from "./CustomCamera.jsx";

export const MyContext = createContext();

const SolarSystemScene = () => {
  const controls = useRef();
  let customData = useRef({});
  const [pinfo, setPinfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linePos, setLinePos] = useState(null);

  useLayoutEffect(() => {
    const fetchPlanetInfo = async () => {
      fetch(`http://192.168.1.136:8000/planetInfo`).then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        setLoading(true);
        response
          .json()
          .then((data) => {
            setPinfo(data);
          })
          .catch(() => {
            setPinfo(null);
          })
          .finally(() => {
            setLoading(false);
          });
      });
    };
    fetchPlanetInfo();
    const fetchLinePos = async () => {
      fetch(`http://192.168.1.136:8000/duration/line`).then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        setLoading(true);
        response
          .json()
          .then((data) => {
            
            setLinePos(data);
          })
          .catch(() => {
            setLinePos(null)
          })
          .finally(() => {
            setLoading(false);
          });
      });
    };
    //fetchLinePos();
    fetchPlanetInfo();
  }, []);

  useEffect(() => {
    //console.log(progress);
  });

  return (
    <Suspense fallback={<div className="loadingScreen">Suspense</div>}>
      {!loading && (
        <>
          <MyContext.Provider value={{ controls, customData }}>
            <ScreenOverlay planetInfo={pinfo} />

            {true && (
              <Canvas
                camera={{
                  position: [0, 0, 100],
                  fov: 75,
                  near: 0.1,
                  far: 10000000,
                }}
              >
                {true && <CustomCamera />}
                <Skybox />
                <ambientLight intensity={0.025} />
                <pointLight position={[0, 0, 0]} />
                <SharedPlanetState planetData={pinfo} linePos={linePos}/>
              </Canvas>
            )}
          </MyContext.Provider>
        </>
      )}
    </Suspense>
  );
};

export default SolarSystemScene;
