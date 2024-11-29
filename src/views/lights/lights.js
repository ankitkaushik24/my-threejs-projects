import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default function init({ scene, camera, renderer, gui, orbitControls }) {
  camera.position.set(1, 1, 10);

  const textureLoader = new THREE.TextureLoader();
  const shadowTexture = textureLoader.load("/textures/simpleShadow.jpg");

  const lightIntensities = {
    ambientLight: 0.5,
    directionalLight: 1,
    pointLight: 1,
    spotLight: 1,
    hemisphereLight: 1,
    rectAreaLight: 1,
  };

  // Create lights
  const lights = (() => {
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      lightIntensities.ambientLight
    );

    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      lightIntensities.directionalLight
    );
    directionalLight.position.set(2, 2, 2);
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 8;
    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.bottom = -2;
    directionalLight.shadow.camera.left = -2;
    directionalLight.shadow.camera.right = 2;
    directionalLight.shadow.mapSize.width = 1024 * 2;
    directionalLight.shadow.mapSize.height = 1024 * 2;
    directionalLight.castShadow = true;
    directionalLight.shadow.radius = 6;
    // const directionalLightCameraHelper = new THREE.CameraHelper(
    //   directionalLight.shadow.camera
    // );
    // scene.add(directionalLightCameraHelper);

    const pointLight = new THREE.PointLight(
      0xffffff,
      lightIntensities.pointLight,
      100
    );
    pointLight.position.set(-2, 2, 0);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024 * 2;
    pointLight.shadow.mapSize.height = 1024 * 2;

    const spotLight = new THREE.SpotLight(0xffffff, lightIntensities.spotLight);
    spotLight.position.set(0, 5, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.1;

    const hemisphereLight = new THREE.HemisphereLight(
      0xffffbb,
      0x080820,
      lightIntensities.hemisphereLight
    );

    const rectAreaLight = new THREE.RectAreaLight(
      0xffffff,
      lightIntensities.rectAreaLight,
      2,
      2
    );
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
    rectAreaLight.position.set(0, 2, 0);
    rectAreaLight.lookAt(0, 0, 0);
    rectAreaLight.add(rectAreaLightHelper);

    return {
      ambientLight,
      directionalLight,
      pointLight,
      spotLight,
      hemisphereLight,
      rectAreaLight,
    };
  })();

  // Create a box
  //   const box = (() => {
  //     const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  //     const boxMaterial = new THREE.MeshStandardMaterial({
  //       color: 0xff0000,
  //       //   side: THREE.DoubleSide,
  //     });
  //     return new THREE.Mesh(boxGeometry, boxMaterial);
  //   })();
  //   box.castShadow = true;

  // Create a sphere
  const sphere = (() => {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial();
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.position.set(0, 2, 0); // Position the sphere
    return sphereMesh;
  })();
  sphere.castShadow = true;

  // Create a plane
  const [plane, shadowPlane] = (() => {
    const object3d = new THREE.Object3D();
    const planeGeometry = new THREE.PlaneGeometry(5, 5, 16, 16);
    const planeMaterial = new THREE.MeshBasicMaterial({
      //   color: 0x0000ff,
      //   side: THREE.DoubleSide,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.x = -Math.PI / 2;
    scene.add(planeMesh);

    const shadowPlane = new THREE.Mesh(
      planeGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        alphaMap: shadowTexture,
        transparent: true,
      })
    );
    shadowPlane.position.y = planeMesh.position.z + 0.1;
    shadowPlane.rotation.x = -Math.PI / 2;
    scene.add(shadowPlane);

    object3d.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal

    return [object3d, shadowPlane];
  })();
  //   plane.castShadow = true;
  plane.receiveShadow = true;

  // Add all objects to the scene
  scene.add(sphere, plane);

  // GUI controls
  const controls = {
    // Light toggles
    ambientLight: false,
    directionalLight: false,
    pointLight: false,
    spotLight: false,
    hemisphereLight: false,
    rectAreaLight: false,
  };

  // Add helpers for better visualization
  const helpers = {
    directionalLight: new THREE.DirectionalLightHelper(lights.directionalLight),
    pointLight: new THREE.PointLightHelper(lights.pointLight),
    spotLight: new THREE.SpotLightHelper(lights.spotLight),
  };

  // Lights folder
  const lightsFolder = gui.addFolder("Lights");

  // Active helpers set
  const activeHelpers = new Set();

  // Add initial active lights and their helpers to the scene
  Object.keys(lights).forEach((lightName) => {
    if (controls[lightName]) {
      scene.add(lights[lightName]);
      if (helpers[lightName]) {
        scene.add(helpers[lightName]);
        activeHelpers.add(helpers[lightName]);
      }
    }
  });

  // Add toggles and properties for each light
  Object.keys(lights).forEach((lightName) => {
    const light = lights[lightName];

    // Toggle for light visibility
    lightsFolder.add(controls, lightName).onChange((value) => {
      if (value) {
        scene.add(lights[lightName]);
        if (helpers[lightName]) {
          scene.add(helpers[lightName]);
          activeHelpers.add(helpers[lightName]);
        }
      } else {
        scene.remove(lights[lightName]);
        if (helpers[lightName]) {
          scene.remove(helpers[lightName]);
          activeHelpers.delete(helpers[lightName]);
        }
      }
    });

    // Add intensity control
    lightsFolder
      .add(lightIntensities, lightName, 0, 3, 0.1)
      .onChange((value) => {
        light.intensity = value;
      });

    // Add position controls for all lights
    lightsFolder
      .add(light.position, "x", -10, 10)
      .name(`${lightName} X Position`);
    lightsFolder
      .add(light.position, "y", -10, 10)
      .name(`${lightName} Y Position`);
    lightsFolder
      .add(light.position, "z", -10, 10)
      .name(`${lightName} Z Position`);

    // Add specific controls based on light type
    if (light instanceof THREE.SpotLight) {
      lightsFolder.add(light, "angle", 0, Math.PI / 2).name("Spot Angle");
      lightsFolder.add(light, "penumbra", 0, 1).name("Spot Penumbra");
      lightsFolder.add(light, "decay", 1, 2).name("Spot Decay");
    }

    if (light instanceof THREE.PointLight) {
      lightsFolder.add(light, "distance", 0, 100).name("Point Distance");
      lightsFolder.add(light, "decay", 0, 2).name("Point Decay");
    }

    if (light instanceof THREE.RectAreaLight) {
      lightsFolder
        .add(light, "width", 0, 5)
        .name("Rect Width")
        .onChange(() => {
          light.width = light.width; // Update width
        });
      lightsFolder
        .add(light, "height", 0, 5)
        .name("Rect Height")
        .onChange(() => {
          light.height = light.height; // Update height
        });
    }
  });

  lightsFolder.open();

  const clock = new THREE.Clock();

  // function for re-rendering/animating the scene
  function tick() {
    requestAnimationFrame(tick);

    // Update only active helpers
    activeHelpers.forEach((helper) => helper.update());

    const elapsedTime = clock.getElapsedTime();
    sphere.position.x = Math.sin(elapsedTime) * 1.2;
    sphere.position.z = Math.cos(elapsedTime) * 1.2;
    shadowPlane.position.x = sphere.position.x;
    shadowPlane.position.z = sphere.position.z;

    sphere.position.y = Math.abs(Math.sin(elapsedTime * 2));
    shadowPlane.material.opacity = 1 - sphere.position.y;

    orbitControls.update(); // Update the controls
    renderer.render(scene, camera);
  }
  tick();

  return () => {
    // Cleanup geometries and materials
    sphere.geometry.dispose();
    sphere.material.dispose();
    plane.geometry.dispose();
    plane.material.dispose();
    scene.remove(sphere, plane, ambientLight, pointLight);
  };
}
