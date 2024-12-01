import * as THREE from "three";
import { gsap } from "gsap";

export default function init({ scene, camera, renderer, sizes, gui }) {
  camera.position.set(0, 0, 5);
  const cameraGroup = new THREE.Group();
  cameraGroup.add(camera);
  scene.add(cameraGroup);
  renderer.setClearAlpha(0);

  const parameters = {
    // color: "#ebf3ff",
    // color: "#ffeded",
    color: "#2dd4d7",
    wireframe: true,
  };

  const loader = new THREE.TextureLoader();
  const gradientTexture = loader.load("./textures/gradients/3.jpg");
  const particleTexture = loader.load("./textures/particles/symbol_02.png");
  gradientTexture.magFilter = THREE.NearestFilter;

  const objectSize = 1;
  const objectDistance = 8;

  const material = new THREE.MeshToonMaterial({
    gradientMap: gradientTexture,
    color: parameters.color,
    wireframe: parameters.wireframe,
  });

  const mesh1 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(objectSize, 0.4, 100, 16),
    material
  );
  const mesh2 = new THREE.Mesh(
    new THREE.TorusGeometry(objectSize, 0.4, 100, 16),
    material
  );
  const mesh3 = new THREE.Mesh(
    new THREE.CapsuleGeometry(objectSize * 0.8, 1, 32, 32),
    material
  );

  const group = new THREE.Group();
  group.add(mesh1, mesh2, mesh3);

  group.children.forEach((child, index) => {
    const isEven = index % 2 === 0;
    child.position.x = isEven ? 3 : -3;
    child.position.y = -index * objectDistance;
  });

  /**
   * Lights
   */
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(1, 0, 0);

  const pointMaterial = new THREE.PointsMaterial({
    color: parameters.color,
    size: 0.5,
    sizeAttenuation: true,
    alphaMap: particleTexture,
    transparent: true,
    depthWrite: false,
  });

  const particles = (() => {
    const particlesGeometry = (() => {
      const count = 250;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(
        (() => {
          const array = [];
          for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * sizes.width * 0.01;
            const y =
              (Math.random() - 0.5) * sizes.height * 0.01 * objectDistance;
            array.push(x, y, (Math.random() - 0.5) * 10);
          }
          return array;
        })()
      );

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      return geometry;
    })();

    return new THREE.Points(particlesGeometry, pointMaterial);
  })();

  scene.add(directionalLight, group, particles);

  const cursor = {
    x: 0,
    y: 0,
  };

  const onMouseMove = (event) => {
    const mouseX = (event.clientX / sizes.width) * 2 - 1;
    const mouseY = -(event.clientY / sizes.height) * 2 + 1;
    cursor.x = mouseX;
    cursor.y = mouseY;
  };

  const getNormalisedScrollY = () => {
    return window.scrollY / sizes.height;
  };

  let currentSection = 0;
  let positionY = -getNormalisedScrollY() * objectDistance;

  const onScroll = (event) => {
    const scrollYNormalized = getNormalisedScrollY();
    const sectionNumber = Math.round(scrollYNormalized);
    positionY = -scrollYNormalized * objectDistance;

    if (sectionNumber !== currentSection) {
      currentSection = sectionNumber;
      gsap.to(group.children[sectionNumber].rotation, {
        y: "+=6.28",
        duration: 1.5,
        ease: "power2.inOut",
      });
    }
  };

  window.addEventListener("scroll", onScroll);
  window.addEventListener("mousemove", onMouseMove);

  const clock = new THREE.Clock();
  let previousTime = 0;

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    camera.position.y = positionY;

    cameraGroup.position.x =
      cameraGroup.position.x +
      (cursor.x - cameraGroup.position.x) * 3 * deltaTime;
    cameraGroup.position.y =
      cameraGroup.position.y +
      (cursor.y - cameraGroup.position.y) * 3 * deltaTime;

    group.children.forEach((child) => {
      child.rotation.x += deltaTime * 0.1;
      child.rotation.y += deltaTime * 0.14;
      child.rotation.z += deltaTime * 0.1;
    });

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();

  gui.addColor(parameters, "color").onChange(() => {
    material.color.set(parameters.color);
    pointMaterial.color.set(parameters.color);
  });

  gui.add(parameters, "wireframe").onChange(() => {
    material.wireframe = parameters.wireframe;
  });

  return () => {
    window.removeEventListener("scroll", onScroll);
    gradientTexture.dispose();
    material.dispose();
    pointMaterial.dispose();
    group.children.forEach((child) => {
      child.geometry.dispose();
    });
  };
}
