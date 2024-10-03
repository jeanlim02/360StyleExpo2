// Import necessary modules
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { gsap } from 'gsap';

// Setup WebGLRenderer with antialiasing and color space
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;

// Set renderer size and properties
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xd7e7ff); // Set background color
renderer.setPixelRatio(window.devicePixelRatio);

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Append renderer's DOM element to the body of the document
document.body.appendChild(renderer.domElement);

// Create a new Three.js scene
const scene = new THREE.Scene();

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// Adjust the camera near plane and update the projection matrix
camera.near = 0.01;
camera.updateProjectionMatrix();
camera.position.set(15, 2.5, 2.5); // Adjust the camera's position to the side of the house
//camera.rotation.y = -Math.PI / 2; // Rotate 90 degrees to the left

// Initialize OrbitControls for camera manipulation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false; // Smooth out camera movement
controls.enablePan = true; // Enable panning
//controls.minDistance = 5; // Minimum zoom distance
controls.maxDistance = 15; // Maximum zoom distance
controls.minPolarAngle = 0.5; // Limit vertical rotation angle
controls.maxPolarAngle = 1.5; // Limit vertical rotation angle
controls.autoRotate = false; // Disable auto-rotation
//controls.target = new THREE.Vector3(0, 1, 0); // Set orbit control target
controls.target = new THREE.Vector3(0, 2.5, 2.5); // Set orbit control target
controls.update(); // Update controls

// Create and configure the video element in JavaScript
const bgvideo = document.createElement('video');
bgvideo.src = './Assets/cloud bg vid (1).mp4';
bgvideo.loop = true;  // Optionally loop the video
bgvideo.muted = true; // Mute the video (needed for autoplay in most browsers)
bgvideo.play().then(() => {
  console.log('bg video is playing');
}).catch((error) => {
    console.log('Line 56: Error occurred while trying to play the video:', error);
});

// Create a texture from the video and assign it as the scene background
const bgVideoTexture = new THREE.VideoTexture(bgvideo);
scene.background = bgVideoTexture;

