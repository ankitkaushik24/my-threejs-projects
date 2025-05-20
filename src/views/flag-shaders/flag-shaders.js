import * as THREE from "three";
import vertexShader from "./flagVertexShader.vert?raw";
import flagFragmentShader from "./flagFragmentShader.frag?raw";

export default function init({
  renderer,
  scene,
  camera,
  orbitControls,
  sizes,
  gui,
}) {
  const clock = new THREE.Clock();

  // plane representing a flag
  const geometry = new THREE.PlaneGeometry(3, 2, 30, 18);
  // textureLoader
  const textureLoader = new THREE.TextureLoader();
  const flagTexture = textureLoader.load("/textures/india-flag.jpg");
  flagTexture.colorSpace = THREE.SRGBColorSpace;
  const count = geometry.attributes.position.count;
  let randoms = new Float32Array(count);
  randoms = randoms.map(() => Math.random());
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

  const uniforms = {
    uTime: { value: 1.0 },
    flagTexture: { value: flagTexture },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.DoubleSide,
    vertexShader: vertexShader,
    fragmentShader: flagFragmentShader,
    transparent: true,
  });

  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  camera.position.set(1, 1, 3);

  let frameId = null;

  const tick = () => {
    uniforms.uTime.value += clock.getDelta();
    orbitControls.update();
    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(tick);
  };

  tick();

  return () => {
    // Cancel the animation frame
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }

    // Dispose geometry, material, and texture
    geometry.dispose();
    material.dispose();
    flagTexture.dispose();
  };
}
