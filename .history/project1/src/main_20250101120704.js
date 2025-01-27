import { getStrideLength } from 'three/src/renderers/common/BufferUtils.js';
import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { PI } from 'three/src/nodes/TSL.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

const listener = new THREE.AudioListener();
camera.add( listener);

const sound = new THREE.Audio
const spaceTexture = new THREE.TextureLoader().load('../images/sun.jpeg');
scene.background = spaceTexture;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const trollTexture = new THREE.TextureLoader().load('./images/sun.jpeg')

const geometry = new THREE.SphereGeometry(15,64,64);
const material = new THREE.MeshBasicMaterial({map:trollTexture});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const pointLight = new THREE.PointLight(0xffffff,20);
pointLight.position.set(0,0,0);

const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(pointLight,ambientLight);



// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200,50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);


 

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshBasicMaterial({color:0xffffff});
  const star = new THREE.Mesh( geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));
  star.position.set(x, y, z);
  scene.add(star);
}
 
Array(200).fill().forEach(addStar);

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
  requestAnimationFrame(animate);
  onWindowResize()
  controls.update();

  sphere.rotation.y += 0.03;

  renderer.render(scene, camera);
}

animate();