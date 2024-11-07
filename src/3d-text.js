import * as THREE from "three";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Initialize core components
function initCore() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(-25, 0, 15);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  return { scene, camera, renderer };
}

// Initialize controls and GUI
function initControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const gui = new GUI();
  return { controls, gui };
}

// Initialize materials
function initMaterials(gui) {
  const textureLoader = new THREE.TextureLoader();
  const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
  matcapTexture.colorSpace = THREE.SRGBColorSpace;

  const matcapMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
    flatShading: false,
  });

  const physicalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    clearcoat: 1,
    opacity: 1,
    roughness: 0,
    metalness: 0,
    reflectivity: 0.3,
    transmission: 0.85,
    ior: 1.33,
    thickness: 0.5,
  });

  // Add GUI controls for donut material
  const materialFolder = gui.addFolder("Physical Material Properties");

  materialFolder
    .addColor({ color: physicalMaterial.color.getHex() }, "color")
    .onChange((value) => physicalMaterial.color.set(value))
    .name("Color");

  materialFolder.add(physicalMaterial, "opacity", 0, 1).name("Opacity");

  materialFolder.add(physicalMaterial, "roughness", 0, 1).name("Roughness");

  materialFolder.add(physicalMaterial, "metalness", 0, 1).name("Metalness");

  materialFolder.add(physicalMaterial, "clearcoat", 0, 1).name("Clearcoat");

  materialFolder
    .add(physicalMaterial, "reflectivity", 0, 1)
    .name("Reflectivity");

  materialFolder
    .add(physicalMaterial, "transmission", 0, 1)
    .name("Transmission");

  materialFolder.add(physicalMaterial, "ior", 1, 3).name("Index of Refraction");

  materialFolder.add(physicalMaterial, "thickness", 0, 1).name("Thickness");

  materialFolder.open();

  return { matcapMaterial, physicalMaterial };
}

// Initialize lighting
function initLighting(scene, gui) {
  const hemisphereLight = new THREE.HemisphereLight("#c26b6b", "#169abb", 3);
  hemisphereLight.position.set(0, 10, 0);
  scene.add(hemisphereLight);

  const lightFolder = gui.addFolder("HemisphereLight Attributes");
  lightFolder
    .add(hemisphereLight, "intensity", 0, 10)
    .step(1)
    .name("Intensity");

  lightFolder
    .addColor({ color: hemisphereLight.color.getHex() }, "color")
    .onChange((value) => hemisphereLight.color.set(value))
    .name("Sky Color");

  lightFolder
    .addColor({ color: hemisphereLight.groundColor.getHex() }, "color")
    .onChange((value) => hemisphereLight.groundColor.set(value))
    .name("Ground Color");

  lightFolder.open();
}

// Create text and donuts
function createObjects(
  scene,
  font,
  matcapMaterial,
  physicalMaterial,
  gui,
  camera
) {
  // Text setup
  let textContent = "I love Three.js";
  const textGeometry = new TextGeometry(textContent, {
    font,
    size: 3,
    depth: 1,
    curveSegments: 4,
  });
  textGeometry.center();

  let text = new THREE.Mesh(textGeometry, matcapMaterial);
  text.lookAt(camera.position);
  scene.add(text);

  // Donuts setup
  const group = new THREE.Group();
  const donutGeometry = new THREE.SphereGeometry(0.5, 20, 20);

  Array.from({ length: 350 }).forEach(() => {
    const donut = new THREE.Mesh(donutGeometry, physicalMaterial);
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

  // GUI controls for text and materials
  let usePhysicalMaterial = false;
  gui
    .add(
      {
        toggle: () => {
          usePhysicalMaterial = !usePhysicalMaterial;
          text.material = usePhysicalMaterial
            ? physicalMaterial
            : matcapMaterial;
          group.children.forEach((donut) => {
            donut.material = usePhysicalMaterial
              ? matcapMaterial
              : physicalMaterial;
          });
        },
      },
      "toggle"
    )
    .name("Toggle Material");

  gui
    .add(
      {
        updateText: () => {
          scene.remove(text);
          const newTextGeometry = new TextGeometry(textContent, {
            font,
            size: 3,
            depth: 1,
            curveSegments: 4,
          });
          newTextGeometry.center();
          text = new THREE.Mesh(newTextGeometry, text.material);
          text.lookAt(camera.position);
          scene.add(text);
        },
      },
      "updateText"
    )
    .name("Update Text");

  gui
    .add({ text: textContent }, "text")
    .onChange((value) => {
      textContent = value;
    })
    .name("Text Content");

  return { group };
}

// Animation loop
function createAnimationLoop({
  scene,
  camera,
  renderer,
  controls,
  group,
  gui,
}) {
  const clock = new THREE.Clock();
  const options = { rotationSpeed: 0.001 };
  gui.add(options, "rotationSpeed", 0, 0.1).name("Rotation Speed");

  function tick() {
    const elapsedTime = clock.getElapsedTime();
    group.rotation.y =
      (group.rotation.y + options.rotationSpeed) % (2 * Math.PI);
    group.position.y = Math.sin(elapsedTime * 2) * 0.5;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  return tick;
}

// Handle window resize
function handleResize(camera, renderer) {
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

// Main initialization function
function init() {
  const { scene, camera, renderer } = initCore();
  const { controls, gui } = initControls(camera, renderer);
  const { matcapMaterial, physicalMaterial } = initMaterials(gui);

  initLighting(scene, gui);

  const fontLoader = new FontLoader();
  fontLoader.load("/fonts/Devinne_Swash_Regular.json", (font) => {
    const { group } = createObjects(
      scene,
      font,
      matcapMaterial,
      physicalMaterial,
      gui,
      camera
    );
    const tick = createAnimationLoop({
      scene,
      camera,
      renderer,
      controls,
      group,
      gui,
    });
    tick();
  });

  document.body.appendChild(renderer.domElement);
  handleResize(camera, renderer);
}

init();
