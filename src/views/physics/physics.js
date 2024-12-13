import * as THREE from "three";

export default function init({ renderer, scene, camera, orbitControls, gui }) {
  const clock = new THREE.Clock();
  let previousTime = 0;
  let frameId = null;
  const hitAudio = new Audio("/sounds/hit.mp3");

  const sharedMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.4,
    roughness: 0.7,
    side: THREE.DoubleSide,
  });

  camera.position.set(1, 1.5, 5);

  const physicsWorker = new Worker(
    new URL("./physicsWorker.js", import.meta.url),
    { type: "module" }
  );

  const meshes = new Map();
  let nextObjectId = 0;

  physicsWorker.onmessage = (e) => {
    const { type, data } = e.data;
    switch (type) {
      case "frame":
        data.bodies.forEach(({ id, position, quaternion }) => {
          const mesh = meshes.get(id);
          if (mesh) {
            mesh.position.copy(position);
            mesh.quaternion.copy(quaternion);
          }
        });
        break;
      case "collision":
        const { impactStrength } = data;
        const normalisedImpact = Math.min(Math.abs(impactStrength) / 10, 1);
        hitAudio.volume = normalisedImpact;
        hitAudio.currentTime = 0;
        hitAudio.play();
        break;
    }
  };

  physicsWorker.postMessage({ type: "init" });

  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.4,
    roughness: 0.7,
  });
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

  const utils = {
    reset: () => {
      meshes.forEach((mesh) => {
        scene.remove(mesh);
      });
      meshes.clear();
      physicsWorker.postMessage({ type: "reset" });
    },
    createSphere: (
      radius = (Math.random() + 0.2) * 0.5,
      position = {
        x: Math.random() * 3 - 1.5,
        y: 15,
        z: Math.random() * 3 - 1.5,
      }
    ) => {
      const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      mesh.castShadow = true;
      mesh.scale.setScalar(radius);
      mesh.position.copy(position);
      scene.add(mesh);

      const id = nextObjectId++;
      meshes.set(id, mesh);

      physicsWorker.postMessage({
        type: "addSphere",
        data: { radius, position, id },
      });
    },
    createBox: (
      width = (Math.random() + 0.2) * 1,
      height = (Math.random() + 0.2) * 1,
      depth = (Math.random() + 0.2) * 1,
      position = {
        x: Math.random() * 3 - 1.5,
        y: 15,
        z: Math.random() * 3 - 1.5,
      }
    ) => {
      const mesh = new THREE.Mesh(boxGeometry, sphereMaterial);
      mesh.scale.set(width, height, depth);
      mesh.castShadow = true;
      scene.add(mesh);

      const id = nextObjectId++;
      meshes.set(id, mesh);

      physicsWorker.postMessage({
        type: "addBox",
        data: { width, height, depth, position, id },
      });
    },
    createPlane: () => {
      const size = 10;
      const planeGeometry = new THREE.PlaneGeometry(size, size);
      const plane = new THREE.Mesh(planeGeometry, sharedMaterial);
      plane.receiveShadow = true;
      plane.position.y = 0;
      plane.rotation.x = -Math.PI / 2;
      scene.add(plane);

      physicsWorker.postMessage({
        type: "addPlane",
        data: { position: plane.position, size },
      });
    },
  };

  utils.createSphere();
  utils.createBox();

  utils.createPlane();

  // Add a directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(5, 5, 5);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

  // Enable shadows in the renderer
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  directionalLight.castShadow = true; // Enable light to cast shadows

  scene.add(directionalLight, ambientLight);

  gui.add(utils, "createSphere");
  gui.add(utils, "createBox");
  gui.add(utils, "reset");
  const tick = (time) => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    physicsWorker.postMessage({
      type: "step",
      data: { deltaTime },
    });

    orbitControls.update();
    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(tick);
  };

  tick();

  return () => {
    window.cancelAnimationFrame(frameId);
    physicsWorker.terminate();

    // Optionally dispose of geometries and materials
    sphereMaterial.dispose();
    sphereGeometry.dispose();
    boxGeometry.dispose();
    plane.geometry.dispose();
    plane.material.dispose();
  };
}
