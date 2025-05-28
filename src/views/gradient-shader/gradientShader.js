import * as THREE from "three";
import vertexShader from "./gradient.vert?raw";
import fragmentShader from "./gradient.frag?raw";

export default function init({
  scene,
  camera,
  renderer,
  orbitControls,
  sizes,
  gui,
}) {
  let frameId = null;

  // Create uniforms for the shader
  const uniforms = {
    uColor1: { value: new THREE.Color(0.0, 0.0, 1.0) }, // Blue
    uColor2: { value: new THREE.Color(0.5, 0.0, 0.5) }, // Purple
    uColor3: { value: new THREE.Color(1.0, 0.0, 0.5) },
    uTime: { value: 0.0 },
    uOffset: { value: 2.0 },
  };

  const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 64);
  const sphereMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  scene.add(sphere);

  // Add GUI controls for colors
  // gui.addColor(uniforms.uColor1, "value").name("Color 1");
  // gui.addColor(uniforms.uColor2, "value").name("Color 2");
  // gui.addColor(uniforms.uColor3, "value").name("Color 3");
  gui.add(uniforms.uOffset, "value", 0.5, 4, 0.1).name("Offset");

  camera.position.set(0, 0, 1);

  const clock = new THREE.Clock();

  const tick = () => {
    uniforms.uTime.value = clock.getElapsedTime();
    orbitControls.update();
    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(tick);
  };

  tick();

  // dispose
  return () => {
    window.cancelAnimationFrame(frameId);
    planeGeometry.dispose();
    planeMaterial.dispose();
  };
}
// vec3 palette( in float t)
// {
//     vec3 a = vec3(0.5, 0.5, 0.5);
//     vec3 b = vec3(0.5, 0.5, 0.5);
//     vec3 c = vec3(1.0, 1.0, 1.0);
//     vec3 d = vec3(0.30, 0.20, 0.20);

//     return a + b*cos( 6.283185*(c*t+d) );
// }

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
//     vec2 uv0 = (fragCoord/iResolution.xy * 2.0 - 1.0) * iResolution.xy /iResolution.y ;
//     vec2 uv = (fract(uv0) - 0.5) * 2.0;

//     float d = length(uv);
//     vec3 color = palette(length(uv0) + iTime * 0.5);

//     float gradient = 0.02 / abs(sin(d * 8. + iTime) / 8.);

//     fragColor = vec4(color * vec3(gradient),1.0);
// }