// Create a ground plane
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2); // Rotate to lay flat on the x-axis
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555, // Ground color
  side: THREE.DoubleSide // Render both sides of the plane
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false; // Ground does not cast shadows
groundMesh.receiveShadow = true; // Ground receives shadows
scene.add(groundMesh); // Add ground to the scene

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1.2);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
dirLight.position.set(0, 11, 0);
dirLight.target.position.set(-10, 3, 0); // Set the light to point towards the center of the house
scene.add(dirLight.target);
scene.add(dirLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Lower intensity for subtle effect
ambientLight.position.set(0, 0, 0);

const pointLight = new THREE.PointLight(0xfff8d4, 15, 50, 2); 
pointLight.position.set(-3, 3, 0); 
pointLight.castShadow = true;

// Shadow settings
pointLight.shadow.mapSize.width = 2048;  // Increase shadow map size for better quality
pointLight.shadow.mapSize.height = 2048; // Increase shadow map size for better quality
pointLight.shadow.bias = -0.01;           // Adjust shadow bias for sharper shadows

// Optional: Set shadow radius for softer edges (set to 0 for harsher shadows)
pointLight.shadow.radius = 0; // Set radius to 0 for hard shadows

scene.add(pointLight);

//colour, intensity, distance, angle, penumbra (softness of edge), decay
const spotLight = new THREE.SpotLight(0xfff89c, 100, 20, 0.6, 1);
spotLight.penumbra = 0.2;
spotLight.position.set(-4.5, 6.2, 0); // Set spotlight position
spotLight.castShadow = true; // Enable shadow casting
spotLight.shadow.bias = -0.0001; // Adjust shadow bias
scene.add(spotLight);

// Create a target point where the spotlight will shine
const targetPosition = new THREE.Vector3(-4, 0, 0); 
spotLight.target.position.copy(targetPosition); // Set the target position

// Add the target to the scene to ensure it is rendered
scene.add(spotLight.target);

spotLight.castShadow = true;

//FRONT SPOTLIGHT
const frontSpotlight = new THREE.SpotLight(0xff33ff, 100, 20, 0.6, 1);
frontSpotlight.penumbra = 0.2;
frontSpotlight.position.set(4.5, 6.2, 0); // Set position for the new spotlight
frontSpotlight.castShadow = true; // Enable shadow casting
frontSpotlight.shadow.bias = -0.0001; // Adjust shadow bias
scene.add(frontSpotlight);

// Create a target point for the new spotlight
const frontSpotlightTargetPosition = new THREE.Vector3(4, 0, 0);
frontSpotlight.target.position.copy(frontSpotlightTargetPosition); // Set the target position
scene.add(frontSpotlight.target);

//DISPLAY SPOTLIGHTS
//DISPLAY SPOTLIGHT 1 TOP
//colour, intensity, distance, angle, penumbra (softness of edge), decay
const displaySpotlight1 = new THREE.SpotLight(0xffd54d, 100, 20, 0.22, 1);
displaySpotlight1.position.set(3.5, 4, 3.7); // Set position for the new spotlight
displaySpotlight1.castShadow = true; // Enable shadow casting
displaySpotlight1.shadow.bias = -0.0001; // Adjust shadow bias

// Create a target point for the new spotlight
const display1TargetPosition = new THREE.Vector3(3.5, 0, 3.5);
displaySpotlight1.target.position.copy(display1TargetPosition); // Set the target position
scene.add(displaySpotlight1.target);
scene.add(displaySpotlight1);
displaySpotlight1.castShadow = true;

//DISPLAY SPOTLIGHT 1 FRONT
//colour, intensity, distance, angle, penumbra (softness of edge), decay
const displayFrontlight1 = new THREE.SpotLight(0xffffff, 37, 20, 0.2, 1);
displayFrontlight1.penumbra = 0.2;
displayFrontlight1.position.set(3.5, 4.2, 1.5); // Set position for the new spotlight
displayFrontlight1.castShadow = true; // Enable shadow casting
displayFrontlight1.shadow.bias = -0.0001; // Adjust shadow bias

// Create a target point for the new spotlight
const Front1TargetPosition = new THREE.Vector3(3.5, 1.6, 3.5);
displayFrontlight1.target.position.copy(Front1TargetPosition); // Set the target position
scene.add(displayFrontlight1.target);
scene.add(displayFrontlight1);
displayFrontlight1.castShadow = true;

//DISPLAY SPOTLIGHT 2 TOP
//colour, intensity, distance, angle, penumbra (softness of edge), decay
const displaySpotlight2 = new THREE.SpotLight(0xffd54d, 100, 20, 0.22, 1);
displaySpotlight2.position.set(0.8, 4, 3.7); // Set position for the new spotlight
displaySpotlight2.castShadow = true; // Enable shadow casting
displaySpotlight2.shadow.bias = -0.0001; // Adjust shadow bias

// Create a target point for the new spotlight
const display2TargetPosition = new THREE.Vector3(0.8, 0, 3.5);
displaySpotlight2.target.position.copy(display2TargetPosition); // Set the target position
scene.add(displaySpotlight2.target);
scene.add(displaySpotlight2);
displaySpotlight2.castShadow = true;

//DISPLAY SPOTLIGHT 2 FRONT
//colour, intensity, distance, angle, penumbra (softness of edge), decay
const displayFrontlight2 = new THREE.SpotLight(0xffffff, 37, 20, 0.2, 1);
displayFrontlight2.penumbra = 0.2;
displayFrontlight2.position.set(0.8, 4.2, 1.5); // Set position for the new spotlight
displayFrontlight2.castShadow = true; // Enable shadow casting
displayFrontlight2.shadow.bias = -0.0001; // Adjust shadow bias

// Create a target point for the new spotlight
const Front2TargetPosition = new THREE.Vector3(0.8, 1.6, 3.5);
displayFrontlight2.target.position.copy(Front2TargetPosition); // Set the target position
scene.add(displayFrontlight2.target);
scene.add(displayFrontlight2);
displayFrontlight2.castShadow = true;

//DISPLAY SPOTLIGHT 3 FRONT
//colour, intensity, distance, angle, penumbra (softness of edge), decay
const displayFrontlight3 = new THREE.SpotLight(0xffffff, 37, 20, 0.2, 1);
displayFrontlight3.penumbra = 0.2;
displayFrontlight3.position.set(-1.9, 4.2, 1.5); // Set position for the new spotlight
displayFrontlight3.castShadow = true; // Enable shadow casting
displayFrontlight3.shadow.bias = -0.0001; // Adjust shadow bias

// Create a target point for the new spotlight
const Front3TargetPosition = new THREE.Vector3(-1.9, 1.6, 3.5);
displayFrontlight3.target.position.copy(Front3TargetPosition); // Set the target position
scene.add(displayFrontlight3.target);
scene.add(displayFrontlight3);
displayFrontlight3.castShadow = true;

//DISPLAY SPOTLIGHT 3 TOP
//colour, intensity, distance, angle, penumbra (softness of edge), decay
const displaySpotlight3 = new THREE.SpotLight(0xffd54d, 100, 20, 0.22, 1);
displaySpotlight3.position.set(-1.9, 4, 3.7); // Set position for the new spotlight
displaySpotlight3.castShadow = true; // Enable shadow casting
displaySpotlight3.shadow.bias = -0.0001; // Adjust shadow bias

// Create a target point for the new spotlight
const display3TargetPosition = new THREE.Vector3(-1.9, 0, 3.5);
displaySpotlight3.target.position.copy(display3TargetPosition); // Set the target position
scene.add(displaySpotlight3.target);
scene.add(displaySpotlight3);
displaySpotlight3.castShadow = true;

// Remove any existing shadow properties from lights
//spotLight.castShadow = false; // Disable shadow casting for the spotlight
dirLight.castShadow = true; // Disable shadow casting for directional light

// Function to create a moving spotlight
function createMovingSpotlight(color, intensity, distance, angle, penumbra, position, targetPosition) {
  const movingSpotlight = new THREE.SpotLight(color, intensity, distance, angle, penumbra);
  movingSpotlight.position.copy(position); // Set position for the new spotlight
  movingSpotlight.castShadow = true; // Enable shadow casting
  movingSpotlight.shadow.bias = -0.0001; // Adjust shadow bias

  // Create a target point for the spotlight
  const spotlightTargetPosition = new THREE.Vector3().copy(targetPosition);
  movingSpotlight.target.position.copy(spotlightTargetPosition); // Set the target position
  scene.add(movingSpotlight.target);
  scene.add(movingSpotlight);

  movingSpotlight.userData.ismovingSpotlight = true; 

  // Variable to control movement
  let direction = 1; // 1 means forward, -1 means backward

  // Animation loop for rendering
  function animate() {
    requestAnimationFrame(animate);

    // Move the spotlight forward and backward along the X-axis
    const speed = 0.7; // Speed of movement
    const maxDistance = 4.5; // The max distance the spotlight moves forward
    movingSpotlight.position.x += direction * speed;

    // Change direction if the light reaches the max distance
    if (movingSpotlight.position.x > maxDistance || movingSpotlight.position.x < -maxDistance) {
      direction *= -1; // Reverse direction
    }

    // Update target's X position to match the spotlight's X position
    spotlightTargetPosition.x = movingSpotlight.position.x;
    movingSpotlight.target.position.copy(spotlightTargetPosition); // Apply new target position

    controls.update(); // Update controls
    renderer.render(scene, camera);
  }

  // Start the animation for this spotlight
  animate();

  // Return the spotlight object so it can be accessed outside
  return movingSpotlight;
}

// Example usage of the createMovingSpotlight function
createMovingSpotlight(0x008080, 180, 20, 0.22, 1, new THREE.Vector3(2.5, 3.3, 2.9), new THREE.Vector3(10.5, 0, -2));
createMovingSpotlight(0xe8386d, 300, 20, 0.22, 1.5, new THREE.Vector3(2.5, 3.3, -3.2), new THREE.Vector3(10.5, 0, 1.7)); // another spotlight

// Define a counter and the total number of models
let modelsLoaded = 0;
const totalModels = 11; // Adjust this number to match the total number of models you are loading

const button = document.querySelector("#sound-button");
const img = document.querySelector("#sound-btn-img"); // Updated to target the image
const audio = document.querySelector("audio");

button.addEventListener("click", (event) => {
  if (audio.paused) {
    event.stopPropagation();
    audio.volume = 0.5;
    audio.play();
    img.src = './Assets/mute.png'; // Change to the mute image
      
  } else {
    event.stopPropagation();
    audio.pause();
    img.src = './Assets/unmute.png'; // Change to the volume image
  }
  button.classList.add("fade");
});

// Function to hide progress container
function hideLoadingProgress(event) {
  event.stopPropagation();

  document.getElementById('title').classList.toggle('float-up');
  document.getElementById('title2').classList.toggle('float-up');
  document.getElementById('sub-title').classList.toggle('float-up');
  document.getElementById('start-button').classList.toggle('float-up');

  const navbutton = document.getElementById('nav-button');
  navbutton.style.display = 'block';
  const soundbutton = document.getElementById('sound-button');
  soundbutton.style.display = 'block';
  
  document.getElementById('progress-container').style.display = 'none';

  if (audio.paused) {
    event.stopPropagation();
    audio.volume = 0.01;
    audio.play().then(() => {
      console.log('audio is playing');
    }).catch((error) => {
        console.log('Line 319: Error occurred while trying to play the audio:', error);
    });
    img.src = './Assets/mute.png'; // Change to the mute image
  } 
}

// Function to add models to the scene with specific positions
function addModel(url, position, name) {
  const loader = new GLTFLoader().setPath('public/Assets/');
  loader.load(url, (gltf) => {
    const model = gltf.scene;

    // Enable shadows for the model
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData.isGlasses = (name.includes('Glasses')); // Set userData to indicate glasses part
        child.userData.isGlassesHushPink = (name === 'Glasses Hush Pink');
        child.userData.isGlassesHushWhite = (name === 'Glasses Hush White');
        child.userData.isGlassesHushBlack = (name === 'Glasses Hush Black');
        child.userData.isGlassesHushBrown = (name === 'Glasses Hush Brown');

        child.userData.isGlassesCDNPink = (name === 'Glasses CDN Pink');
        child.userData.isGlassesCDNBlack = (name === 'Glasses CDN Black');
        child.userData.isGlassesCDNBrown = (name === 'Glasses CDN Brown');

        child.userData.isGlassesDBBlue = (name === 'Glasses DB Blue');
        child.userData.isGlassesDBBlack = (name === 'Glasses DB Black');
        child.userData.isGlassesDBBrown = (name === 'Glasses DB Brown');

        child.userData.isGlassesWispyGreen = (name === 'Glasses Wispy Green');
        child.userData.isGlassesWispyYellow = (name === 'Glasses Wispy Yellow');
        child.userData.isGlassesWispyBlack = (name === 'Glasses Wispy Black');

        child.userData.isHouse = (name === 'house');
        child.userData.isDisplay = (name.includes('display'));
        child.userData.isDisplay1 = (name === 'display 1');
        child.userData.isDisplay2 = (name === 'display 2');
        child.userData.isDisplay3 = (name === 'display 3');
        child.userData.isMascots = (name.includes('mascot'));
        child.userData.isBunny = (name === 'mascot bunny');
        child.userData.isCapybara = (name === 'mascot capybara');
        child.userData.isUnicorn = (name === 'mascot unicorn');
        child.userData.isLeftTable = (name.includes('left table'));
        child.userData.isRightTable = (name.includes('right table'));
      }
      if (child.isLight) {
        child.intensity = 0; // remove the random light effect
      }
    });

    model.position.set(position.x, position.y, position.z); // Set model position
    model.name = name; // Set object name for identification
    scene.add(model); // Add model to the scene

    // Increment the modelsLoaded counter
    modelsLoaded++;
    
    // Check if all modeyls are loaded
    if (modelsLoaded === totalModels) {
      const button = document.getElementById('load-start-button');
      const progressText = document.getElementById('progress'); // Get the progress element

      // Change the text when loading is complete
      progressText.textContent = "Load complete!";

      // Show the button
      button.style.display = 'block';

      if (button) {
          button.addEventListener('click', hideLoadingProgress);
      }
    }

    // Hide loading progress container after model is loaded
    //document.getElementById('progress-container').style.display = 'none';
  }, (xhr) => {
    /*console.log(`Loading ${name}: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);*/
    //console.log("hi");
  }, (error) => {
    console.error(`Error loading ${name}: ${error.message}`);
  });
}

