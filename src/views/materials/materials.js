import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export default function init({ scene, camera, renderer, gui, orbitControls }) {
  camera.position.set(0, 0, 10);

  const textureLoader = new THREE.TextureLoader();
  const doorColor = textureLoader.load("/textures/door/color.jpg");
  const doorAlpha = textureLoader.load("/textures/door/alpha.jpg");
  const doorHeight = textureLoader.load("/textures/door/height.jpg");
  const doorNormal = textureLoader.load("/textures/door/normal.jpg");
  const doorAmbientOcclusion = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg"
  );
  const doorMetalness = textureLoader.load("/textures/door/metalness.jpg");
  const doorRoughness = textureLoader.load("/textures/door/roughness.jpg");

  const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
  const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

  doorColor.colorSpace = THREE.SRGBColorSpace;
  matcapTexture.colorSpace = THREE.SRGBColorSpace;

  // create controls for the GUI
  const controls = new (function () {
    this.metalness = 1; // Add metalness control
    this.roughness = 1; // Add roughness control
  })();

  const material = new THREE.MeshPhysicalMaterial({
    // map: doorColor,
    // color: "white",
    // envMap: scene.environment, // Set environment map for the material
  });
  material.metalness = controls.metalness;
  material.roughness = controls.roughness;

  //   gradientTexture.minFilter = THREE.NearestFilter;
  //   gradientTexture.magFilter = THREE.NearestFilter;
  //   gradientTexture.generateMipmaps = false;
  //   material.gradientMap = gradientTexture;
  //   material.shininess = 60;
  //   material.specular = new THREE.Color(0xffffff);
  material.side = THREE.DoubleSide;
  //   material.transparent = true;
  material.opacity = 1;
  //   material.alphaMap = doorAlpha;
  material.flatShading = false;
  //   material.displacementMap = doorHeight;
  //   material.displacementScale = 0.2;
  //   material.aoMap = doorAmbientOcclusion;
  //   material.aoMapIntensity = 3;
  //   material.normalMap = doorNormal;
  //   material.metalnessMap = doorMetalness;
  //   material.roughnessMap = doorRoughness;
  //   material.alphaMap = doorAlpha;

  // physical material props
  //   material.clearcoat = 1;
  //   material.clearcoatRoughness = 0;
  //   material.reflectivity = 0.5;
  //   material.refractionRatio = 0.98;

  //   material.sheen = 1;
  //   material.sheenColor.set("#ffffff");
  //   material.sheenRoughness = 0;

  // material.iridescence = 1;
  // material.iridescenceIOR = 1.33;
  // material.iridescenceThicknessRange = [0, 1000];

  material.transmission = 1;
  material.transmissionRoughness = 0;
  material.ior = 1.33;
  material.thickness = 0.5;

  const group = new THREE.Group(); // Create a new group

  const sphere = (() => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
    return mesh;
  })();
  sphere.position.x = 5;

  const torus = (() => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.5, 32, 32),
      material
    );
    return mesh;
  })();
  torus.position.x = -5;

  const plane = (() => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5, 16, 16),
      material
    );
    return mesh;
  })();

  group.add(sphere, plane, torus); // Add objects to the group
  scene.add(group); // Add the group to the scene

  gui.add(material, "metalness", 0, 1);
  gui.add(material, "roughness", 0, 1);
  gui.add(material, "opacity", 0, 1);
  gui.add(material, "flatShading");
  gui.add(material, "clearcoat", 0, 1); // Add clearcoat control
  gui.add(material, "clearcoatRoughness", 0, 1); // Add clearcoat roughness control
  gui.add(material, "reflectivity", 0, 1); // Add reflectivity control
  //   gui.add(material, "refractionRatio", 0, 1); // Add refraction ratio control
  gui.add(group.position, "x", -10, 10).name("Group Position X"); // Control for group X position
  gui.add(group.position, "y", -10, 10).name("Group Position Y"); // Control for group Y position
  gui.add(group.position, "z", -10, 10).name("Group Position Z"); // Control for group Z position
  gui.add(group.rotation, "x", 0, Math.PI * 2).name("Group Rotation X"); // Control for group rotation around X
  gui.add(group.rotation, "y", 0, Math.PI * 2).name("Group Rotation Y"); // Control for group rotation around Y
  gui.add(group.rotation, "z", 0, Math.PI * 2).name("Group Rotation Z"); // Control for group rotation around Z

  //   const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  //   scene.add(ambientLight);
  //   const spotLight = new THREE.SpotLight(0xffffff, 5);
  //   spotLight.position.set(0, 10, 0);
  //   scene.add(spotLight);

  const clock = new THREE.Clock();

  // function for re-rendering/animating the scene
  function tick() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate objects
    // sphere.rotation.x = elapsedTime * 0.5;
    // sphere.rotation.y = elapsedTime * 0.2;

    // plane.rotation.x = elapsedTime * 0.3;
    // plane.rotation.y = elapsedTime * 0.4;

    // torus.rotation.x = elapsedTime * 0.2;
    // torus.rotation.y = elapsedTime * 0.5;

    orbitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  const hdrLoader = new RGBELoader(); // Add HDR loader
  hdrLoader.load("/textures/environmentMap/2k.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping; // Set mapping

    scene.background = texture;
    scene.environment = texture; // Set environment map for the scene
  });

  tick();

  return () => {
    // Cleanup textures
    [
      doorColor,
      doorAlpha,
      doorHeight,
      doorNormal,
      doorAmbientOcclusion,
    ].forEach((texture) => texture.dispose());
    // Add other cleanup code here

    material.dispose();
  };
}
