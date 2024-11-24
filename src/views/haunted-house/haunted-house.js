import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { Sky } from "three/examples/jsm/Addons.js";

export default function init() {
  /**
   * Base
   */
  // Debug
  const gui = new GUI({
    container: document.querySelector("#gui"),
  });

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById("webgl"),
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Scene
  const scene = new THREE.Scene();

  const textureLoader = new THREE.TextureLoader();
  const floorAlphaTexture = textureLoader.load("/textures/floor/alpha.webp");
  const floorColorTexture = textureLoader.load(
    "/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp"
  );
  const floorDisplacementTexture = textureLoader.load(
    "/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp"
  );
  const floorNormalTexture = textureLoader.load(
    "/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp"
  );
  const floorArmTexture = textureLoader.load(
    "/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp"
  );

  floorColorTexture.colorSpace = THREE.SRGBColorSpace;

  [
    floorColorTexture,
    floorDisplacementTexture,
    floorNormalTexture,
    floorArmTexture,
  ].forEach((texture) => {
    texture.repeat.set(8, 8);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  const wallArmTexture = textureLoader.load(
    "/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp"
  );
  const wallColorTexture = textureLoader.load(
    "/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp"
  );
  wallColorTexture.colorSpace = THREE.SRGBColorSpace;
  const wallNormalTexture = textureLoader.load(
    "/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp"
  );

  const roofColorTexture = textureLoader.load(
    "/textures/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp"
  );
  roofColorTexture.colorSpace = THREE.SRGBColorSpace;
  const roofNormalTexture = textureLoader.load(
    "/textures/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp"
  );
  const roofArmTexture = textureLoader.load(
    "/textures/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp"
  );

  [roofColorTexture, roofNormalTexture, roofArmTexture].forEach((texture) => {
    texture.repeat.set(3, 1);
    texture.wrapS = THREE.RepeatWrapping;
  });

  const doorColorTexture = textureLoader.load("/textures/door/color.webp");
  doorColorTexture.colorSpace = THREE.SRGBColorSpace;
  const doorAlphaTexture = textureLoader.load("/textures/door/alpha.webp");
  const doorNormalTexture = textureLoader.load("/textures/door/normal.webp");
  const doorHeightTexture = textureLoader.load("/textures/door/height.webp");
  const doorAoTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.webp"
  );
  const doorMetalnessTexture = textureLoader.load(
    "/textures/door/metalness.webp"
  );
  const doorRoughnessTexture = textureLoader.load(
    "/textures/door/roughness.webp"
  );

  const bushColorTexture = textureLoader.load(
    "/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp"
  );
  bushColorTexture.colorSpace = THREE.SRGBColorSpace;
  const bushNormalTexture = textureLoader.load(
    "/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp"
  );
  const bushArmTexture = textureLoader.load(
    "/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp"
  );

  const graveColorTexture = textureLoader.load(
    "/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp"
  );
  graveColorTexture.colorSpace = THREE.SRGBColorSpace;
  const graveNormalTexture = textureLoader.load(
    "/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp"
  );
  const graveArmTexture = textureLoader.load(
    "/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp"
  );

  /**
   * House
   */

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      alphaMap: floorAlphaTexture,
      transparent: true,
      map: floorColorTexture,
      displacementMap: floorDisplacementTexture,
      normalMap: floorNormalTexture,
      displacementScale: 0.4,
      displacementBias: -0.3,
      aoMap: floorArmTexture,
      roughnessMap: floorArmTexture,
      metalnessMap: floorArmTexture,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const dimensions = {
    width: 4,
    height: 2.8,
    depth: 4,
  };

  const house = new THREE.Group();
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(
      dimensions.width,
      dimensions.height,
      dimensions.depth
    ),
    new THREE.MeshStandardMaterial({
      map: wallColorTexture,
      normalMap: wallNormalTexture,
      aoMap: wallArmTexture,
      roughnessMap: wallArmTexture,
      metalnessMap: wallArmTexture,
    })
  );
  walls.position.y += 1.4;
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(dimensions.width - 0.5, 2, 4, 1, false),
    new THREE.MeshStandardMaterial({
      map: roofColorTexture,
      normalMap: roofNormalTexture,
      aoMap: roofArmTexture,
      roughnessMap: roofArmTexture,
      metalnessMap: roofArmTexture,
    })
  );
  roof.rotation.y = -Math.PI / 4;
  roof.position.y = dimensions.height + roof.geometry.parameters.height / 2;

  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
      map: doorColorTexture,
      normalMap: doorNormalTexture,
      alphaMap: doorAlphaTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.146,
      displacementBias: -0.03,
      transparent: true,
      aoMap: doorAoTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
    })
  );
  gui.add(door.material, "displacementScale").min(0).max(1).step(0.001);
  gui.add(door.material, "displacementBias").min(-1).max(1).step(0.001);
  door.position.y = door.geometry.parameters.height / 2;
  door.position.z = dimensions.depth / 2 + 0.01;

  const bushes = (() => {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: "lightgreen",
      map: bushColorTexture,
      normalMap: bushNormalTexture,
      aoMap: bushArmTexture,
      roughnessMap: bushArmTexture,
      metalnessMap: bushArmTexture,
    });
    const baseZ = dimensions.depth / 2 + 0.2;

    const bush1 = new THREE.Mesh(geometry, material);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(1.5, 0.2, baseZ);

    const bush2 = new THREE.Mesh(geometry, material);
    bush2.scale.setScalar(0.2);
    bush2.position.set(0.8, 0.1, baseZ);

    const bush3 = new THREE.Mesh(geometry, material);
    bush3.scale.set(0.5, 0.5, 0.5);
    bush3.position.set(-1.5, 0.2, baseZ);

    const bush4 = new THREE.Mesh(geometry, material);
    bush4.scale.setScalar(0.3);
    bush4.position.set(-0.8, 0.15, baseZ);

    return [bush1, bush2, bush3, bush4];
  })();

  const graves = (() => {
    const geometry = new THREE.BoxGeometry(0.8, 0.7, 0.2);
    const material = new THREE.MeshStandardMaterial({
      map: graveColorTexture,
      normalMap: graveNormalTexture,
      aoMap: graveArmTexture,
      roughnessMap: graveArmTexture,
      metalnessMap: graveArmTexture,
    });

    const gravesGroup = new THREE.Group();
    for (let i = 0; i < 30; i++) {
      const grave = new THREE.Mesh(geometry, material);
      const rad = Math.random() * 2 * Math.PI;
      const radius =
        Math.sqrt(
          Math.pow(dimensions.width / 2, 2) + Math.pow(dimensions.depth / 2, 2)
        ) +
        Math.random() * (floor.geometry.parameters.width / 2 - 3);
      grave.position.x = Math.sin(rad) * radius;
      grave.position.z = Math.cos(rad) * radius;
      grave.position.y = Math.random() * (geometry.parameters.height / 2);

      grave.rotation.x = (Math.random() - 0.5) * 0.4;
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      gravesGroup.add(grave);
    }
    return gravesGroup;
  })();
  house.add(walls, roof, door, ...bushes, graves);

  scene.add(house);
  /**
   * Lights
   */
  // Ambient light
  const ambientLight = new THREE.AmbientLight("#86cdff", 0.275);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight("#86cdff", 1);
  directionalLight.position.set(3, 2, -8);
  scene.add(directionalLight);

  // door light
  const doorLight = new THREE.PointLight("#ff7d46", 5, 4, 2);
  doorLight.position.set(
    0,
    walls.geometry.parameters.height - 0.6,
    walls.geometry.parameters.depth / 2 + 0.5
  );
  doorLight.lookAt(
    new THREE.Vector3(0, 0, walls.geometry.parameters.depth / 2 + 1)
  );
  scene.add(doorLight);

  // ghostLights
  const ghost1 = new THREE.PointLight("#ff7d46", 3, 3, 0);
  const ghost2 = new THREE.PointLight("#00ffcc", 3, 3, 0);
  const ghost3 = new THREE.PointLight("#ff00ff", 3, 3, 0);

  const sky = new Sky();
  sky.scale.setScalar(100);
  sky.material.uniforms.sunPosition.value.set(0.3, -0.038, -0.95);
  sky.material.uniforms.turbidity.value = 10;
  sky.material.uniforms.rayleigh.value = 3;
  sky.material.uniforms.mieCoefficient.value = 0.1;
  sky.material.uniforms.mieDirectionalG.value = 0.95;
  scene.add(sky);

  /**
   * Fog
   */
  scene.fog = new THREE.FogExp2("#02343f", 0.1);
  scene.add(ghost1, ghost2, ghost3);

  // Added GUI controls

  gui
    .add(ambientLight, "intensity")
    .name("Ambient Intensity")
    .min(0)
    .max(10)
    .step(0.001);
  gui
    .add(directionalLight, "intensity")
    .name("Directional Intensity")
    .min(0)
    .max(10)
    .step(0.001);

  const doorLightFolder = gui.addFolder("Door Light");
  doorLightFolder
    .add(doorLight, "intensity")
    .name("Intensity")
    .min(0)
    .max(10)
    .step(1);
  doorLightFolder.add(doorLight, "distance", 0, 20, 1).name("Distance");
  doorLightFolder.add(doorLight, "decay", 0, 3, 0.01).name("Decay");
  doorLightFolder.open();

  const ghost1Folder = gui.addFolder("Ghost Light 1");
  ghost1Folder.addColor(ghost1, "color").name("Color");
  ghost1Folder.add(ghost1, "intensity", 0, 5, 0.01).name("Intensity");
  ghost1Folder.add(ghost1, "distance", 0, 50, 1).name("Distance");
  ghost1Folder.add(ghost1, "decay", 1, 2, 0.01).name("Decay");
  ghost1Folder.open();

  const ghost2Folder = gui.addFolder("Ghost Light 2");
  ghost2Folder.addColor(ghost2, "color").name("Color");
  ghost2Folder.add(ghost2, "intensity", 0, 5, 0.01).name("Intensity");
  ghost2Folder.add(ghost2, "distance", 0, 50, 1).name("Distance");
  ghost2Folder.add(ghost2, "decay", 1, 2, 0.01).name("Decay");
  ghost2Folder.open();

  const ghost3Folder = gui.addFolder("Ghost Light 3");
  ghost3Folder.addColor(ghost3, "color").name("Color");
  ghost3Folder.add(ghost3, "intensity", 0, 5, 0.01).name("Intensity");
  ghost3Folder.add(ghost3, "distance", 0, 50, 1).name("Distance");
  ghost3Folder.add(ghost3, "decay", 1, 2, 0.01).name("Decay");
  ghost3Folder.open();

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

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 4;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  floor.receiveShadow = true;
  walls.castShadow = true;
  walls.receiveShadow = true;
  roof.receiveShadow = true;
  directionalLight.castShadow = true;
  ghost1.castShadow = true;
  ghost2.castShadow = true;
  ghost3.castShadow = true;
  graves.children.forEach((grave) => {
    grave.castShadow = true;
    grave.receiveShadow = true;
  });

  // mapping
  directionalLight.shadow.mapSize.width = 256;
  directionalLight.shadow.mapSize.height = 256;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 20;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  [ghost1, ghost2, ghost3].forEach((ghostLight) => {
    ghostLight.shadow.mapSize.width = 256;
    ghostLight.shadow.mapSize.height = 256;
    ghostLight.shadow.camera.near = 1;
    ghostLight.shadow.camera.far = 20;
  });

  /**
   * Animate
   */
  const timer = new Timer();

  const tick = () => {
    // Timer
    timer.update();
    const elapsedTime = timer.getElapsed();

    ghost1.position.x = Math.sin(elapsedTime * 0.1) * 6.5;
    ghost1.position.z = Math.cos(elapsedTime * 0.14) * 6.5;
    ghost1.position.y =
      Math.sin(5.2 * elapsedTime + 5) * Math.sin(0.6 * elapsedTime);

    ghost2.position.x = -Math.sin(elapsedTime * 0.15) * 4.5;
    ghost2.position.z = -Math.cos(elapsedTime * 0.15) * 4.5;
    ghost2.position.y =
      Math.sin(3.7 * elapsedTime + 10) *
      Math.sin(0.2 * elapsedTime) *
      Math.sin(elapsedTime * 0.23);

    ghost3.position.x = Math.sin(elapsedTime * 0.17) * 9;
    ghost3.position.z = Math.cos(elapsedTime * 0.17) * 9;
    ghost3.position.y =
      Math.sin(2.5 * elapsedTime + 3) * Math.sin(0.5 * elapsedTime);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
}
