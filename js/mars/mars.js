import * as THREE from "three";

const textL = new THREE.TextureLoader();

const material = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/mars/mars_1k_color.jpg"),
  bumpMap: textL.load("../../img/mars/mars_1k_topo.jpg"),
  normalMap: textL.load("../../img/mars/mars_1k_normal.jpg"),
});

const marsMesh = new THREE.Mesh(
  new THREE.SphereGeometry(3389.5 / 6000, 50, 50),
  material
);

marsMesh.name = "mercuryMesh";

const marsGroup = new THREE.Group();
marsGroup.name = "marsGroup";
marsGroup.userData.id = 499;
marsGroup.add(marsMesh);

export { marsMesh, marsGroup };
