import * as THREE from "three";
import { earthMesh, earthGroup } from "./js/earth/earth_mesh.js";
import { sunMesh, sunGroup } from "./js/sun/sun_mesh.js";
import { venusMesh, venusGroup } from "./js/venus/venus.js";
import { mercuryMesh, mercuryGroup } from "./js/mercury/mercury.js";
import { marsMesh, marsGroup } from "./js/mars/mars.js";
import { saturnMesh, saturnGroup } from "./js/saturn/saturn.js";
import { jupiterMesh, jupiterGroup } from "./js/jupiter/jupiter.js";
import { uranusMesh, uranusGroup } from "./js/uranus/uranus.js";
import { neptuneMesh, neptuneGroup } from "./js/neptune/neptune.js";
import { plutoMesh, plutoGroup } from "./js/pluto/pluto.js";
import skybox from "./js/skybox/skybox.js";
import { ArcballControls } from "three/addons/controls/ArcballControls";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { BufferAttribute, BufferGeometryLoader, Color, Vector3 } from "three";
import axios from "axios";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { PointLight } from "three";
//import { data } from "./orbitcalculations.js";

var objectsToOutline = [];

let selectedObjects = [];

var distanceScaleFactor = 10000000;

document.body.style.margin = 0;

var clock = new THREE.Clock();
var delta = 0;

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

scene.add(earthGroup);
earthGroup.position.setX(149598262.0 / 1000);
scene.add(sunGroup);
scene.add(venusGroup);
venusGroup.position.setX(108209475.0 / 1000);
scene.add(mercuryGroup);
mercuryGroup.position.setX(57909227.0 / 1000);
scene.add(jupiterGroup);
jupiterGroup.position.setX(778340821.0 / 1000);
scene.add(saturnGroup);
saturnGroup.position.setX(1426666422.0 / 1000);
scene.add(uranusGroup);
uranusGroup.position.setX(2870658186.0 / 1000);
scene.add(marsGroup);
marsGroup.position.setX(227943842.0 / 1000);
scene.add(neptuneGroup);
neptuneGroup.position.setX(4498396441.0 / 1000);

scene.background = skybox;

const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000000000
);
camera.position.z = 40;
//camera.useQuaternion = true;

const renderer = new THREE.WebGLRenderer({ alpha: false });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
//renderer.setClearColor(0x222222, 0.0);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
renderer.autoClear = false;
//var arc = new ArcballControls(camera, renderer.domElement, scene);

const controls = new OrbitControls(camera, renderer.domElement);

var planetGroups = [
  mercuryGroup,
  venusGroup,
  earthGroup,
  marsGroup,
  jupiterGroup,
  saturnGroup,
  uranusGroup,
  neptuneGroup,
];

var meshes = [];
planetGroups.forEach((planet) => {
  meshes.push(planet.children[0]);
});
console.log(meshes);

const color = 0xffffff;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

var composer = new EffectComposer(renderer);

var renderPass = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight, 1.5, 0.4, 0.85)
);

bloomPass.threshold = 0;
bloomPass.strength = 5;
bloomPass.radius = 0;

var outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
);

outlinePass.renderToScreen = true;
composer.addPass(renderPass);
composer.addPass(outlinePass);
//composer.addPass(bloomPass);

var effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms["resolution"].value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);
effectFXAA.renderToScreen = true;
composer.addPass(effectFXAA);

/*var effectFXAA = new ShaderPass(THREE.FXAAShader);
effectFXAA.uniforms["resolution"].value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);
effectFXAA.renderToScreen = true;
composer.addPass(effectFXAA);*/

var params = {
  edgeStrength: 10.0,
  edgeGlow: 1.0,
  edgeThickness: 1.0,
  pulsePeriod: 0,
  rotate: true,
  usePatternTexture: false,
};
outlinePass.edgeStrength = params.edgeStrength;
outlinePass.edgeGlow = params.edgeGlow;
outlinePass.visibleEdgeColor.set(0xffffff);
outlinePass.hiddenEdgeColor.set(0xffffff);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
/*const phongMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  specular: 0x111111,
  shininess: 5,
});
const test = new THREE.Mesh(
  new THREE.SphereGeometry(6371.0, 50, 50),
  phongMaterial
);
test.position.add(new THREE.Vector3(100000, 100000, 100000));
scene.add(test);*/
let lines = [];
planetGroups.forEach((planet) => {
  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const line = new THREE.Line(lineGeometry, lineMaterial);
  lineGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([]), 3)
  );
  lineGeometry.setAttribute(
    "normal",
    new THREE.BufferAttribute(new Float32Array([]), 3)
  );
  line.geometry.attributes.position.needsUpdate = true;
  scene.add(line);
  planet.userData["line"] = line;
});
console.log(lines);

//renderer.shadowMap.enabled = true;
//light.castShadow = true;
//light.shadow.mapSize.width = 512;
//light.shadow.mapSize.height = 512;
//light.shadow.camera.near = 150;
//light.shadow.camera.far = 350;

