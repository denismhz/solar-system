import * as THREE from "three";

const textL = new THREE.TextureLoader();

const material = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/uranus/uranusmap.jpg"),
});

const uranusMesh = new THREE.Mesh(
  new THREE.SphereGeometry(25362 / 6000, 50, 50),
  material
);

uranusMesh.name = "uranusMesh";

const uranusGroup = new THREE.Group();
uranusGroup.name = "uranusGroup";
uranusGroup.userData.id = 799;
uranusGroup.add(uranusMesh);

export { uranusMesh, uranusGroup };
