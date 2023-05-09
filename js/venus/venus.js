import * as THREE from "three";

const textL = new THREE.TextureLoader();

const material = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/venus/venusmap.jpg"),
  bumpMap: textL.load("../../img/venus/venusbump.jpg"),
  bumpScale: 0.2,
});

const venusMesh = new THREE.Mesh(
  new THREE.SphereGeometry(6051.8 / 6000, 30, 30),
  material
);

venusMesh.name = "venusMesh";

const venusGroup = new THREE.Group();
venusGroup.name = "venusGroup";
venusGroup.userData.id = 299;
venusGroup.add(venusMesh);

export { venusMesh, venusGroup };