// Load 3D models
addModel('house.glb', { x: 0, y: 0, z: 0 }, 'house', 2);
addModel('left table 1.glb', { x: 0, y: 0, z: 0.3 }, 'left table 1', 2);
addModel('left table 2.glb', { x: 0, y: 0, z: 0.3 }, 'left table 2', 2);
addModel('right table 1.glb', { x: 0, y: 0, z: 0.2 }, 'right table 1', 2);
addModel('right table 2.glb', { x: 0, y: 0, z: 0.2 }, 'right table 2', 2);
addModel('glasses - hush brown.glb', { x: 0, y: 0, z: 0.3 }, 'Glasses Hush Brown', 2);
addModel('glasses - hush white.glb', { x: 0, y: 0, z: 0.3 }, 'Glasses Hush White', 2);
addModel('glasses - hush pink.glb', { x: 0, y: 0, z: 0.3 }, 'Glasses Hush Pink', 2);
addModel('glasses - hush black.glb', { x: 0, y: 0, z: 0.3 }, 'Glasses Hush Black', 2);
addModel('glasses - donut bun black.glb', { x: 0, y: 0, z: 0.2 }, 'Glasses DB Black', 2);
addModel('glasses - donut bun brown.glb', { x: 0, y: 0, z: 0.2 }, 'Glasses DB Brown', 2);
addModel('glasses - donut bun blue.glb', { x: 0, y: 0, z: 0.2 }, 'Glasses DB Blue', 2);
addModel('glasses - cdn pink.glb', { x: 0, y: 0, z: 0.3 }, 'Glasses CDN Pink', 2);
addModel('glasses - cdn black.glb', { x: 0, y: 0, z: 0.3 }, 'Glasses CDN Black', 2);
addModel('glasses - cdn brown.glb', { x: 0, y: 0, z: 0.3 }, 'Glasses CDN Brown', 2);
addModel('glasses - wispy green.glb', { x: 0, y: 0, z: 0.2 }, 'Glasses Wispy Green', 2);
addModel('glasses - wispy yellow.glb', { x: 0, y: 0, z: 0.2 }, 'Glasses Wispy Yellow', 2);
addModel('glasses - wispy black.glb', { x: 0, y: 0, z: 0.2 }, 'Glasses Wispy Black', 2);
addModel('unicorn.glb', { x: 0, y: 0, z: 0 }, 'mascot unicorn', 2);
addModel('capybara.glb', { x: 0, y: 0, z: 0 }, 'mascot capybara', 2);
addModel('bunny.glb', { x: 0, y: 0, z: 0 }, 'mascot bunny', 2);
addModel('display 1.glb', { x: 0, y: 0, z: 0 }, 'display 1', 2);
addModel('display 2.glb', { x: 0, y: 0, z: 0 }, 'display 2', 2);
addModel('display 3.glb', { x: 0, y: 0, z: 0 }, 'display 3', 2);

// Add video as texture
const video = document.getElementById('video');
video.preload = "auto"; 
const videoTexture = new THREE.VideoTexture(video);
videoTexture.encoding = THREE.sRGBEncoding;

const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
const videoGeometry = new THREE.PlaneGeometry(5, 2.8); // Adjusted size
const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
// Set the name for the video mesh
videoMesh.name = 'video'; // Assign the name "video"
videoMesh.userData.isVideo = true; // Set userData to indicate this is a video
videoMesh.position.set(1, 1.9, -4); //Position video in exhibition house
videoMesh.renderOrder = 1; // Ensure it's rendered on top
scene.add(videoMesh);

video.addEventListener('canplaythrough', () => {
    video.play();
});

// Environment Map Setup
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader()
  .setPath('textures/') // Adjust path as necessary
  .load('royal_esplanade_1k.hdr', function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap; // Apply environment map to the scene
    texture.dispose();
    pmremGenerator.dispose();
  });

// Raycaster and Mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

raycaster.near = 0.01; // Set to a smaller value for closer objects

// Create popup text element
const popupTextElement = document.createElement('div');
popupTextElement.className = 'popup-text';
popupTextElement.style.display = 'none';
document.body.appendChild(popupTextElement);

// Function to handle mouse move event
let popupTimeout; // Variable to hold timeout ID

//const buttonClick2Sound = new Audio('./Assets/Audio/button click 2.mp3');
//document.getElementById('start-button').addEventListener('click', startExhibition);
document.getElementById('start-button').addEventListener('click', function() {
  // Play the button click sound
  const buttonClick2 = new Audio('./Assets/Audio/button click 2.mp3');
  //buttonClick2.play();
  buttonClick2.play().then(() => {
    console.log('btn click sfx is playing');
  }).catch((error) => {
      console.log('Line 489: Error occurred while trying to play the video:', error);
  });

  // Start the exhibition logic
  startExhibition();
});

//nav popups
const navpopupbg = document.getElementById('nav-popup-bg');
const navpopup = document.getElementById('navigate-popup');
const nav1 = document.getElementById('nav-1');
const nav2 = document.getElementById('nav-2');
const nav3 = document.getElementById('nav-3');
const nav4 = document.getElementById('nav-4');
const navclosebtn = document.getElementById('nav-close-button');

// Function to play the click sound and stop event propagation
function playClickSound(event) {
  event.stopPropagation(); // Prevent event bubbling
  const clickAudio = new Audio('./Assets/Audio/mouse click.mp3');
  //clickAudio.play();
  clickAudio.play().then(() => {
    console.log('click sfx is playing');
  }).catch((error) => {
      console.log('Line 513: Error occurred while trying to play the click sfx:', error);
  });
}

// Add event listener to elements with class "left-arrows"
document.querySelectorAll('.left-arrows').forEach(function(element) {
  element.addEventListener('click', playClickSound);
});

// Add event listener to elements with class "right-arrows"
document.querySelectorAll('.right-arrows').forEach(function(element) {
  element.addEventListener('click', playClickSound);
});

document.getElementById('nav-close-button').addEventListener('click', playClickSound);

document.querySelectorAll('.close-button').forEach(function(element) {
  element.addEventListener('click', playClickSound);
});

const whooshAudio = new Audio('./Assets/Audio/whoosh.mp3');