var obj = null;
function onPointerDown(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(planetGroups);
  for (let i = 0; i < intersects.length; i++) {
    obj = intersects[i].object.parent;
  }
  if (event.button == 0 && obj) {
    controls.target.copy(obj.position);
    controls.minDistance = obj.children[0].geometry.boundingSphere.radius * 1.5;
    controls.maxDistance = obj.children[0].geometry.boundingSphere.radius * 10;
    controls.update();
  }
  if (event.button == 2) {
    obj = null;
    controls.minDistance = 1;
    controls.maxDistance = Infinity;
  }
}

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // calculate objects intersecting the picking ray
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObject(scene, true);

  function addSelectedObject(object) {
    selectedObjects = [];
    selectedObjects.push(object);
  }

  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    addSelectedObject(selectedObject);
    outlinePass.selectedObjects = selectedObjects;
  } else {
    outlinePass.selectedObjects = [];
  }
}

var url = "http://127.0.0.1:8000/duration";

var data;
setInterval(
  await axios.get(url).then((res) => {
    data = res.data;
    console.log(data);
  }),
  10000
);
planetGroups.forEach((planet) => {
  planet.userData["positions"] = data[planet.userData.id];
});
function calculateOrbitLength() {
  planetGroups.forEach((planet) => {
    let length = 0;
    if (planet.name != "Sun") {
      for (let i = 0; i < planet.userData.positions.length - 1; i += 2) {
        const dx = Math.abs(
          planet.userData.positions[i + 1].x - planet.userData.positions[i].x
        );
        const dy = Math.abs(
          planet.userData.positions[i + 1].y - planet.userData.positions[i].y
        );
        const dz = Math.abs(
          planet.userData.positions[i + 1].z - planet.userData.positions[i].z
        );
        var segment = Math.sqrt(dx * dx + dy * dy + dz * dz);
        //console.log(
        //  `dx: ${dx}, dy: ${dy}, dz: ${dz}, segmentLength: ${segment}`
        //);
        length += segment;
      }
    }
    planet.userData["orbitLength"] = length / distanceScaleFactor;
    console.log(
      planet.userData.orbitLength * distanceScaleFactor +
        " " +
        planet.userData.id
    );
  });
}
calculateOrbitLength();

function cutPath(line, maxLength) {
  const positions = line.geometry.attributes.position.array;
  var currLength = getLength(line);
  if (currLength > maxLength) {
    line.geometry.attributes.position.array = positions.slice(3);
    line.geometry.setDrawRange(
      0,
      line.geometry.attributes.position.array.length / 3
    );
  }
}

function getLength(line, maxLength) {
  var length = 0;
  const positions = line.geometry.attributes.position.array;
  for (let i = 0; i < positions.length - 6; i += 3) {
    const dx = positions[i + 3] - positions[i];
    const dy = positions[i + 4] - positions[i + 1];
    const dz = positions[i + 5] - positions[i + 2];
    length += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  return length;
}

var asdf = 0;
var last = 0;
function animate(now) {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  composer.render();

  if (obj) {
    controls.target.copy(obj.position);
  }

  planetGroups.forEach((planet) => {
    if (false) {
      if (planet.name != "Sun") {
        planet.position.set(
          Number(data[planet.userData.id].position.x / distanceScaleFactor),
          Number(data[planet.userData.id].position.y / distanceScaleFactor),
          Number(data[planet.userData.id].position.z / distanceScaleFactor)
        );
      }
    }
    if (planet.name != "Sun" && asdf < data["199"].length) {
      if (true) {
        const vertices =
          planet.userData.line.geometry.attributes.position.array;
        const newVertices = new Float32Array(vertices.length + 3);
        newVertices.set(vertices);
        newVertices.set(
          [
            Number(data[planet.userData.id][asdf].x / distanceScaleFactor),
            Number(data[planet.userData.id][asdf].y / distanceScaleFactor),
            Number(data[planet.userData.id][asdf].z / distanceScaleFactor),
          ],
          vertices.length
        );
        planet.userData.line.geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(newVertices, 3)
        );
        planet.userData["pathLength"] = getLength(planet.userData.line, 10);
        cutPath(planet.userData.line, planet.userData.orbitLength * 0.5);
      }
      planet.position.set(
        Number(data[planet.userData.id][asdf].x / distanceScaleFactor),
        Number(data[planet.userData.id][asdf].y / distanceScaleFactor),
        Number(data[planet.userData.id][asdf].z / distanceScaleFactor)
      );
    }
  });
  performance.now();
  earthGroup.children[0].rotation.y += 0.0015;
  earthGroup.children[1].rotation.y += 0.0025;
  earthGroup.children[3].position.y =
    (-Math.cos(0.001 * performance.now() * 1) * 384000) / 200000;
  earthGroup.children[3].position.z =
    (-Math.sin(0.001 * performance.now() * 1) * 384000) / 200000;
  asdf++;
}
animate();

window.addEventListener("pointermove", onPointerMove);
window.addEventListener("pointerdown", onPointerDown);
