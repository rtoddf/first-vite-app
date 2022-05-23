import * as THREE from 'three';
import gsap from 'gsap';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl';

import './style.css';
// console.log('fragmentShader: ', fragmentShader);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  10000
);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// create globe
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load('./images/globe.jpeg'),
      },
    },
  })
  // new THREE.MeshBasicMaterial({
  //   color: 0xbaba71,
  //   map: new THREE.TextureLoader().load('./images/globe.jpeg'),
  // })
);
scene.add(sphere);

// create atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);

atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);

// create a group to hold the sphere, so you can aniimate it's position from where it currently is
const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
});

const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 1000;
  const y = (Math.random() - 0.5) * 1000;
  const z = -Math.random() * 3000;
  starVertices.push(x, y, z);
}

// console.log('starVertices: ', starVertices);

starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
// console.log('stars: ', stars);
scene.add(stars);

const mouse = {
  x: undefined,
  y: undefined,
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphere.rotation.y += 0.003;
  // animating the group based on the mouse x position
  // group.rotation.y = mouse.x * 0.5;
  // using gsap to smooth out the transitions with a delay
  gsap.to(group.rotation, {
    x: -mouse.y * 0.5,
    y: mouse.x * 0.3,
    duration: 2,
  });
}
animate();

addEventListener('mousemove', () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = (event.clientY / innerHeight) * 2 - 1;
  // console.log('nouse: ', mouse);
});

// https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

// https://thebookofshaders.com/glossary/?search=texture2D