function startExhibition(event) {

  exploreButtonClicked = true;

  document.getElementById('landing-page').style.display = 'none';
  
  // Disable controls during animation
  controls.enabled = false;
      
  // Define the target position for the camera
  const targetPosition = new THREE.Vector3(14.5, 2.6, 0); // Set this to your desired coordinates
  const targetLookAt = new THREE.Vector3(0, 2.6, 0); // Set this to your desired target for the lookAt

  // Use GSAP to animate the camera position
  gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1, // Duration of the animation in seconds
      onUpdate: function () {
          camera.lookAt(targetLookAt); // Keep updating the camera's lookAt during animation
          camera.updateMatrix(); // Update the camera's matrix for proper rendering
      },
      onComplete: function () {
          // Enable controls after animation is complete
          controls.enabled = true;
      }
  });

  // Smoothly animate the controls target as well
  gsap.to(controls.target, {
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
      duration: 1, // Match duration with camera position animation
      onUpdate: function () {
          controls.update(); // Ensure the controls are updated as the target changes
      }
  });

  /* SHOW NAV BOX */
  navpopupbg.style.display = 'block';
  navpopup.style.display = 'block';
  showNav1(event);
}

function showNav1(event) {
  if (event) {
    event.stopPropagation();
  }

  infoWindowOpen = true; // Set flag when an info window is open

  nav1.style.display = 'flex';
  nav2.style.display = 'none';
  nav3.style.display = 'none';
  nav4.style.display = 'none';

  document.getElementById('right-arrow-1').addEventListener('click', showNav2);
  navclosebtn.addEventListener('click', closeNavPopup);
}

function showNav2(event) {
  // Prevent the event from propagating to other elements
  event.stopPropagation();

  infoWindowOpen = true; 

  nav1.style.display = 'none';
  nav2.style.display = 'flex';
  nav3.style.display = 'none';
  nav4.style.display = 'none';

  document.getElementById('left-arrow-2').addEventListener('click', showNav1);
  document.getElementById('right-arrow-2').addEventListener('click', showNav3);
  navclosebtn.addEventListener('click', closeNavPopup);
}

function showNav3(event) {
  // Prevent the event from propagating to other elements
  event.stopPropagation();

  infoWindowOpen = true; 

  nav1.style.display = 'none';
  nav2.style.display = 'none';
  nav3.style.display = 'flex';
  nav4.style.display = 'none';

  document.getElementById('left-arrow-3').addEventListener('click', showNav2);
  document.getElementById('right-arrow-3').addEventListener('click', showNav4);
  navclosebtn.addEventListener('click', closeNavPopup);
}

function showNav4(event) {
  // Prevent the event from propagating to other elements
  event.stopPropagation();

  infoWindowOpen = true; 

  nav1.style.display = 'none';
  nav2.style.display = 'none';
  nav3.style.display = 'none';
  nav4.style.display = 'flex';

  document.getElementById('left-arrow-4').addEventListener('click', showNav3);
  navclosebtn.addEventListener('click', closeNavPopup);
}

function closeNavPopup(event) {
  event.stopPropagation();

  navpopupbg.style.display = 'none';
  navpopup.style.display = 'none';
  nav1.style.display = 'none';
  nav2.style.display = 'none';
  nav3.style.display = 'none';
  nav4.style.display = 'none';

  infoWindowOpen = false; 
}

const navbutton = document.getElementById('nav-button');
navbutton.addEventListener("click", (event) => {
  event.stopPropagation();
  navpopupbg.style.display = 'block';
  navpopup.style.display = 'block';
  showNav1();
});


let isDragging = false;
let lastMousePosition = new THREE.Vector2();
let clickTimeout;
let exploreButtonClicked = false;
let infoWindowOpen = false; // Flag to track if an info window is open
let navWindowOpen = false; // Flag to track if an info window is open


// Function to create video mesh
function createHoverVideoMesh(videoSrc, positionArray, name, userDataKey) {
  const hoverVideo = document.createElement('video');
  hoverVideo.src = videoSrc;
  hoverVideo.muted = false;
  hoverVideo.loop = false;
  hoverVideo.autoplay = false; 
  hoverVideo.playsInline = true;

  const hoverVideoTexture = new THREE.VideoTexture(hoverVideo);
  hoverVideoTexture.minFilter = THREE.LinearFilter;
  hoverVideoTexture.magFilter = THREE.LinearFilter;
  hoverVideoTexture.format = THREE.RGBFormat;

  const hoverVideoMaterial = new THREE.MeshBasicMaterial({ 
      map: hoverVideoTexture, 
      side: THREE.DoubleSide,
      transparent: true,     
      opacity: 1
  });
  const hoverVideoGeometry = new THREE.PlaneGeometry(1.2, 2.2);

  const hoverVideoMesh = new THREE.Mesh(hoverVideoGeometry, hoverVideoMaterial);
  hoverVideoMesh.position.set(...positionArray);
  hoverVideoMesh.renderOrder = 1;
  hoverVideoMesh.name = name;
  hoverVideoMesh.userData[userDataKey] = true;
  hoverVideoMesh.visible = false;

  // Add mouseout event listener to pause and reset the video
  hoverVideoMesh.onMouseOut = () => {
    hoverVideo.pause();
    hoverVideo.currentTime = 0;
    hoverVideoMesh.visible = false;
    hoverVideoMesh.material.opacity = 0;
  };

  // Add the mesh to the scene
  scene.add(hoverVideoMesh);

  // Return both the video element and the mesh
  return { video: hoverVideo, mesh: hoverVideoMesh };
}

// Create and store the meshes and videos in an object
const hoverVideos = {
  display1: createHoverVideoMesh('./Assets/Videos/Display 1.mp4', [3.52, 1.3, 3.51], 'hoverVideo1', 'isDisplay1'),
  display2: createHoverVideoMesh('./Assets/Videos/Display 2.mp4', [0.8, 1.3, 3.5], 'hoverVideo2', 'isDisplay2'),
  display3: createHoverVideoMesh('./Assets/Videos/Display 3.mp4', [-1.9, 1.3, 3.45], 'hoverVideo3', 'isDisplay3'),
};

function createHoverImageMesh(imageSrc, positionArray, name, userDataKey) {
  // Load the texture from the image
  const hoverImageTexture = new THREE.TextureLoader().load(imageSrc, function (texture) {
    console.log("Image loaded successfully:", imageSrc);
  });

  // Create the material for the image with transparency support
  const hoverImageMaterial = new THREE.MeshBasicMaterial({
    map: hoverImageTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1 // Make it fully opaque initially
  });

  // Create a plane geometry for displaying the image (adjust size if needed)
  const hoverImageGeometry = new THREE.PlaneGeometry(3, 2.2); // Adjust size to match your image aspect ratio

  // Create the mesh using the geometry and material
  const hoverImageMesh = new THREE.Mesh(hoverImageGeometry, hoverImageMaterial);
  
  // Set the position of the mesh in the scene
  hoverImageMesh.position.set(...positionArray);
  hoverImageMesh.renderOrder = 1; // Make sure it's rendered on top of other objects
  hoverImageMesh.name = name;
  hoverImageMesh.userData[userDataKey] = true; // Set the userData flag
  hoverImageMesh.userData.isHoverMessage = true; 
  hoverImageMesh.visible = false; // Initially hidden

  //hoverImageMesh.rotation.y = Math.PI / 2;

  // Add mouseout event listener to hide the image when the mouse moves out
  hoverImageMesh.onMouseOut = () => {
    hoverImageMesh.visible = false;
    hoverImageMesh.material.opacity = 0; // Set opacity to 0 (invisible)
  };

  // Add the mesh to the scene
  scene.add(hoverImageMesh);

  // Return the mesh (no need for a video element in this case)
  return hoverImageMesh;
}

const promptMessageMesh = createHoverImageMesh(
  './Assets/Images/prompt message.png', // Image source
  [-0.6, 1.5, -2.9], // Position in the scene (x, y, z)
  'promptMessage', // Name for the mesh
  'isVideo' // userData key to identify the object
);

