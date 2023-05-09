import * as THREE from "three";

const textL = new THREE.TextureLoader();

const material = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/neptune/neptunemap.jpg"),
});

const neptuneMesh = new THREE.Mesh(
  new THREE.SphereGeometry(24622 / 6000, 50, 50),
  material
);

neptuneMesh.name = "neptuneMesh";

const neptuneGroup = new THREE.Group();
neptuneGroup.name = "neptuneGroup";
neptuneGroup.userData.id = 899;
neptuneGroup.add(neptuneMesh);

export { neptuneMesh, neptuneGroup };
