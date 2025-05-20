import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

export function coreInit(options = {}) {
  const defaultOptions = {
    cameraFar: 1000,
    enableOrbitControls: true,
  };
  options = { ...defaultOptions, ...options };

  const gui = new GUI({
    container: document.querySelector("#gui"),
  });

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector("#webgl"),
  });

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    options.cameraFar,
  );

  let orbitControls;

  if (options.enableOrbitControls) {
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
  }

  const onResize = () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  onResize();

  window.addEventListener("resize", onResize);

  const removeListeners = () => {
    window.removeEventListener("resize", onResize);
  };

  return {
    gui,
    renderer,
    scene,
    sizes,
    camera,
    orbitControls,
    removeListeners,
  };
}