const unicornMessageMesh = createHoverImageMesh(
  './Assets/Images/unicorn message.png', // Image source
  [-3.5, 2.5, 0.3], // Position in the scene (x, y, z)
  'unicornMessage', // Name for the mesh
  'isUnicorn' // userData key to identify the object
);

const capybaraMessageMesh1 = createHoverImageMesh(
  './Assets/Images/heart.png',
  [-3.5, 1, 0.9],    // Position in the scene
  'capybaraMessage1',    // Name for the mesh
  'isCapybara',         // userData key to identify the object
);

const capybaraMessageMesh2 = createHoverImageMesh(
  './Assets/Images/heart.png',
  [-3.5, 1.1, 1.15],    // Position in the scene
  'capybaraMessage2',    // Name for the mesh
  'isCapybara',         // userData key to identify the object
);

const capybaraMessageMesh3 = createHoverImageMesh(
  './Assets/Images/heart.png',
  [-3.5, 0.9, 1.35],    // Position in the scene
  'capybaraMessage2',    // Name for the mesh
  'isCapybara',         // userData key to identify the object
);

const bunnyMessageMesh1 = createHoverImageMesh(
  './Assets/Images/bunny z1.png',
  [-3.3, 1.6, 1.66],    // Position in the scene
  'bunnyMessage1',    // Name for the mesh
  'isBunny',         // userData key to identify the object
);

const bunnyMessageMesh2 = createHoverImageMesh(
  './Assets/Images/bunny z2.png',
  [-3.3, 1.7, 1.68],    // Position in the scene
  'bunnyMessage2',    // Name for the mesh
  'isBunny',         // userData key to identify the object
);

const bunnyMessageMesh3 = createHoverImageMesh(
  './Assets/Images/bunny z3.png',
  [-3.3, 1.5, 1.7],    // Position in the scene
  'bunnyMessage2',    // Name for the mesh
  'isBunny',         // userData key to identify the object
);

capybaraMessageMesh1.userData.originalY = capybaraMessageMesh1.position.y; 
capybaraMessageMesh2.userData.originalY = capybaraMessageMesh2.position.y; 
capybaraMessageMesh3.userData.originalY = capybaraMessageMesh3.position.y; 
bunnyMessageMesh1.userData.originalY = bunnyMessageMesh1.position.y; 
bunnyMessageMesh2.userData.originalY = bunnyMessageMesh2.position.y; 
bunnyMessageMesh3.userData.originalY = bunnyMessageMesh3.position.y; 

let isVideoClicked = false;

// Function to show the prompt message mesh
function showPromptMessage() {
    promptMessageMesh.visible = true;
    promptMessageMesh.scale.set(0.7, 0.7, 0.7);
}

// Function to hide the prompt message mesh
function hidePromptMessage() {
    promptMessageMesh.visible = false;
}

// Function to make the image float upwards and fade in on hover
function floatUpOnHover(mesh) {
  // Set different durations for capybaraMessageMesh1 and capybaraMessageMesh2
  let duration;
  if (mesh.name === 'capybaraMessageMesh1') {
    duration = 0.6; // Set duration for capybaraMessageMesh1
  } else if (mesh.name === 'capybaraMessageMesh2') {
    duration = 0.7; // Set duration for capybaraMessageMesh2
  } else if (mesh.name === 'capybaraMessageMesh3') {
    duration = 0.4; // Set duration for capybaraMessageMesh2
  } else if (mesh.name === 'bunnyMessageMesh1') {
    duration = 1; 
  } else if (mesh.name === 'bunnyMessageMesh2') {
    duration = 1.3; 
  } else if (mesh.name === 'bunnyMessageMesh3') {
    duration = 1.5; 
  } else {
    duration = 0.5; // Default duration for other meshes
  }

  // Make the image visible and animate upwards
  gsap.to(mesh.position, { y: mesh.userData.originalY + 0.6, duration: duration }); // Float up
  gsap.to(mesh.material, { opacity: 1, duration: duration }); // Fade in
  mesh.rotation.y = Math.PI / 2;
  mesh.visible = true; // Ensure it's visible

  // Automatically fade out after 0.7 seconds
  gsap.delayedCall(0.7, () => {
    floatDownOffHover(mesh); // Call the fade-out function after 5 seconds
  });
}

// Function to hide the image and return it to the original position on mouse out
function floatDownOffHover(mesh) {
  gsap.to(mesh.material, { opacity: 0, duration: 0.4, onComplete: () => { 
    mesh.visible = false; 
    mesh.rotation.y = Math.PI / 2;
    mesh.position.y = mesh.userData.originalY; //reset y position
  }});
}


// Function to play sound and reset it on mouse out
function createSfxOnMouseOut(soundSrc) {
  const sfx = new Audio(soundSrc);
  sfx.loop = false; // Not looping the sound

  return {
    sfx,
    play: function () {
      sfx.currentTime = 0; // Start from the beginning
      sfx.play();
    },
    stop: function () {
      sfx.pause();
      sfx.currentTime = 0; // Reset to the beginning
    }
  };
}

const bunnySfx = createSfxOnMouseOut('./Assets/Audio/bunny.mp3');
const capybaraSfx = createSfxOnMouseOut('./Assets/Audio/capybara.mp3');
const unicornSfx = createSfxOnMouseOut('./Assets/Audio/unicorn.mp3');

// Function to handle mouse down event
function onMouseDown(event) {
  lastMousePosition.x = event.clientX;
  lastMousePosition.y = event.clientY;
  isDragging = false;
}

