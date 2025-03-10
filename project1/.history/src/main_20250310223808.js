import { getStrideLength } from 'three/src/renderers/common/BufferUtils.js';
import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { PI } from 'three/src/nodes/TSL.js';

//setting up scene and camera for rendering
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});


//background texture
const spaceTexture = new THREE.TextureLoader().load('../images/sun.jpeg');
scene.background = spaceTexture;

//setting size of canvas for rendering
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// setting up sphere and mesh
const sunTexture = new THREE.TextureLoader().load('./images/sun.jpeg')
const geometry = new THREE.SphereGeometry(15,64,64);
const material = new THREE.MeshBasicMaterial({map:sunTexture});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

//setting up camera listener for audio
const listener = new THREE.AudioListener();
camera.add( listener);
//setting up positional audio
const sound = new THREE.PositionalAudio( listener );
//setting up audio loader for music
const audioLoader = new THREE.AudioLoader();

function playAudio(){
    sound.setLoop(true);
    sound.setRefDistance(5);
    sound.setVolume(0.5);
    sound.playbackRate = 1;
  sound.play();   
  }


const moonGeometry = new THREE.SphereGeometry(10,64,64);
const moonMaterial = new THREE.MeshBasicMaterial({color:0xffffff});
const moonSphere = new THREE.Mesh(moonGeometry, moonMaterial);
sphere.add(moonSphere);
moonSphere.visible = false;
moonSphere.position.setZ(10);
moonSphere.position.setX(30)
moonSphere.add(sound);

//lights
const pointLight = new THREE.PointLight(0xffffff,20);
pointLight.position.set(0,0,0);

const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(pointLight,ambientLight);

//camera movement
const controls = new OrbitControls(camera, renderer.domElement);

//star function
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshBasicMaterial({color:0xffffff});
  const star = new THREE.Mesh( geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));
  star.position.set(x, y, z);
  scene.add(star);
}
//adds stars to scene
Array(200).fill().forEach(addStar);

// Event listener for space bar press
document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowRight') {
    sound.stop();
      audioLoader.load( './audio/sunshine.mp3', function(buffer) {
        playAudio();
      })
  }
  if (event.code === 'ArrowLeft') {
    sound.stop();
      audioLoader.load( './audio/enihsnus.mp3', function(buffer) {
        sound.setBuffer(buffer);
        playAudio();
      })
  }
  if (event.code === 'Space') {
    {
      if(sound.isPlaying)
      {
        sound.pause(); 
      }
      else{
        sound.play();
      }
    }
  }
});

//resizes objects on window resize
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
//controls all animations and updates
function animate() {
  requestAnimationFrame(animate);
  onWindowResize()
  controls.update();

  sphere.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();