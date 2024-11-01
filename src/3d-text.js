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
  // gui.add(controls, 'scaleX', 0, 5);

  const textureLoader = new THREE.TextureLoader();
  const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
  matcapTexture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
    flatShading: false,
  });

  const group = new THREE.Group();

  const fontLoader = new FontLoader(loadingManager);
  fontLoader.load("/fonts/Devinne_Swash_Regular.json", (font) => {
    const textGeometry = new TextGeometry("I love three.js", {
      font: font,
      size: 3,
      depth: 0.5,
      curveSegments: 4,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: 0.02,
      bevelThickness: 0.03,
      bevelOffset: 0,
    });
    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x + textGeometry.boundingBox.min.x) / 2,
    //   -(textGeometry.boundingBox.max.y + textGeometry.boundingBox.min.y) / 2,
    //   -(textGeometry.boundingBox.max.z + textGeometry.boundingBox.min.z) / 2
    // );
    // textGeometry.computeBoundingBox();
    // console.log(textGeometry.boundingBox);
    textGeometry.center();

    const text = new THREE.Mesh(textGeometry, material);
    text.lookAt(camera.position);
    scene.add(text);

    // donuts
    const donutGeometry = new THREE.IcosahedronGeometry(0.5, 1);
    const donutMaterial = new THREE.MeshPhysicalMaterial({
      transparent: true,
      opacity: 1,
      roughness: 0.3,
      metalness: 0.07,
      reflectivity: 0.8,
      transmission: 1,
      ior: 1.33,
      thickness: 0.3,
    });

    // Add GUI controls for material properties
    const materialFolder = gui.addFolder("Donut Material");
    materialFolder.add(donutMaterial, "opacity", 0, 1);
    materialFolder.add(donutMaterial, "roughness", 0, 1);
    materialFolder.add(donutMaterial, "metalness", 0, 1);
    materialFolder.add(donutMaterial, "reflectivity", 0, 1);
    materialFolder.add(donutMaterial, "transmission", 0, 1);
    materialFolder.add(donutMaterial, "ior", 1, 2.333);
    materialFolder.add(donutMaterial, "thickness", 0, 1);

    Array.from({ length: 800 }).forEach(() => {
      const donut = new THREE.Mesh(donutGeometry, donutMaterial);
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

  scene.add(new THREE.AmbientLight(0.5));

  const rgbeLoader = new RGBELoader(loadingManager);
  rgbeLoader.load(
    "/textures/environmentMap/moonless_golf_4k.hdr",
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      // Set the scene background to the cube texture
      scene.background = texture;
      scene.environment = texture;
    }
  );

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
