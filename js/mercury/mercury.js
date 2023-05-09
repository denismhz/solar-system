import * as THREE from "three";

const textL = new THREE.TextureLoader();

const material = new THREE.MeshPhongMaterial({
  map: textL.load("../../img/mercury/mercurymap.jpg"),
  bumpMap: textL.load("../../img/mercury/mercurybump.jpg"),
});

const mercuryMesh = new THREE.Mesh(
  new THREE.SphereGeometry(2439.7 / 6000, 50, 50),
  material
);

mercuryMesh.name = "mercuryMesh";

const mercuryGroup = new THREE.Group();
mercuryGroup.name = "mercuryGroup";
mercuryGroup.userData.id = 199;
mercuryGroup.add(mercuryMesh);

export { mercuryMesh, mercuryGroup };
