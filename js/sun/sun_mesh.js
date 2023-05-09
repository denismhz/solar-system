import * as THREE from "three";

const standardSunMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xffd700,
  emissiveMap: new THREE.TextureLoader().load("./img/sun/sun_uv.jpg"),
  emissiveIntensity: 1,
});

const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(10000 / 6000, 30, 30),
  standardSunMaterial
);

sunMesh.name = "sunMesh";

var sunLight = new THREE.PointLight(0xffffff, 1, 10000.0, 2);
const sunGroup = new THREE.Group();
sunGroup.name = "Sun";
sunGroup.add(sunMesh);
//sunGroup.add(sunLight);

export { sunGroup, sunMesh };
