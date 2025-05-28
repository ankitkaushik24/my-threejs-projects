import * as THREE from "three";
import vertexShader from "./sea.vert?raw";
import fragmentShader from "./sea.frag?raw";

export default function init({
  scene,
  camera,
  renderer,
  orbitControls,
  sizes,
  gui,
}) {
  camera.position.set(-0.8, 0.8, 1.6);

  const colors = {
    depthColor: "#021b6e",
    surfaceColor: "#59a0c9",
  };

  const uniforms = {
    uTime: { value: 0.0 },
    uDepthColor: { value: new THREE.Color(colors.depthColor) },
    uSurfaceColor: { value: new THREE.Color(colors.surfaceColor) },
    // Wave parameters
    uFreq: { value: 2.0 },
    uAmp: { value: 0.12 },
    uSpeed: { value: 0.65 },
    uFreqZ: { value: 5.0 },
    // Noise parameters
    uNoiseAmp: { value: 0.15 },
    uNoiseFreq: { value: 3.0 },
    uNoiseSpeed: { value: 0.5 },
  };

  const planeGeometry = new THREE.PlaneGeometry(3, 3, 512, 512);
  const planeMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x -= Math.PI / 2 - 0.1;
  scene.add(plane);

  gui
    .addColor(colors, "depthColor")
    .name("Depth Color")
    .onChange((value) => {
      uniforms.uDepthColor.value.set(value);
    });
  gui
    .addColor(colors, "surfaceColor")
    .name("Surface Color")
    .onChange((value) => {
      uniforms.uSurfaceColor.value.set(value);
    });

  // Add GUI controls for wave parameters
  const waveFolder = gui.addFolder("Waves");
  waveFolder.add(uniforms.uFreq, "value", 0.1, 20.0).step(1).name("Freq X");
  waveFolder.add(uniforms.uFreqZ, "value", 0.1, 20.0).step(1).name("Freq Z");
  waveFolder.add(uniforms.uAmp, "value", 0.0, 1.0).name("Amplitude");
  waveFolder.add(uniforms.uSpeed, "value", 0.0, 5.0).name("Speed");
  waveFolder.open();

  const noiseFolder = gui.addFolder("Noise");
  noiseFolder.add(uniforms.uNoiseAmp, "value", 0.0, 1.0).name("Amplitude");
  noiseFolder
    .add(uniforms.uNoiseFreq, "value", 0.1, 20.0)
    .step(1)
    .name("Frequency");
  noiseFolder.add(uniforms.uNoiseSpeed, "value", 0.0, 5.0).name("Speed");
  noiseFolder.open();

  let frameId = null;
  const clock = new THREE.Clock();

  const tick = () => {
    uniforms.uTime.value = clock.getElapsedTime();
    orbitControls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  tick();

  // dispose
  return () => {
    window.cancelAnimationFrame(frameId);
  };
}
