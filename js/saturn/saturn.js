import * as THREE from "three";
import { BoxGeometry } from "three";

const textL = new THREE.TextureLoader();

const material = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/saturn/saturnmap.jpg"),
});

const saturnMesh = new THREE.Mesh(
  new THREE.SphereGeometry(58232 / 6000, 30, 30),
  material
);

saturnMesh.name = "saturnMesh";

const sringGeo = new THREE.RingGeometry(
  58232 / 6000 + 1,
  58232 / 6000 + 5,
  100,
  100
);

const textured = textL.load("../../img/saturn/saturnringcolor.jpg");
const otexture = textL.load("../../img/saturn/saturnringpattern.gif");

const sringMaterial = new THREE.ShaderMaterial({
  uniforms: {
    texturea: { value: textured },
    alphaTex: { value: otexture },
    innerRadius: { value: 58232 / 6000 + 0 },
    outerRadius: { value: 58232 / 6000 + 0 },
  },
  vertexShader: `
    varying vec3 vPos;
    
    void main() {
      vPos = position;
      vec3 viewPosition = (modelViewMatrix * vec4(position, 1.)).xyz;
      gl_Position = projectionMatrix * vec4(viewPosition, 1.);
    }
  `,
  fragmentShader: `
    uniform sampler2D texturea;
    uniform sampler2D alphaTex;
    uniform float innerRadius;
    uniform float outerRadius;

    varying vec3 vPos;

    vec4 color() {
      vec2 uv = vec2(0);
      uv.x = (length(vPos) - innerRadius) / (innerRadius + outerRadius);  
      
      vec4 pixel = texture2D(texturea, uv);
      vec4 pixel2 = texture2D(alphaTex, uv);
      pixel[3] = pixel2[0];
      if (pixel[3] <= 0.01) {
        discard;
      }
      return pixel;
    }

    void main() {
      gl_FragColor = color();
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
});

const sringMat = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/saturn/saturnringcolor.jpg"),
  alphaMap: textL.load("../../img/saturn/saturnringpattern.gif"),
  side: THREE.DoubleSide,
  transparent: true,
});

const sringMesh = new THREE.Mesh(sringGeo, sringMaterial);

const saturnGroup = new THREE.Group();
saturnGroup.name = "saturnGroup";
saturnGroup.userData.id = 699;
saturnGroup.add(saturnMesh);
saturnGroup.add(sringMesh);

export { saturnMesh, saturnGroup };
