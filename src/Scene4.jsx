import {
    Canvas,
    extend,
    useFrame,
    useLoader,
    useThree,
  } from "@react-three/fiber";
  import {
    OrbitControls,
  } from "@react-three/drei";
  import React, { useRef, Suspense, useLayoutEffect, useState, useEffect } from "react";
  import * as THREE from "three";
  import glsl from "glslify";

  import { TextureLoader } from "three/src/loaders/TextureLoader";

  const Planet = ({planetData}) => {
    
    const [ready, setReady] = useState(false);



    const colorMap = useLoader(TextureLoader, planetData.colorMap); 

    useLayoutEffect(() => {
        console.log(planetData.colorMap)
        //get props

        //setup mesh

        //load textures

        //set ready to true
    })

    useThree(() => {

    })

    return (
        <mesh>
            <sphereGeometry args={[planetData.Radius / 6000, 100, 100]}/>
            <meshPhongMaterial
              map={colorMap}
            />
        </mesh>
        
    )

  }
 
  
  const PlanetScene = () => {
    const [planetData, setPlanetData] = useState( {});
    const [planetDataReady, setPlanetDataReady] = useState(false)
    useLayoutEffect(() => {
        //get planet data
        const fetchPlanetInfo = async () => {
            fetch(`http://127.0.0.1:8000/planetInfo/Earth`).then((response) => {
              if (!response.ok) {
                throw new Error(
                  `This is an HTTP error: The status is ${response.status}`
                );
              }
              //setLoading(true);
              response
                .json()
                .then((data) => {
                    fetch(`http://127.0.0.1:8000/planetData/Earth`).then((response) => {
              if (!response.ok) {
                throw new Error(
                  `This is an HTTP error: The status is ${response.status}`
                );
              }
              //setLoading(true);
              response
                .json()
                .then((data2) => {
                    setPlanetData(Object.assign(data, data2));
                })
                .catch((err) => {
                    console.log(err)
                }).finally(() => {
                  setPlanetDataReady(true);
                })
            });
                })
                .catch((err) => {
                    console.log(err)
                })
            });
            
          };
          fetchPlanetInfo();
    }, []);
    return (
      <Canvas style={{ backgroundColor: "white" }}>
        <Suspense fallback={null}>
          {planetDataReady?<Planet planetData = {planetData}/>:undefined}
          <OrbitControls enablePan={false} />
          <ambientLight intensity={0.5} />
        </Suspense>
      </Canvas>
    );
  };

  
  export default PlanetScene;
  