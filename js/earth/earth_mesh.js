import * as THREE from "three";
import { moonMesh } from "../moon/moon.js";

const textL = new THREE.TextureLoader();

const r = 25;
const s = 50;
const tilt = 1;

const material = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/earth/earth_uv_1k.jpg"),
  bumpMap: textL.load("../../img/earth/earth_bump_1k.jpg"),
  specularMap: textL.load("../../img/earth/earth_spec_1k.jpg"),
  bumpScale: 0.2,
  shininess: 0.5,
});

const earthMesh = new THREE.Mesh(
  new THREE.SphereGeometry(6371.0 / 6000, 50, 50),
  material
);

earthMesh.rotation.z = tilt;

earthMesh.name = "earthMesh";

const cloudGeometry = new THREE.SphereGeometry(6371.0 / 6000 + 0.01, 50, 50);
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/earth/6k_earth_clouds.jpg"),
  transparent: true,
  opacity: 0.5,
});

const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
clouds.rotation.z = tilt;

const axisPoints = [
  new THREE.Vector3(0, 6371.0 / 6000 + 0.5, 0),
  new THREE.Vector3(0, -(6371.0 / 6000 + 0.5), 0),
];
const axisGeometry = new THREE.BufferGeometry().setFromPoints(axisPoints);
const axis = new THREE.Line(
  axisGeometry,
  new THREE.LineBasicMaterial({
    color: 0x330000,
    transparent: true,
    opacity: 0.5,
    linewidth: 2,
  })
);
axis.rotation.z = 0;

//earthMesh.castShadow = true;
//earthMesh.receiveShadow = true;
//clouds.receiveShadow = true;

const earthGroup = new THREE.Group();
moonMesh.position.set(0, 384000 / 200000, 0);
earthGroup.userData.id = 399;
earthGroup.name = "earthGroup";
earthGroup.add(earthMesh);
earthGroup.add(clouds);
earthGroup.add(axis);
earthGroup.add(moonMesh);

export { earthMesh, earthGroup };
