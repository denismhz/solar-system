import * as THREE from "three"

const textL = new THREE.CubeTextureLoader();

//const skyboxGeo = new THREE.BoxGeometry(10000,10000,10000);
//const skybox = new THREE.Mesh(skyboxGeo);

const skybox = textL.load([
    "../img/skybox/front.png",
    "../img/skybox/back.png",
    "../img/skybox/top.png",
    "../img/skybox/bottom.png",
    "../img/skybox/left.png",
    "../img/skybox/right.png"
])

export default skybox
