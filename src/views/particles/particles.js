import * as THREE from "three";
import { Timer } from "three/addons/misc/Timer.js";

export default function init({ scene, camera, renderer, gui, orbitControls }) {
  camera.position.set(0, 0, 4);

  const textureLoader = new THREE.TextureLoader();
  const particleTexture = textureLoader.load(
    "/textures/particles/circle_02.png"
  );

  const count = 20000;

  //   const particlesGeometry = new THREE.SphereGeometry(1, 16, 16);
  const particlesGeometry = (() => {
    const geometry = new THREE.BufferGeometry();
    // square
    // const vertices = new Float32Array([
    //   1,
    //   1,
    //   1, // top front right
    //   1,
    //   1,
    //   -1, // top back right
    //   1,
    //   -1,
    //   1, // bottom front right
    //   1,
    //   -1,
    //   -1, // bottom back right
    //   -1,
    //   -1,
    //   -1, // bottom back left
    //   -1,
    //   -1,
    //   1, // bottom front left
    //   -1,
    //   1,
    //   -1, // top back left
    //   -1,
    //   1,
    //   1, // top front left
    // ]);
    // const vertices = new Float32Array(
    //   Array(count)
    //     .fill()
    //     .reduce((acc, _, index) => {
    //       const factor = 20;
    //       const y = (index % factor) - factor / 2;
    //       const x =
    //         Math.sin(Math.floor(index / factor)) * (factor / 2 - Math.abs(y));
    //       const z =
    //         Math.cos(Math.floor(index / factor)) * (factor / 2 - Math.abs(y));
    //       return [...acc, x, y, z];
    //     }, [])
    // );
    const positionVertices = new Float32Array(count * 3);
    const colorVertices = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positionVertices[i] = (Math.random() - 0.5) * 10;
      colorVertices[i] = Math.random();
    }
    const positionsAttribute = new THREE.BufferAttribute(positionVertices, 3);
    geometry.setAttribute("position", positionsAttribute);

    const colorsAttribute = new THREE.BufferAttribute(colorVertices, 3);
    geometry.setAttribute("color", colorsAttribute);

    return geometry;
  })();
  const particlesMaterial = new THREE.PointsMaterial({
    // color: "hotpink",
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    size: 0.1,
    sizeAttenuation: true,
    alphaMap: particleTexture,
    transparent: true,
    depthWrite: false,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);

  // Add GUI control for particle color
  gui
    .addColor({ color: particlesMaterial.color.getHex() }, "color")
    .onChange((value) => {
      particlesMaterial.color.set(value);
    });

  scene.add(particles, ambientLight);

  const positionAttribute = particlesGeometry.attributes.position;

  const timer = new Timer();
  const clock = new THREE.Clock();

  const tick = () => {
    timer.update();
    const elapsedTime = clock.getElapsedTime();
    //animate particles
    particles.position.y = Math.sin(elapsedTime) * 0.5;
    particles.rotation.y = (elapsedTime * 0.1) % (2 * Math.PI);
    // for (let i = 0; i < count; i++) {
    //   positionAttribute.array[i * 3 + 1] = Math.sin(
    //     elapsedTime + positionAttribute.array[i * 3]
    //   );
    // }
    // positionAttribute.needsUpdate = true;

    orbitControls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();

  return () => {
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    particleTexture.dispose();
  };
}
