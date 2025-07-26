import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('app').style.display = 'none';
});

document.getElementById('centreButton').addEventListener('click', function () {
  document.getElementById('app').style.display = 'block';
  document.getElementById('centreButton').style.display = 'none';
});

// three.js code
//setting up scene and camera for rendering
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

let spinClockwise = false;
let currentPlaybackTime = 0;

//background texture
const spaceTexture = new THREE.TextureLoader().load('/images/sun.jpeg');
scene.background = spaceTexture;

//setting size of canvas for rendering
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// setting up sphere and mesh
const sunTexture = new THREE.TextureLoader().load('/images/sun.jpeg');
const geometry = new THREE.SphereGeometry(15, 64, 64);
const material = new THREE.MeshBasicMaterial({ map: sunTexture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

//setting up camera listener for audio
const listener = new THREE.AudioListener();
camera.add(listener);
//setting up positional audio
const sound = new THREE.PositionalAudio(listener);
//setting up audio loader for music
const audioLoader = new THREE.AudioLoader();

const moonGeometry = new THREE.SphereGeometry(10, 64, 64);
const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const moonSphere = new THREE.Mesh(moonGeometry, moonMaterial);
sphere.add(moonSphere);
moonSphere.visible = true;
moonSphere.position.setZ(10);
moonSphere.position.setX(30)
moonSphere.add(sound);

//lights
const pointLight = new THREE.PointLight(0xffffff, 20);
pointLight.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(pointLight, ambientLight);

//camera movement
const controls = new OrbitControls(camera, renderer.domElement);

//star function
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
//adds stars to scene
Array(200).fill().forEach(addStar);


function playAudio(filePath, startTime = 0) {
  sound.stop();
  audioLoader.load(filePath, function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setRefDistance(5);
    sound.setVolume(0.5);
    sound.playbackRate = 1;
    sound.startTime = startTime;
    sound.play();
  })
}
// Event listener for key presses
document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowRight') {
    currentPlaybackTime = sound.context.currentTime - sound.startTime;
    playAudio('/audio/sunshine.mp3', currentPlaybackTime);
    spinClockwise = false;
  }
  if (event.code === 'ArrowLeft') {
    currentPlaybackTime = sound.context.currentTime - sound.startTime;
    playAudio('/audio/enihsnus.mp3', currentPlaybackTime);
    spinClockwise = true;
  }
  if (event.code === 'Space') {
    {
      if (sound.isPlaying) {
        sound.pause();
      }
      else {
        sound.play();
      }
    }
  }
});

//resizes objects on window resize
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}
//controls all animations and updates
function animate() {
  requestAnimationFrame(animate);
  onWindowResize()
  controls.update();

  if (spinClockwise) {
    sphere.rotation.y -= 0.01;
  }
  else {
    sphere.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

animate();