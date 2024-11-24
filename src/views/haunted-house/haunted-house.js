import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { Timer } from "three/addons/misc/Timer.js";
import { Sky } from "three/examples/jsm/Addons.js";

const getFloorTextures = (textureLoader) => {
  const floorColor = textureLoader.load(
    "./textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp"
  );
  const floorArm = textureLoader.load(
    "./textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp"
  );
  const floorNormal = textureLoader.load(
    "./textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp"
  );
  const floorDisplacement = textureLoader.load(
    "./textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp"
  );
  const floorAlpha = textureLoader.load("./textures/floor/alpha.webp");

  floorColor.colorSpace = THREE.SRGBColorSpace;

  [floorColor, floorArm, floorNormal, floorDisplacement].forEach((texture) => {
    texture.repeat.set(8, 8);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  return {
    floorColor,
    floorArm,
    floorNormal,
    floorAlpha,
    floorDisplacement,
  };
};

const getWallTextures = (textureLoader) => {
  const wallColor = textureLoader.load(
    "./textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp"
  );
  const wallArm = textureLoader.load(
    "./textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp"
  );
  const wallNormal = textureLoader.load(
    "./textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp"
  );

  wallColor.colorSpace = THREE.SRGBColorSpace;

  return {
    wallColor,
    wallArm,
    wallNormal,
  };
};

const getRoofTextures = (textureLoader) => {
  const roofColor = textureLoader.load(
    "./textures/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp"
  );
  const roofArm = textureLoader.load(
    "./textures/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp"
  );
  const roofNormal = textureLoader.load(
    "./textures/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp"
  );

  roofColor.colorSpace = THREE.SRGBColorSpace;

  [roofColor, roofArm, roofNormal].forEach((texture) => {
    texture.repeat.set(3, 1);
    texture.wrapS = THREE.RepeatWrapping;
  });

  return {
    roofColor,
    roofArm,
    roofNormal,
  };
};

const getDoorTextures = (textureLoader) => {
  const doorColor = textureLoader.load("./textures/door/color.webp");
  const doorNormal = textureLoader.load("./textures/door/normal.webp");
  const doorHeight = textureLoader.load("./textures/door/height.webp");
  const doorAo = textureLoader.load("./textures/door/ambientOcclusion.webp");
  const doorMetalness = textureLoader.load("./textures/door/metalness.webp");
  const doorRoughness = textureLoader.load("./textures/door/roughness.webp");
  const doorAlpha = textureLoader.load("./textures/door/alpha.webp");

  doorColor.colorSpace = THREE.SRGBColorSpace;

  return {
    doorColor,
    doorNormal,
    doorHeight,
    doorAo,
    doorMetalness,
    doorRoughness,
    doorAlpha,
  };
};

const getBushTextures = (textureLoader) => {
  const bushColor = textureLoader.load(
    "./textures/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp"
  );
  const bushNormal = textureLoader.load(
    "./textures/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp"
  );
  const bushArm = textureLoader.load(
    "./textures/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp"
  );

  bushColor.colorSpace = THREE.SRGBColorSpace;

  return {
    bushColor,
    bushNormal,
    bushArm,
  };
};

const getGraveTextures = (textureLoader) => {
  const graveColor = textureLoader.load(
    "./textures/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp"
  );
  const graveNormal = textureLoader.load(
    "./textures/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp"
  );
  const graveArm = textureLoader.load(
    "./textures/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp"
  );

  graveColor.colorSpace = THREE.SRGBColorSpace;

  return {
    graveColor,
    graveNormal,
    graveArm,
  };
};

export default function init() {
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

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(4, 2, 5);

  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;

  scene.add(camera);

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight("#86cdff", 0.1);
  const directionalLight = new THREE.DirectionalLight("#86cdff", 1.56);
  directionalLight.position.set(3, 2, -8);

  scene.add(ambientLight, directionalLight);

  const textureLoader = new THREE.TextureLoader();
  const { floorColor, floorArm, floorNormal, floorAlpha, floorDisplacement } =
    getFloorTextures(textureLoader);

  const house = new THREE.Group();

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      transparent: true,
      alphaMap: floorAlpha,
      map: floorColor,
      aoMap: floorArm,
      normalMap: floorNormal,
      displacementMap: floorDisplacement,
      displacementScale: 0.02,
      roughnessMap: floorArm,
      metalnessMap: floorArm,
      side: THREE.DoubleSide,
    })
  );
  floor.rotation.x = -Math.PI / 2;

  const dimensions = {
    width: 4,
    depth: 4,
    height: 2.8,
  };

  const { wallColor, wallArm, wallNormal } = getWallTextures(textureLoader);
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(
      dimensions.width,
      dimensions.height,
      dimensions.depth
    ),
    new THREE.MeshStandardMaterial({
      map: wallColor,
      aoMap: wallArm,
      normalMap: wallNormal,
      roughnessMap: wallArm,
      metalnessMap: wallArm,
    })
  );
  walls.position.y = dimensions.height / 2;

  const { roofColor, roofArm, roofNormal } = getRoofTextures(textureLoader);
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(dimensions.width - 0.5, 2, 4, 1, false),
    new THREE.MeshStandardMaterial({
      map: roofColor,
      aoMap: roofArm,
      normalMap: roofNormal,
      roughnessMap: roofArm,
      metalnessMap: roofArm,
    })
  );
  roof.position.y = dimensions.height + roof.geometry.parameters.height / 2;
  roof.rotation.y = -Math.PI / 4;

  const {
    doorColor,
    doorNormal,
    doorHeight,
    doorAo,
    doorMetalness,
    doorRoughness,
    doorAlpha,
  } = getDoorTextures(textureLoader);
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
      map: doorColor,
      normalMap: doorNormal,
      displacementMap: doorHeight,
      displacementScale: 0.146,
      displacementBias: -0.03,
      aoMap: doorAo,
      metalnessMap: doorMetalness,
      roughnessMap: doorRoughness,
      transparent: true,
      alphaMap: doorAlpha,
    })
  );
  door.position.y = door.geometry.parameters.height / 2;
  door.position.z = dimensions.depth / 2 + 0.01;

  const { bushColor, bushNormal, bushArm } = getBushTextures(textureLoader);
  const bushes = (() => {
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({
      color: "lightgreen",
      map: bushColor,
      normalMap: bushNormal,
      aoMap: bushArm,
    });
    const baseZ = dimensions.depth / 2 + 0.2;

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(1.5, 0.2, baseZ);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(0.8, 0.1, baseZ);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-1.5, 0.2, baseZ);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.3, 0.3, 0.3);
    bush4.position.set(-0.8, 0.15, baseZ);

    return [bush1, bush2, bush3, bush4];
  })();

  const { graveColor, graveNormal, graveArm } = getGraveTextures(textureLoader);
  const graveYard = (() => {
    const graveGeometry = new THREE.BoxGeometry(0.8, 0.7, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({
      map: graveColor,
      normalMap: graveNormal,
      aoMap: graveArm,
      roughnessMap: graveArm,
      metalnessMap: graveArm,
    });

    const gravesGroup = new THREE.Group();

    // 30 graves
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * 2 * Math.PI;
      // sqrt of sq.P + sq.B
      const p = dimensions.width / 2;
      const b = dimensions.depth / 2;
      const deltaRadius =
        Math.random() * (floor.geometry.parameters.width / 2 - 3);
      const radius = Math.sqrt(Math.pow(p, 2) + Math.pow(b, 2)) + deltaRadius;

      const grave = new THREE.Mesh(graveGeometry, graveMaterial);

      // in circle
      grave.position.x = Math.sin(angle) * radius;
      grave.position.z = Math.cos(angle) * radius;

      // height
      grave.position.y = Math.random() * (graveGeometry.parameters.height / 2);

      // skew
      grave.rotation.x = (Math.random() - 0.5) * 0.4;
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      grave.rotation.z = (Math.random() - 0.5) * 0.4;

      gravesGroup.add(grave);
    }

    return gravesGroup;
  })();

  const doorLight = new THREE.PointLight("#ff7d46", 5, 4, 2);
  doorLight.position.set(
    0,
    walls.geometry.parameters.height - 0.6,
    door.position.z + 0.5
  );
  doorLight.lookAt(door.position);

  /**
   * Ghost Lights
   */
  const ghostLight = new THREE.PointLight("#ff7d46", 3, 3, 0);
  const ghostLight2 = new THREE.PointLight("#00ffcc", 3, 3, 0);
  const ghostLight3 = new THREE.PointLight("#ff0080", 3, 3, 0);

  house.add(
    floor,
    walls,
    roof,
    door,
    ...bushes,
    graveYard,
    doorLight,
    ghostLight,
    ghostLight2,
    ghostLight3
  );

  const sky = new Sky();
  sky.scale.setScalar(100);
  sky.material.uniforms.sunPosition.value.set(0.3, -0.038, -0.95);
  sky.material.uniforms.turbidity.value = 10;
  sky.material.uniforms.rayleigh.value = 3;
  sky.material.uniforms.mieCoefficient.value = 0.1;
  sky.material.uniforms.mieDirectionalG.value = 0.95;

  scene.add(house, sky);

  /**
   * Shadows
   */
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  directionalLight.castShadow = true;
  walls.castShadow = true;
  walls.receiveShadow = true;
  roof.castShadow = true;
  floor.receiveShadow = true;
  graveYard.children.forEach((grave) => {
    grave.castShadow = true;
    grave.receiveShadow = true;
  });

  // mapping shadows
  directionalLight.shadow.mapSize.width = 256;
  directionalLight.shadow.mapSize.height = 256;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 20;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;

  [ghostLight, ghostLight2, ghostLight3].forEach((light) => {
    light.castShadow = true;
    light.shadow.mapSize.width = 256;
    light.shadow.mapSize.height = 256;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 20;
  });

  /**
   * Fog
   */
  scene.fog = new THREE.FogExp2("#02343f", 0.1);

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
  ghost1Folder.addColor(ghostLight, "color").name("Color");
  ghost1Folder.add(ghostLight, "intensity", 0, 5, 0.01).name("Intensity");
  ghost1Folder.add(ghostLight, "distance", 0, 50, 1).name("Distance");
  ghost1Folder.add(ghostLight, "decay", 1, 2, 0.01).name("Decay");
  ghost1Folder.open();

  const ghost2Folder = gui.addFolder("Ghost Light 2");
  ghost2Folder.addColor(ghostLight2, "color").name("Color");
  ghost2Folder.add(ghostLight2, "intensity", 0, 5, 0.01).name("Intensity");
  ghost2Folder.add(ghostLight2, "distance", 0, 50, 1).name("Distance");
  ghost2Folder.add(ghostLight2, "decay", 1, 2, 0.01).name("Decay");
  ghost2Folder.open();

  const ghost3Folder = gui.addFolder("Ghost Light 3");
  ghost3Folder.addColor(ghostLight3, "color").name("Color");
  ghost3Folder.add(ghostLight3, "intensity", 0, 5, 0.01).name("Intensity");
  ghost3Folder.add(ghostLight3, "distance", 0, 50, 1).name("Distance");
  ghost3Folder.add(ghostLight3, "decay", 1, 2, 0.01).name("Decay");
  ghost3Folder.open();

  gui.close();

  const timer = new Timer();

  const tick = () => {
    timer.update();
    const elapsedTime = timer.getElapsed();

    ghostLight.position.x = Math.sin(elapsedTime * 0.1) * 6.5;
    ghostLight2.position.x = -Math.sin(elapsedTime * 0.15) * 4.5;
    ghostLight3.position.x = Math.sin(elapsedTime * 0.17) * 9;

    ghostLight.position.z = Math.cos(elapsedTime * 0.14) * 6.5;
    ghostLight2.position.z = -Math.cos(elapsedTime * 0.15) * 4.5;
    ghostLight3.position.z = Math.cos(elapsedTime * 0.17) * 9;

    ghostLight.position.y =
      Math.sin(5.2 * elapsedTime + 5) * Math.sin(0.6 * elapsedTime) +
      Math.sin(3 * elapsedTime);
    ghostLight2.position.y =
      Math.sin(elapsedTime * 0.15) * Math.sin(6.7 * elapsedTime - 3);
    ghostLight3.position.y =
      Math.sin(2.5 * elapsedTime + 3) * Math.sin(0.5 * elapsedTime) +
      Math.sin(elapsedTime);

    orbitControls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
}
