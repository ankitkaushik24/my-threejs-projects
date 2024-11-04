import * as THREE from "three";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
function init() {
  const loadingManager = new THREE.LoadingManager(
    // On Load
    () => {
      document.querySelector(".loading-bar").classList.add("ended");
      document.querySelector(".loading-bar").removeAttribute("style");
    },
    // On Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
      const progressRatio = itemsLoaded / itemsTotal;
      document.querySelector(
        ".loading-bar"
      ).style.transform = `scaleX(${progressRatio})`;
    }
  );

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();

  // create a camera, which defines where we're looking at
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  // tell the camera where to look
  camera.position.set(-25, 0, 15);
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // create controls for the GUI
  const gui = new GUI();

  const textureLoader = new THREE.TextureLoader();
  const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
  matcapTexture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
    flatShading: false,
  });
  const donutMaterial = new THREE.MeshPhysicalMaterial({
    transparent: true,
    opacity: 1,
    roughness: 0.58,
    metalness: 0,
    reflectivity: 0.4,
    transmission: 1,
    ior: 2.33,
    thickness: 0.01,
  });
  const group = new THREE.Group();

  const fontLoader = new FontLoader(loadingManager);
  fontLoader.load("/fonts/Devinne_Swash_Regular.json", (font) => {
    const textGeometry = new TextGeometry("I love three.js", {
      font: font,
      size: 3,
      depth: 1,
      curveSegments: 4,
    });
    textGeometry.center();

    const text = new THREE.Mesh(textGeometry, donutMaterial);
    text.lookAt(camera.position);
    scene.add(text);

    // donuts
    const donutGeometry = new THREE.SphereGeometry(0.5, 20, 20);

    Array.from({ length: 350 }).forEach(() => {
      const donut = new THREE.Mesh(donutGeometry, material);
      donut.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );
      donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const randomScale = Math.random();
      donut.scale.set(randomScale, randomScale, randomScale);
      group.add(donut);
    });
    scene.add(group);
  });

  // add the output of the render function to the HTML
  document.body.appendChild(renderer.domElement);

  const options = {
    rotationSpeed: 0.001, // Define rotation speed within options
  };

  // Create controls for the GUI

  gui.add(options, "rotationSpeed", 0, 0.1); // Add this line for GUI control

  const clock = new THREE.Clock();
  // function for re-rendering/animating the scene
  function tick() {
    const elapsedTime = clock.getElapsedTime();
    group.rotation.y =
      (group.rotation.y + options.rotationSpeed) % (2 * Math.PI);

    group.position.y = Math.sin(elapsedTime * 2) * 0.5;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  // Add this event listener for window resize
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
init();
