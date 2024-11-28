import { coreInit } from "../../utils";
import * as THREE from "three";
import { Timer } from "three/addons/misc/Timer.js";

export default function init() {
  const { scene, camera, renderer, gui, orbitControls } = coreInit();

  camera.position.set(3, 3, 3);

  const parameters = {
    count: 100000,
    size: 0.01,
    branches: 4,
    radius: 5,
    spin: 1.4,
    randomize: 0.86,
    randomnessFactor: 2.3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  };

  let points = null;
  let geometry = null;
  let material = null;

  const generateGalaxy = () => {
    if (points !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(points);
    }
    const insideColor = new THREE.Color(parameters.insideColor);
    const outsideColor = new THREE.Color(parameters.outsideColor);
    geometry = new THREE.BufferGeometry();
    const vertices = (() => {
      const positions = [];
      const colors = [];
      for (let i = 0; i < parameters.count; i++) {
        // position
        const angle =
          ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
        const radius = Math.random() * parameters.radius;
        const spin = radius * parameters.spin;
        const randomness = () =>
          Math.pow(
            Math.random() * parameters.randomize,
            parameters.randomnessFactor
          ) * Math.sign(Math.random() - 0.5);
        const x = Math.cos(angle + spin) * radius + randomness();
        const y = randomness();
        const z = Math.sin(angle + spin) * radius + randomness();
        positions.push(x, y, z);

        // color
        const baseColor = insideColor.clone();
        const blendColor = baseColor.lerp(
          outsideColor,
          radius / parameters.radius
        );
        colors.push(blendColor.r, blendColor.g, blendColor.b);
      }
      return { positions, colors };
    })();
    const positions = new Float32Array(vertices.positions);
    const colors = new Float32Array(vertices.colors);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // material
    material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });
    points = new THREE.Points(geometry, material);
    scene.add(points);
  };

  generateGalaxy();

  gui
    .add(parameters, "count")
    .min(100)
    .max(1000000)
    .step(100)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "size")
    .min(0.001)
    .max(0.1)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "radius")
    .min(0.01)
    .max(20)
    .step(0.01)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "branches")
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "spin")
    .min(-5)
    .max(5)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "randomize")
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "randomnessFactor")
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
  gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

  const timer = new Timer();

  const tick = () => {
    timer.update();
    const elapsedTime = timer.getElapsed();
    points.rotation.y = elapsedTime * 0.04;

    orbitControls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };

  tick();
}