function onMouseMove(event, movingSpotlight) {
  // Skip if an info window is open
  if (infoWindowOpen) {
    return;
  }

  if (navWindowOpen) {
    return;
  }
  
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update isDragging flag if mouse moves significantly
  if (Math.abs(event.clientX - lastMousePosition.x) > 5 ||
      Math.abs(event.clientY - lastMousePosition.y) > 5) {
    isDragging = true;
  }

  raycaster.setFromCamera(mouse, camera);

  // Check intersections with all objects in the scene
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const intersect = intersects.find((intersect) => intersect.object !== groundMesh && intersect.object !== movingSpotlight);
    //const intersect = intersects[0]; // Directly use the first intersected object for now.

    if (intersect) {
      const object = intersect.object;

      let objectName = object.name || "Unknown Object";
      
      if (object.userData.isVideo) {
        // Unmute and play the video audio
        video.currentTime = 0; // Restart the video
        video.muted = false; // Unmute the video
        video.controls = true; // Hide controls
        video.play(); 
      } else {
        // Stop and mute the video audio when not hovering
        video.muted = true; // Mute the video when not hovering
        video.controls = false; // Hide controls
      }

      if (object.userData.isDisplay2) {
        objectName = "Displays";

        // Show the video mesh and play the video for display 2
        const videoData = hoverVideos.display2;

        if (!videoData.mesh.visible) {
            videoData.mesh.visible = true;
            videoData.mesh.material.opacity = 1; 
            videoData.video.play(); // Play the video for display 2
        }
      } else if (object.userData.isDisplay3) {
        objectName = "Displays";

        // Show the video mesh and play the video for display 3
        const videoData = hoverVideos.display3;

        if (!videoData.mesh.visible) {
            videoData.mesh.visible = true;
            videoData.mesh.material.opacity = 1; 
            videoData.video.play(); // Play the video for display 3
        }
      } else if (object.userData.isDisplay1) {
        objectName = "Displays";

        // Show the video mesh and play the video for display 1
        const videoData = hoverVideos.display1;

        if (!videoData.mesh.visible) {
            videoData.mesh.visible = true;
            videoData.mesh.material.opacity = 1; 
            videoData.video.play(); // Play the video for display 1
        }
      } else {
        // Hide videos and reset when not hovering over display 2 or 3
        if (hoverVideos.display1.mesh.visible) {
          hoverVideos.display1.mesh.onMouseOut(); // Use the mouse out function
        }
        if (hoverVideos.display2.mesh.visible) {
          hoverVideos.display2.mesh.onMouseOut(); // Use the mouse out function
        }
        if (hoverVideos.display3.mesh.visible) {
          hoverVideos.display3.mesh.onMouseOut();// Use the mouse out function
        }
      }

      // Handle bunny sound
      if (object.userData.isBunny) {
        bunnySfx.play();
        if ((!bunnyMessageMesh1.visible) && (!bunnyMessageMesh2.visible) && (!bunnyMessageMesh3.visible)) {
          floatUpOnHover(bunnyMessageMesh1); // Float up on hover
          floatUpOnHover(bunnyMessageMesh2);
          floatUpOnHover(bunnyMessageMesh3);
        }
      } else {
        if ((bunnyMessageMesh1.visible) && (bunnyMessageMesh2.visible) && (bunnyMessageMesh3.visible)) {
          floatDownOffHover(bunnyMessageMesh1); // Float down on mouse out
          floatDownOffHover(bunnyMessageMesh2);
          floatDownOffHover(bunnyMessageMesh3);
        }
      }

      // Handle capybara sound
      if (object.userData.isCapybara) {
        capybaraSfx.play();
        if ((!capybaraMessageMesh1.visible) && (!capybaraMessageMesh2.visible) && (!capybaraMessageMesh3.visible)) {
          floatUpOnHover(capybaraMessageMesh1); // Float up on hover
          floatUpOnHover(capybaraMessageMesh2);
          floatUpOnHover(capybaraMessageMesh3);
        }
      } else {
        if ((capybaraMessageMesh1.visible) && (capybaraMessageMesh2.visible) && (capybaraMessageMesh3.visible)) {
          floatDownOffHover(capybaraMessageMesh1); // Float down on mouse out
          floatDownOffHover(capybaraMessageMesh2);
          floatDownOffHover(capybaraMessageMesh3);
        }
      }

      // Handle unicorn sound
      if (object.userData.isUnicorn) {
        unicornSfx.play();
        if (!unicornMessageMesh.visible) {
          unicornMessageMesh.rotation.y = Math.PI / 2;
          unicornMessageMesh.visible = true; // Make the image visible
          unicornMessageMesh.material.opacity = 1; // Fully opaque
        }
      } else {
        if (unicornMessageMesh.visible) {
          unicornMessageMesh.rotation.y = Math.PI / 2;
          unicornMessageMesh.visible = false;
          unicornMessageMesh.material.opacity = 0; // Invisible
        }
      }

      if (object.userData.isGlassesHushPink) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesHushWhite) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesHushBlack) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesHushBrown) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesCDNPink) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesCDNBlack) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesCDNBrown) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesDBBlue) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesDBBlack) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesDBBrown) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesWispyGreen) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesWispyYellow) {
        objectName = "Click me!";
      } 
      else if (object.userData.isGlassesWispyBlack) {
        objectName = "Click me!";
      } 
      else if (object.userData.isDisplay) {
        objectName = "Displays";
      } 
      else if (object.userData.isMascots) {
        objectName = "Mascots";
      } 
      else if ((object.userData.isLeftTable) || (object.userData.isRightTable)) {
        objectName = "Glasses";
      } 
      else if (objectName === 'Sphere') {
        objectName = "I'm round";
      }
      else if (object.userData.isHouse) {
        objectName = "Let's explore!";
      } 

      const objectPosition = new THREE.Vector3();
      object.getWorldPosition(objectPosition);
      const screenPosition = objectPosition.clone().project(camera);

      // Convert 3D position to 2D screen coordinates
      const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
      const y = (screenPosition.y * -0.5 + 0.5) * window.innerHeight;

      // Position the popup text
      popupTextElement.textContent = objectName;
      popupTextElement.style.left = `${x}px`;
      popupTextElement.style.top = `${y}px`;
      popupTextElement.style.display = 'block';
      popupTextElement.style.fontSize = '1.1rem'; 
      popupTextElement.style.fontFamily = '"SUSE", sans-serif'; 
      popupTextElement.style.fontWeight = '600'; 
      popupTextElement.style.padding = '9px 14px'; 
      popupTextElement.style.borderRadius = '20px';
      popupTextElement.style.color = '#535eb0'; 
      
      // Show model in info window if it's glasses
      if (object.userData.isGlassesHushPink) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesHushWhite) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesHushBlack) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesHushBrown) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesCDNPink) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesCDNBlack) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesCDNBrown) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesDBBlue) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesDBBlack) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesDBBrown) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesWispyYellow) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesWispyGreen) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isGlassesWispyBlack) {
        popupTextElement.style.display = 'block';
      } else if ((object.userData.isLeftTable) || (object.userData.isRightTable)) {
        popupTextElement.style.display = 'block';
      } else if (object.userData.isVideo) {
        popupTextElement.style.display = 'none';
      } else if (object.userData.isHoverMessage) {
        popupTextElement.style.display = 'none';
      } else if (object.userData.isMascots) {
        popupTextElement.style.display = 'none';
      } else if (object.userData.ismovingSpotlight) {
        popupTextElement.style.display = 'none';
      } 
    } else {
      popupTextElement.style.display = 'none';

      // Mouse out logic
      if (hoverVideos.display2.mesh.visible) {
        hoverVideos.display2.mesh.onMouseOut();
      }
      if (hoverVideos.display3.mesh.visible) {
        hoverVideos.display3.mesh.onMouseOut();
      }
      if (hoverVideos.display1.mesh.visible) {
        hoverVideos.display1.mesh.onMouseOut();
      }
    }
  } else {
    popupTextElement.style.display = 'none';
    if (hoverVideos.display2.mesh.visible) {
      hoverVideos.display2.mesh.onMouseOut();
    }
    if (hoverVideos.display3.mesh.visible) {
      hoverVideos.display3.mesh.onMouseOut();
    }
    if (hoverVideos.display1.mesh.visible) {
      hoverVideos.display1.mesh.onMouseOut();
    }
  }
}

// Create an Audio object for the click sound
const buttonClickSound = new Audio('./Assets/Audio/button click.mp3');

