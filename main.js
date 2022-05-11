import './style.css';

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  10000
);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.MeshBasicMaterial({
    // color: 0xbaba71,
    map: new THREE.TextureLoader().load('./images/globe.jpeg'),
  })
);
// console.log(sphere);
scene.add(sphere);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
