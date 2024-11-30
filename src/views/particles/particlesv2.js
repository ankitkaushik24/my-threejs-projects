import * as THREE from "three";
import { Timer } from "three/addons/misc/Timer.js";

export default function init({ scene, camera, renderer, orbitControls, gui }) {
  camera.position.set(3, 1, 8);
  const parameters = {
    count: 100000,
    radius: 10,
    speed: 1,
    wavelength: 1,
    color: 0x601dc3,
  };

  const particlesGeometry = () => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < parameters.count; i++) {
      const v = () => (Math.random() - 0.5) * parameters.radius;
      vertices.push(v(), 0, v());
    }
    const positions = new Float32Array(vertices);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  };
  const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.color,
    size: 1.5,
    sizeAttenuation: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(particlesGeometry(), particlesMaterial);
  scene.add(particles);

  const timer = new Timer();

  const updateParticles = () => {
    particles.geometry.dispose();
    particles.geometry = particlesGeometry();
  };

  const animateParticles = (elapsedTime) => {
    const positionAttribute = particles.geometry.attributes.position;
    for (let i = 0; i < parameters.count; i++) {
      positionAttribute.array[i * 3 + 1] =
        Math.sin(
          (elapsedTime + positionAttribute.array[i * 3]) * parameters.speed
        ) * parameters.wavelength;
    }
    positionAttribute.needsUpdate = true;
  };

  const interval = setInterval(() => {
    timer.update();
    animateParticles(timer.getElapsed());
  }, 0);

  gui
    .add(parameters, "count", 100, 100000)
    .step(100)
    .name("count")
    .onFinishChange(updateParticles);
  gui
    .add(parameters, "radius", 5, 20)
    .step(1)
    .name("radius")
    .onFinishChange(updateParticles);

  gui.add(parameters, "speed", 0.1, 10).step(0.1).name("speed");
  gui.add(parameters, "wavelength", 0.1, 10).step(0.1).name("wavelength");

  gui
    .addColor(parameters, "color")
    .name("color")
    .onChange((value) => {
      particlesMaterial.color.set(value);
    });

  const tick = () => {
    orbitControls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();

  return () => {
    window.clearInterval(interval);
    particles?.geometry.dispose();
    particlesMaterial.dispose();
  };
}
