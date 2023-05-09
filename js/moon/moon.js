import * as THREE from "three";

const textL = new THREE.TextureLoader();

const r = 1737 / 6000;
const s = 50;

const moonMaterial = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/moon/moonmap4k.jpg"),
  bumpMap: textL.load("../../img/moon/moonbump4k.jpg"),
  bumpScale: 0.2,
});

const moonMesh = new THREE.Mesh(
  new THREE.SphereGeometry(r, s, s),
  moonMaterial
);

export { moonMesh };
