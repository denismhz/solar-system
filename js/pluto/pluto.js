import * as THREE from "three";

const textL = new THREE.TextureLoader();

const material = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/pluto/plutomap2k.jpg"),
  bumpMap: textL.load("../../img/pluto/plutobump2k.jpg"),
});

const plutoMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1188 / 6000, 50, 50),
  material
);

plutoMesh.name = "plutoMesh";

const plutoGroup = new THREE.Group();
plutoGroup.name = "plutoGroup";
plutoGroup.add(plutoMesh);

export { plutoMesh, plutoGroup };