// Function to handle mouse click event
function onMouseClick(event, movingSpotlight) {

  clearTimeout(clickTimeout);

  clickTimeout = setTimeout(() => {

    if (isDragging) {
      // Reset dragging flag
      isDragging = false;
      return; // Ignore the click if dragging
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check intersections with all objects in the scene
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const intersect = intersects.find((intersect) => intersect.object !== groundMesh && intersect.object !== movingSpotlight);

      if (intersect) {
        const object = intersect.object;

        if (object.userData.isGlassesHushPink) {
          //buttonClickSound.play();
          buttonClickSound.play().then(() => {
            console.log('btnclicksound is playing');
          }).catch((error) => {
              console.log('Line 1254: Error occurred while trying to play the btnclicksound:', error);
          });
          // Open info window and show model when glasses are clicked
          document.getElementById('hush-pink-info-window').style.display = 'flex';
          infoWindowOpen = true; // Set flag when an info window is open
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesHushWhite) {
          buttonClickSound.play();
          document.getElementById('hush-white-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesHushBlack) {
          buttonClickSound.play();
          document.getElementById('hush-black-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesHushBrown) {
          buttonClickSound.play();
          document.getElementById('hush-brown-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesCDNPink) {
          buttonClickSound.play();
          document.getElementById('cdn-pink-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesCDNBlack) {
          buttonClickSound.play();
          document.getElementById('cdn-black-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesCDNBrown) {
          buttonClickSound.play();
          document.getElementById('cdn-brown-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesWispyYellow) {
          buttonClickSound.play();
          document.getElementById('wispy-yellow-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesWispyGreen) {
          buttonClickSound.play();
          document.getElementById('wispy-green-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesWispyBlack) {
          buttonClickSound.play();
          document.getElementById('wispy-black-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesDBBlue) {
          buttonClickSound.play();
          document.getElementById('db-blue-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesDBBlack) {
          buttonClickSound.play();
          document.getElementById('db-black-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if (object.userData.isGlassesDBBrown) {
          buttonClickSound.play();
          document.getElementById('db-brown-info-window').style.display = 'flex';
          infoWindowOpen = true; 
          const closeButtons = document.querySelectorAll('.close-button');
          closeButtons.forEach((button) => {
            button.addEventListener('click', onCloseButtonClick);
          });
          return;

        } else if ((object.userData.isHouse) && (!infoWindowOpen) && (exploreButtonClicked)){
          hidePromptMessage();

          // Disable controls during animation
          controls.enabled = false;
              
          // Define the target position for the camera
          const targetPosition = new THREE.Vector3(5.7, 1, 0); // Set this to your desired coordinates
          const targetLookAt = new THREE.Vector3(-2, 1, 0); // Set this to your desired target for the lookAt

          whooshAudio.play();

          // Use GSAP to animate the camera position
          gsap.to(camera.position, {
              x: targetPosition.x,
              y: targetPosition.y,
              z: targetPosition.z,
              duration: 1, // Duration of the animation in seconds
              onUpdate: function () {
                  camera.lookAt(targetLookAt); // Keep updating the camera's lookAt during animation
                  camera.updateMatrix(); // Update the camera's matrix for proper rendering
              },
              onComplete: function () {
                  // Enable controls after animation is complete
                  controls.enabled = true;
              }
          });

          // Smoothly animate the controls target as well
          gsap.to(controls.target, {
              x: targetLookAt.x,
              y: targetLookAt.y,
              z: targetLookAt.z,
              duration: 1, // Match duration with camera position animation
              onUpdate: function () {
                  controls.update(); // Ensure the controls are updated as the target changes
              }
          });

          return;

          // Update the controls and ensure they are not reset after zoom
        } else if ((object.userData.isDisplay) && (!infoWindowOpen)) {
          //console.log("display clicked!");
          hidePromptMessage();
      
          // Disable controls during animation
          controls.enabled = false;
      
          // Define the target position for the camera
          const targetPosition = new THREE.Vector3(0.8, 0.4, -0.7); // Set this to your desired coordinates
          const targetLookAt = new THREE.Vector3(0.8, 1.5, 3.2); // Set this to your desired target for the lookAt
      
          // Use GSAP to animate the camera position
          gsap.to(camera.position, {
              x: targetPosition.x,
              y: targetPosition.y,
              z: targetPosition.z,
              duration: 1, // Duration of the animation in seconds
              onUpdate: function () {
                  camera.lookAt(targetLookAt); // Keep updating the camera's lookAt during animation
                  camera.updateMatrix(); // Update the camera's matrix for proper rendering
              },
              onComplete: function () {
                  // Enable controls after animation is complete
                  controls.enabled = true;
              }
          });
      
          // Smoothly animate the controls target as well
          gsap.to(controls.target, {
              x: targetLookAt.x,
              y: targetLookAt.y,
              z: targetLookAt.z,
              duration: 1, // Match duration with camera position animation
              onUpdate: function () {
                  controls.update(); // Ensure the controls are updated as the target changes
              }
          });
        } else if ((object.userData.isMascots) && (!infoWindowOpen)) {
          //console.log("mascots clicked!");
          hidePromptMessage();
      
          // Disable controls during animation
          controls.enabled = false;
      
          // Define the target position for the camera
          const targetPosition = new THREE.Vector3(1, 1.7, 0.2); // Set this to your desired coordinates
          const targetLookAt = new THREE.Vector3(-1, 1.7, 0.2); // Set this to your desired target for the lookAt
      
          // Use GSAP to animate the camera position
          gsap.to(camera.position, {
              x: targetPosition.x,
              y: targetPosition.y,
              z: targetPosition.z,
              duration: 1, // Duration of the animation in seconds
              onUpdate: function () {
                  camera.lookAt(targetLookAt); // Keep updating the camera's lookAt during animation
                  camera.updateMatrix(); // Update the camera's matrix for proper rendering
              },
              onComplete: function () {
                  // Enable controls after animation is complete
                  controls.enabled = true;
              }
          });
      
          // Smoothly animate the controls target as well
          gsap.to(controls.target, {
              x: targetLookAt.x,
              y: targetLookAt.y,
              z: targetLookAt.z,
              duration: 1, // Match duration with camera position animation
              onUpdate: function () {
                  controls.update(); // Ensure the controls are updated as the target changes
              }
          });
        } else if ((object.userData.isVideo) && (!infoWindowOpen)) {
          //console.log("video clicked!");
          isVideoClicked = true;
      
          // Disable controls during animation
          controls.enabled = false;
      
          // Define the target position for the camera
          const targetPosition = new THREE.Vector3(1, 0.4, 0); // Set this to your desired coordinates
          const targetLookAt = new THREE.Vector3(1, 1.9, -4); // Set this to your desired target for the lookAt
      
          // Use GSAP to animate the camera position
          gsap.to(camera.position, {
              x: targetPosition.x,
              y: targetPosition.y,
              z: targetPosition.z,
              duration: 1, // Duration of the animation in seconds
              onUpdate: function () {
                  camera.lookAt(targetLookAt); // Keep updating the camera's lookAt during animation
                  camera.updateMatrix(); // Update the camera's matrix for proper rendering
              },
              onComplete: function () {
                  // Enable controls after animation is complete
                  controls.enabled = true;
              }
          });
      
          // Smoothly animate the controls target as well
          gsap.to(controls.target, {
              x: targetLookAt.x,
              y: targetLookAt.y,
              z: targetLookAt.z,
              duration: 1, // Match duration with camera position animation
              onUpdate: function () {
                  controls.update(); // Ensure the controls are updated as the target changes
              }
          });

          showPromptMessage();
          unicornSfx.play();
        } else if ((object.userData.isLeftTable) && (!infoWindowOpen)) {
          //console.log("left table clicked!");
          hidePromptMessage();

          // Disable controls during animation
          controls.enabled = false;
      
          // Define the target position for the camera
          const targetPosition = new THREE.Vector3(1.25, 0.8, -1.7); // Set this to your desired coordinates
          const targetLookAt = new THREE.Vector3(1.25, 1.1, 1.3); // Set this to your desired target for the lookAt
      
          // Use GSAP to animate the camera position
          gsap.to(camera.position, {
              x: targetPosition.x,
              y: targetPosition.y,
              z: targetPosition.z,
              duration: 1, // Duration of the animation in seconds
              onUpdate: function () {
                  camera.lookAt(targetLookAt); // Keep updating the camera's lookAt during animation
                  camera.updateMatrix(); // Update the camera's matrix for proper rendering
              },
              onComplete: function () {
                  // Enable controls after animation is complete
                  controls.enabled = true;
              }
          });
      
          // Smoothly animate the controls target as well
          gsap.to(controls.target, {
              x: targetLookAt.x,
              y: targetLookAt.y,
              z: targetLookAt.z,
              duration: 1, // Match duration with camera position animation
              onUpdate: function () {
                  controls.update(); // Ensure the controls are updated as the target changes
              }
          });
        } else if ((object.userData.isRightTable) && (!infoWindowOpen)) {
          //console.log("right table clicked!");
          hidePromptMessage();
      
          // Disable controls during animation
          controls.enabled = false;
      
          // Define the target position for the camera
          const targetPosition = new THREE.Vector3(1.18, 0.6, 1.8); // Set this to your desired coordinates
          const targetLookAt = new THREE.Vector3(1.18, 1.1, -3.8); // Set this to your desired target for the lookAt
      
          // Use GSAP to animate the camera position
          gsap.to(camera.position, {
              x: targetPosition.x,
              y: targetPosition.y,
              z: targetPosition.z,
              duration: 1, // Duration of the animation in seconds
              onUpdate: function () {
                  camera.lookAt(targetLookAt); // Keep updating the camera's lookAt during animation
                  camera.updateMatrix(); // Update the camera's matrix for proper rendering
              },
              onComplete: function () {
                  // Enable controls after animation is complete
                  controls.enabled = true;
              }
          });
      
          // Smoothly animate the controls target as well
          gsap.to(controls.target, {
              x: targetLookAt.x,
              y: targetLookAt.y,
              z: targetLookAt.z,
              duration: 1, // Match duration with camera position animation
              onUpdate: function () {
                  controls.update(); // Ensure the controls are updated as the target changes
              }
          });
        }
      }
    }
  },200)
}


// Event listeners for mouse move and click events
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onMouseClick);

//Function to handle close button click
function onCloseButtonClick(event) {
  // Prevent the event from propagating to other elements
  event.stopPropagation();

  if(infoWindowOpen){
    document.getElementById('hush-pink-info-window').style.display = 'none';
    document.getElementById('hush-white-info-window').style.display = 'none';
    document.getElementById('hush-black-info-window').style.display = 'none';
    document.getElementById('hush-brown-info-window').style.display = 'none';
    document.getElementById('cdn-pink-info-window').style.display = 'none';
    document.getElementById('cdn-black-info-window').style.display = 'none';
    document.getElementById('cdn-brown-info-window').style.display = 'none';
    document.getElementById('wispy-green-info-window').style.display = 'none';
    document.getElementById('wispy-yellow-info-window').style.display = 'none';
    document.getElementById('wispy-black-info-window').style.display = 'none';
    document.getElementById('db-blue-info-window').style.display = 'none';
    document.getElementById('db-black-info-window').style.display = 'none';
    document.getElementById('db-brown-info-window').style.display = 'none';
  }
  infoWindowOpen = false;
  return;
}

//Change Big Product Image
//Display big product images in left-content div
// Hush Pink
function displayHushPink(selectedIndex) {
  const bigElements = ['big-hush-pink-1', 'big-hush-pink-2', 'big-hush-pink-3', 'big-hush-pink-4'];
  const smallElements = ['hush-pink-1', 'hush-pink-2', 'hush-pink-3', 'hush-pink-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

function displayHushWhite(selectedIndex) {
  const bigElements = ['big-hush-white-1', 'big-hush-white-2', 'big-hush-white-3', 'big-hush-white-4'];
  const smallElements = ['hush-white-1', 'hush-white-2', 'hush-white-3', 'hush-white-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

function displayHushBlack(selectedIndex) {
  const bigElements = ['big-hush-black-1', 'big-hush-black-2', 'big-hush-black-3', 'big-hush-black-4'];
  const smallElements = ['hush-black-1', 'hush-black-2', 'hush-black-3', 'hush-black-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

function displayHushBrown(selectedIndex) {
  const bigElements = ['big-hush-brown-1', 'big-hush-brown-2', 'big-hush-brown-3', 'big-hush-brown-4'];
  const smallElements = ['hush-brown-1', 'hush-brown-2', 'hush-brown-3', 'hush-brown-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

// CDN Pink
function displayCDNPink(selectedIndex) {
  const bigElements = ['big-cdn-pink-1', 'big-cdn-pink-2', 'big-cdn-pink-3', 'big-cdn-pink-4'];
  const smallElements = ['cdn-pink-1', 'cdn-pink-2', 'cdn-pink-3', 'cdn-pink-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

function displayCDNBlack(selectedIndex) {
  const bigElements = ['big-cdn-black-1', 'big-cdn-black-2', 'big-cdn-black-3', 'big-cdn-black-4'];
  const smallElements = ['cdn-black-1', 'cdn-black-2', 'cdn-black-3', 'cdn-black-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

function displayCDNBrown(selectedIndex) {
  const bigElements = ['big-cdn-brown-1', 'big-cdn-brown-2', 'big-cdn-brown-3', 'big-cdn-brown-4'];
  const smallElements = ['cdn-brown-1', 'cdn-brown-2', 'cdn-brown-3', 'cdn-brown-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

//Wispy
function displayWispyYellow(selectedIndex) {
  const bigElements = ['big-wispy-yellow-1', 'big-wispy-yellow-2', 'big-wispy-yellow-3', 'big-wispy-yellow-4'];
  const smallElements = ['wispy-yellow-1', 'wispy-yellow-2', 'wispy-yellow-3', 'wispy-yellow-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

function displayWispyGreen(selectedIndex) {
  const bigElements = ['big-wispy-green-1', 'big-wispy-green-2', 'big-wispy-green-3', 'big-wispy-green-4'];
  const smallElements = ['wispy-green-1', 'wispy-green-2', 'wispy-green-3', 'wispy-green-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

function displayWispyBlack(selectedIndex) {
  const bigElements = ['big-wispy-black-1', 'big-wispy-black-2', 'big-wispy-black-3', 'big-wispy-black-4'];
  const smallElements = ['wispy-black-1', 'wispy-black-2', 'wispy-black-3', 'wispy-black-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

// DB Blue
function displayDBBlue(selectedIndex) {
  const bigElements = ['big-db-blue-1', 'big-db-blue-2', 'big-db-blue-3', 'big-db-blue-4'];
  const smallElements = ['db-blue-1', 'db-blue-2', 'db-blue-3', 'db-blue-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

function displayDBBlack(selectedIndex) {
  const bigElements = ['big-db-black-1', 'big-db-black-2', 'big-db-black-3', 'big-db-black-4'];
  const smallElements = ['db-black-1', 'db-black-2', 'db-black-3', 'db-black-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

function displayDBBrown(selectedIndex) {
  const bigElements = ['big-db-brown-1', 'big-db-brown-2', 'big-db-brown-3', 'big-db-brown-4'];
  const smallElements = ['db-brown-1', 'db-brown-2', 'db-brown-3', 'db-brown-4'];

  // Loop through big elements and display only the selected one
  bigElements.forEach((id, index) => {
    document.getElementById(id).style.display = (index === selectedIndex) ? 'block' : 'none';
  });

  // Loop through small elements and apply the border to the selected one
  smallElements.forEach((id, index) => {
    document.getElementById(id).style.cssText = (index === selectedIndex) 
      ? 'border: 1.8px solid black; border-radius: 5px;' 
      : 'border: none; border-radius: 0;';
  });
}

//Event listeners for small product images in right-content div
//Hush
// Function to assign event listeners for each color
function assignEventListeners(color, displayFunction) {
  for (let i = 0; i < 4; i++) {
    document.getElementById(`${color}-${i + 1}`).addEventListener('click', () => displayFunction(i));
  }
}

// Assign event listeners for each color
assignEventListeners('hush-pink', displayHushPink);
assignEventListeners('hush-white', displayHushWhite);
assignEventListeners('hush-black', displayHushBlack);
assignEventListeners('hush-brown', displayHushBrown);

assignEventListeners('cdn-pink', displayCDNPink);
assignEventListeners('cdn-black', displayCDNBlack);
assignEventListeners('cdn-brown', displayCDNBrown);

assignEventListeners('wispy-yellow', displayWispyYellow);
assignEventListeners('wispy-green', displayWispyGreen);
assignEventListeners('wispy-black', displayWispyBlack);

assignEventListeners('db-blue', displayDBBlue);
assignEventListeners('db-black', displayDBBlack);
assignEventListeners('db-brown', displayDBBrown);

// Handle window resize events
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

