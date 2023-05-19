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
  CubeCamera,
  useCubeCamera,
} from "@react-three/drei";
import React, { useRef, Suspense } from "react";
import * as THREE from "three";
import glsl from "glslify";

const SunPerlinMaterial = shaderMaterial(
  //uniform
  {
    uTime: 0,
  },
  //Vertex SHader
  glsl`
    uniform float uTime;

    varying vec3 vPosition;

  varying vec2 vUv;
  void main(){

    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix* modelViewMatrix*vec4(position,1.);
  }`,
  //Fragment Shader
  glsl`
  //	Classic Perlin 3D Noise 
  //	by Stefan Gustavson
  //
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec4 fade(vec4 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
  
  float cnoise(vec4 P){
    vec4 Pi0 = floor(P); // Integer part for indexing
    vec4 Pi1 = Pi0 + 1.0; // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec4 Pf0 = fract(P); // Fractional part for interpolation
    vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = vec4(Pi0.zzzz);
    vec4 iz1 = vec4(Pi1.zzzz);
    vec4 iw0 = vec4(Pi0.wwww);
    vec4 iw1 = vec4(Pi1.wwww);
  
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 ixy00 = permute(ixy0 + iw0);
    vec4 ixy01 = permute(ixy0 + iw1);
    vec4 ixy10 = permute(ixy1 + iw0);
    vec4 ixy11 = permute(ixy1 + iw1);
  
    vec4 gx00 = ixy00 / 7.0;
    vec4 gy00 = floor(gx00) / 7.0;
    vec4 gz00 = floor(gy00) / 6.0;
    gx00 = fract(gx00) - 0.5;
    gy00 = fract(gy00) - 0.5;
    gz00 = fract(gz00) - 0.5;
    vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
    vec4 sw00 = step(gw00, vec4(0.0));
    gx00 -= sw00 * (step(0.0, gx00) - 0.5);
    gy00 -= sw00 * (step(0.0, gy00) - 0.5);
  
    vec4 gx01 = ixy01 / 7.0;
    vec4 gy01 = floor(gx01) / 7.0;
    vec4 gz01 = floor(gy01) / 6.0;
    gx01 = fract(gx01) - 0.5;
    gy01 = fract(gy01) - 0.5;
    gz01 = fract(gz01) - 0.5;
    vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
    vec4 sw01 = step(gw01, vec4(0.0));
    gx01 -= sw01 * (step(0.0, gx01) - 0.5);
    gy01 -= sw01 * (step(0.0, gy01) - 0.5);
  
    vec4 gx10 = ixy10 / 7.0;
    vec4 gy10 = floor(gx10) / 7.0;
    vec4 gz10 = floor(gy10) / 6.0;
    gx10 = fract(gx10) - 0.5;
    gy10 = fract(gy10) - 0.5;
    gz10 = fract(gz10) - 0.5;
    vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
    vec4 sw10 = step(gw10, vec4(0.0));
    gx10 -= sw10 * (step(0.0, gx10) - 0.5);
    gy10 -= sw10 * (step(0.0, gy10) - 0.5);
  
    vec4 gx11 = ixy11 / 7.0;
    vec4 gy11 = floor(gx11) / 7.0;
    vec4 gz11 = floor(gy11) / 6.0;
    gx11 = fract(gx11) - 0.5;
    gy11 = fract(gy11) - 0.5;
    gz11 = fract(gz11) - 0.5;
    vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
    vec4 sw11 = step(gw11, vec4(0.0));
    gx11 -= sw11 * (step(0.0, gx11) - 0.5);
    gy11 -= sw11 * (step(0.0, gy11) - 0.5);
  
    vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
    vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
    vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
    vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
    vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
    vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
    vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
    vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
    vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
    vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
    vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
    vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
    vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
    vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
    vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
    vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);
  
    vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
    g0000 *= norm00.x;
    g0100 *= norm00.y;
    g1000 *= norm00.z;
    g1100 *= norm00.w;
  
    vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
    g0001 *= norm01.x;
    g0101 *= norm01.y;
    g1001 *= norm01.z;
    g1101 *= norm01.w;
  
    vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
    g0010 *= norm10.x;
    g0110 *= norm10.y;
    g1010 *= norm10.z;
    g1110 *= norm10.w;
  
    vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
    g0011 *= norm11.x;
    g0111 *= norm11.y;
    g1011 *= norm11.z;
    g1111 *= norm11.w;
  
    float n0000 = dot(g0000, Pf0);
    float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
    float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
    float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
    float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
    float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
    float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
    float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
    float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
    float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
    float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
    float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
    float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
    float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
    float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
    float n1111 = dot(g1111, Pf1);
  
    vec4 fade_xyzw = fade(Pf0);
    vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
    vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
    vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
    vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
    float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
    return 2.2 * n_xyzw;
  }
  
  // Classic Perlin noise, periodic version
  float cnoise(vec4 P, vec4 rep){
    vec4 Pi0 = mod(floor(P), rep); // Integer part modulo rep
    vec4 Pi1 = mod(Pi0 + 1.0, rep); // Integer part + 1 mod rep
    vec4 Pf0 = fract(P); // Fractional part for interpolation
    vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = vec4(Pi0.zzzz);
    vec4 iz1 = vec4(Pi1.zzzz);
    vec4 iw0 = vec4(Pi0.wwww);
    vec4 iw1 = vec4(Pi1.wwww);
  
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 ixy00 = permute(ixy0 + iw0);
    vec4 ixy01 = permute(ixy0 + iw1);
    vec4 ixy10 = permute(ixy1 + iw0);
    vec4 ixy11 = permute(ixy1 + iw1);
  
    vec4 gx00 = ixy00 / 7.0;
    vec4 gy00 = floor(gx00) / 7.0;
    vec4 gz00 = floor(gy00) / 6.0;
    gx00 = fract(gx00) - 0.5;
    gy00 = fract(gy00) - 0.5;
    gz00 = fract(gz00) - 0.5;
    vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
    vec4 sw00 = step(gw00, vec4(0.0));
    gx00 -= sw00 * (step(0.0, gx00) - 0.5);
    gy00 -= sw00 * (step(0.0, gy00) - 0.5);
  
    vec4 gx01 = ixy01 / 7.0;
    vec4 gy01 = floor(gx01) / 7.0;
    vec4 gz01 = floor(gy01) / 6.0;
    gx01 = fract(gx01) - 0.5;
    gy01 = fract(gy01) - 0.5;
    gz01 = fract(gz01) - 0.5;
    vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
    vec4 sw01 = step(gw01, vec4(0.0));
    gx01 -= sw01 * (step(0.0, gx01) - 0.5);
    gy01 -= sw01 * (step(0.0, gy01) - 0.5);
  
    vec4 gx10 = ixy10 / 7.0;
    vec4 gy10 = floor(gx10) / 7.0;
    vec4 gz10 = floor(gy10) / 6.0;
    gx10 = fract(gx10) - 0.5;
    gy10 = fract(gy10) - 0.5;
    gz10 = fract(gz10) - 0.5;
    vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
    vec4 sw10 = step(gw10, vec4(0.0));
    gx10 -= sw10 * (step(0.0, gx10) - 0.5);
    gy10 -= sw10 * (step(0.0, gy10) - 0.5);
  
    vec4 gx11 = ixy11 / 7.0;
    vec4 gy11 = floor(gx11) / 7.0;
    vec4 gz11 = floor(gy11) / 6.0;
    gx11 = fract(gx11) - 0.5;
    gy11 = fract(gy11) - 0.5;
    gz11 = fract(gz11) - 0.5;
    vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
    vec4 sw11 = step(gw11, vec4(0.0));
    gx11 -= sw11 * (step(0.0, gx11) - 0.5);
    gy11 -= sw11 * (step(0.0, gy11) - 0.5);
  
    vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
    vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
    vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
    vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
    vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
    vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
    vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
    vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
    vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
    vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
    vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
    vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
    vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
    vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
    vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
    vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);
  
    vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
    g0000 *= norm00.x;
    g0100 *= norm00.y;
    g1000 *= norm00.z;
    g1100 *= norm00.w;
  
    vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
    g0001 *= norm01.x;
    g0101 *= norm01.y;
    g1001 *= norm01.z;
    g1101 *= norm01.w;
  
    vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
    g0010 *= norm10.x;
    g0110 *= norm10.y;
    g1010 *= norm10.z;
    g1110 *= norm10.w;
  
    vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
    g0011 *= norm11.x;
    g0111 *= norm11.y;
    g1011 *= norm11.z;
    g1111 *= norm11.w;
  
    float n0000 = dot(g0000, Pf0);
    float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
    float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
    float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
    float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
    float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
    float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
    float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
    float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
    float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
    float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
    float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
    float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
    float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
    float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
    float n1111 = dot(g1111, Pf1);
  
    vec4 fade_xyzw = fade(Pf0);
    vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
    vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
    vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
    vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
    float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
    return 2.2 * n_xyzw;
  }

  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;

  // 6 lyers of noise

  float fbm(vec4 p){
    float sum = 0.;
    float amp = 1.;
    float scale = 1.;
    for(int i = 0; i < 6; i++){
        sum+=cnoise(p*scale)*amp;
        p.w += 100.;
        amp*=0.9;
        scale *= 2.;
    }
    return sum;
  }
    
    void main(){

        vec4 p = vec4(vPosition*3.,uTime*0.05);

        float noisy = fbm(p);

        vec4 p1 = vec4(vPosition*2.,uTime*0.07);
        float spots = max(cnoise(p1),0.);

        gl_FragColor = vec4(noisy);
        gl_FragColor *= mix(1.,spots, 0.3);
        gl_FragColor *= vec4(1.,0.3,0.,1.);
    }`
);

const SunShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uPerlin: null,
  },
  glsl`
        uniform float uTime;

        varying vec3 vPosition;
        varying vec2 vUv;

        void main(){
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix* modelViewMatrix*vec4(position,1.);
        }`,
  glsl`
        uniform float uTime;
        uniform samplerCube uPerlin;

        varying vec3 vPosition;
        varying vec2 vUv;

        void main(){

          gl_FragColor = textureCube(uPerlin, vPosition);
          //gl_FragColor = vec4(0.8,1.,0.1,1.);
        }`
);

extend({ SunPerlinMaterial });
extend({ SunShaderMaterial });

const Sun = () => {
  const { scene, camera, gl, clock } = useThree();
  console.log(useThree());
  const sunMesh = useRef();
  const scene2 = new THREE.Scene();
  const time = useRef(0);

  const sunPerlinMesh = useRef();
  const sphere = new THREE.SphereGeometry(2, 30, 30);
  const sphereMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uTime: clock.getElapsedTime(),
    },
    vertexShader: `uniform float uTime;

    varying vec3 vPosition;
    varying vec2 vUv;

    void main(){
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix* modelViewMatrix*vec4(position,1.);
    }`,
    fragmentShader: `
        uniform float uTime;
        //uniform samplerCube uPerlin;

        varying vec3 vPosition;
        varying vec2 vUv;

        void main(){

          //gl_FragColor = textureCube(uPerlin, vPosition);
          gl_FragColor = vec4(vUv,1.*uTime,1.);
        }`,
  });
  const sphereMesh = new THREE.Mesh(sphere, sphereMat);

  const perlinSphere = new THREE.SphereGeometry(3, 30, 30);
  const perlinSphereMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uTime: time.current,
    },
    vertexShader: `
    uniform float uTime;

    varying vec3 vPosition;

  varying vec2 vUv;
  void main(){

    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix* modelViewMatrix*vec4(position,1.);
  }`,
    fragmentShader: `
    //	Classic Perlin 3D Noise 
    //	by Stefan Gustavson
    //
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec4 fade(vec4 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
    
    float cnoise(vec4 P){
      vec4 Pi0 = floor(P); // Integer part for indexing
      vec4 Pi1 = Pi0 + 1.0; // Integer part + 1
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec4 Pf0 = fract(P); // Fractional part for interpolation
      vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = vec4(Pi0.zzzz);
      vec4 iz1 = vec4(Pi1.zzzz);
      vec4 iw0 = vec4(Pi0.wwww);
      vec4 iw1 = vec4(Pi1.wwww);
    
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
      vec4 ixy00 = permute(ixy0 + iw0);
      vec4 ixy01 = permute(ixy0 + iw1);
      vec4 ixy10 = permute(ixy1 + iw0);
      vec4 ixy11 = permute(ixy1 + iw1);
    
      vec4 gx00 = ixy00 / 7.0;
      vec4 gy00 = floor(gx00) / 7.0;
      vec4 gz00 = floor(gy00) / 6.0;
      gx00 = fract(gx00) - 0.5;
      gy00 = fract(gy00) - 0.5;
      gz00 = fract(gz00) - 0.5;
      vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
      vec4 sw00 = step(gw00, vec4(0.0));
      gx00 -= sw00 * (step(0.0, gx00) - 0.5);
      gy00 -= sw00 * (step(0.0, gy00) - 0.5);
    
      vec4 gx01 = ixy01 / 7.0;
      vec4 gy01 = floor(gx01) / 7.0;
      vec4 gz01 = floor(gy01) / 6.0;
      gx01 = fract(gx01) - 0.5;
      gy01 = fract(gy01) - 0.5;
      gz01 = fract(gz01) - 0.5;
      vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
      vec4 sw01 = step(gw01, vec4(0.0));
      gx01 -= sw01 * (step(0.0, gx01) - 0.5);
      gy01 -= sw01 * (step(0.0, gy01) - 0.5);
    
      vec4 gx10 = ixy10 / 7.0;
      vec4 gy10 = floor(gx10) / 7.0;
      vec4 gz10 = floor(gy10) / 6.0;
      gx10 = fract(gx10) - 0.5;
      gy10 = fract(gy10) - 0.5;
      gz10 = fract(gz10) - 0.5;
      vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
      vec4 sw10 = step(gw10, vec4(0.0));
      gx10 -= sw10 * (step(0.0, gx10) - 0.5);
      gy10 -= sw10 * (step(0.0, gy10) - 0.5);
    
      vec4 gx11 = ixy11 / 7.0;
      vec4 gy11 = floor(gx11) / 7.0;
      vec4 gz11 = floor(gy11) / 6.0;
      gx11 = fract(gx11) - 0.5;
      gy11 = fract(gy11) - 0.5;
      gz11 = fract(gz11) - 0.5;
      vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
      vec4 sw11 = step(gw11, vec4(0.0));
      gx11 -= sw11 * (step(0.0, gx11) - 0.5);
      gy11 -= sw11 * (step(0.0, gy11) - 0.5);
    
      vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
      vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
      vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
      vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
      vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
      vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
      vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
      vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
      vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
      vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
      vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
      vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
      vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
      vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
      vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
      vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);
    
      vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
      g0000 *= norm00.x;
      g0100 *= norm00.y;
      g1000 *= norm00.z;
      g1100 *= norm00.w;
    
      vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
      g0001 *= norm01.x;
      g0101 *= norm01.y;
      g1001 *= norm01.z;
      g1101 *= norm01.w;
    
      vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
      g0010 *= norm10.x;
      g0110 *= norm10.y;
      g1010 *= norm10.z;
      g1110 *= norm10.w;
    
      vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
      g0011 *= norm11.x;
      g0111 *= norm11.y;
      g1011 *= norm11.z;
      g1111 *= norm11.w;
    
      float n0000 = dot(g0000, Pf0);
      float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
      float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
      float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
      float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
      float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
      float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
      float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
      float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
      float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
      float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
      float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
      float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
      float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
      float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
      float n1111 = dot(g1111, Pf1);
    
      vec4 fade_xyzw = fade(Pf0);
      vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
      vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
      vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
      vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
      float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
      return 2.2 * n_xyzw;
    }
    
    // Classic Perlin noise, periodic version
    float cnoise(vec4 P, vec4 rep){
      vec4 Pi0 = mod(floor(P), rep); // Integer part modulo rep
      vec4 Pi1 = mod(Pi0 + 1.0, rep); // Integer part + 1 mod rep
      vec4 Pf0 = fract(P); // Fractional part for interpolation
      vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = vec4(Pi0.zzzz);
      vec4 iz1 = vec4(Pi1.zzzz);
      vec4 iw0 = vec4(Pi0.wwww);
      vec4 iw1 = vec4(Pi1.wwww);
    
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
      vec4 ixy00 = permute(ixy0 + iw0);
      vec4 ixy01 = permute(ixy0 + iw1);
      vec4 ixy10 = permute(ixy1 + iw0);
      vec4 ixy11 = permute(ixy1 + iw1);
    
      vec4 gx00 = ixy00 / 7.0;
      vec4 gy00 = floor(gx00) / 7.0;
      vec4 gz00 = floor(gy00) / 6.0;
      gx00 = fract(gx00) - 0.5;
      gy00 = fract(gy00) - 0.5;
      gz00 = fract(gz00) - 0.5;
      vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
      vec4 sw00 = step(gw00, vec4(0.0));
      gx00 -= sw00 * (step(0.0, gx00) - 0.5);
      gy00 -= sw00 * (step(0.0, gy00) - 0.5);
    
      vec4 gx01 = ixy01 / 7.0;
      vec4 gy01 = floor(gx01) / 7.0;
      vec4 gz01 = floor(gy01) / 6.0;
      gx01 = fract(gx01) - 0.5;
      gy01 = fract(gy01) - 0.5;
      gz01 = fract(gz01) - 0.5;
      vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
      vec4 sw01 = step(gw01, vec4(0.0));
      gx01 -= sw01 * (step(0.0, gx01) - 0.5);
      gy01 -= sw01 * (step(0.0, gy01) - 0.5);
    
      vec4 gx10 = ixy10 / 7.0;
      vec4 gy10 = floor(gx10) / 7.0;
      vec4 gz10 = floor(gy10) / 6.0;
      gx10 = fract(gx10) - 0.5;
      gy10 = fract(gy10) - 0.5;
      gz10 = fract(gz10) - 0.5;
      vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
      vec4 sw10 = step(gw10, vec4(0.0));
      gx10 -= sw10 * (step(0.0, gx10) - 0.5);
      gy10 -= sw10 * (step(0.0, gy10) - 0.5);
    
      vec4 gx11 = ixy11 / 7.0;
      vec4 gy11 = floor(gx11) / 7.0;
      vec4 gz11 = floor(gy11) / 6.0;
      gx11 = fract(gx11) - 0.5;
      gy11 = fract(gy11) - 0.5;
      gz11 = fract(gz11) - 0.5;
      vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
      vec4 sw11 = step(gw11, vec4(0.0));
      gx11 -= sw11 * (step(0.0, gx11) - 0.5);
      gy11 -= sw11 * (step(0.0, gy11) - 0.5);
    
      vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
      vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
      vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
      vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
      vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
      vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
      vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
      vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
      vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
      vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
      vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
      vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
      vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
      vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
      vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
      vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);
    
      vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
      g0000 *= norm00.x;
      g0100 *= norm00.y;
      g1000 *= norm00.z;
      g1100 *= norm00.w;
    
      vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
      g0001 *= norm01.x;
      g0101 *= norm01.y;
      g1001 *= norm01.z;
      g1101 *= norm01.w;
    
      vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
      g0010 *= norm10.x;
      g0110 *= norm10.y;
      g1010 *= norm10.z;
      g1110 *= norm10.w;
    
      vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
      g0011 *= norm11.x;
      g0111 *= norm11.y;
      g1011 *= norm11.z;
      g1111 *= norm11.w;
    
      float n0000 = dot(g0000, Pf0);
      float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
      float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
      float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
      float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
      float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
      float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
      float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
      float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
      float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
      float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
      float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
      float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
      float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
      float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
      float n1111 = dot(g1111, Pf1);
    
      vec4 fade_xyzw = fade(Pf0);
      vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
      vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
      vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
      vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
      float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
      return 2.2 * n_xyzw;
    }
  
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
  
    // 6 lyers of noise
  
    float fbm(vec4 p){
      float sum = 0.;
      float amp = 1.;
      float scale = 1.;
      for(int i = 0; i < 6; i++){
          sum+=cnoise(p*scale)*amp;
          p.w += 100.;
          amp*=0.9;
          scale *= 2.;
      }
      return sum;
    }
      
      void main(){
  
          vec4 p = vec4(vPosition*3.,uTime*0.05);
  
          float noisy = fbm(p);
  
          vec4 p1 = vec4(vPosition*2.,uTime*10.);
          float spots = max(cnoise(p1),0.);
  
          gl_FragColor = vec4(noisy);
          gl_FragColor *= mix(1.,spots, 0.3);
          gl_FragColor *= vec4(1.,0.3,0.,1.);
      }`,
  });
  //const perlinSphereMesh = new THREE.Mesh(perlinSphere, perlinSphereMat);

  //scene.add(sphereMesh);
  //scene.add(perlinSphereMesh);
  //const scene1 = useRef();
  //const scene2 = useRef();
  //const cubeCamera1 = useRef();
  /*const cubeRenderTarget1 = new THREE.WebGLRenderTarget(256, {
    format: THREE.RGBAFormat,
    generateMipMaps: true,
    minFilter: THREE.LinearMipMapLinearFilter,
    encoding: THREE.sRGBEncoding,
  });
  const cubeCamera = useCubeCamera(256, 0.1, 1000);*/
  const cube = new THREE.CubeCamera();
  scene.add(cube);
  const ref = useRef();
  const ref1 = useRef();
  const tmpRef = useRef();
  useFrame(({ clock, gl }) => {
    perlinSphereMat.uniforms.uTime = clock.getElapsedTime();
    console.log(perlinSphereMat.uniforms.uTime);
    //console.log(gl);
    gl.render(scene, camera);
    time.current = clock.getElapsedTime();
    //console.log(time.current);
    ref.current.uTime = clock.getElapsedTime();
    ref1.current.uTime = clock.getElapsedTime();
    //gl.render(scene, camera);
    //console.log(tmpRef);
    ref1.current.uPerlin = tmpRef.current;

    //cubeCamera.camera.position.copy(sunPerlinMesh.current.position);
    //cubeCamera.camera.update(renderer, scene);
    //gl.render(scene1, camera);
    //console.log(camera);
    //console.log(ref1.current);
  });
  return (
    <>
      <CubeCamera>
        {(texture) => {
          //tmpRef.current = texture;
        }}
      </CubeCamera>
      <mesh ref={sunMesh} position={[0, 0, 0]}>
        <sphereGeometry args={[1.3, 30, 30]} />
        <sunShaderMaterial ref={ref1} />
      </mesh>

      <mesh ref={sunPerlinMesh} position={[0, 0, 0]}>
        <sphereGeometry args={[1.4, 30, 30]} />
        <sunPerlinMaterial ref={ref} />
      </mesh>
    </>
  );
};

const SunScene = () => {
  return (
    <Canvas style={{ backgroundColor: "white" }}>
      <Suspense fallback={null}>
        <Sun />
        <OrbitControls enablePan={false} />
      </Suspense>
    </Canvas>
  );
};

export default SunScene;
