import * as THREE from "three";

const textL = new THREE.TextureLoader();

const material = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/jupiter/jupiter2_4k.jpg"),
});

const jupiterMesh = new THREE.Mesh(
  new THREE.SphereGeometry(69911 / 6000, 50, 50),
  material
);

jupiterMesh.name = "jupiterMesh";

const jupiterGroup = new THREE.Group();
jupiterGroup.name = "jupiterGroup";
jupiterGroup.userData.id = 599;
jupiterGroup.add(jupiterMesh);

export { jupiterMesh, jupiterGroup };
