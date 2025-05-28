uniform float uTime;
varying vec2 vUv;

void main() {
  vec4 modelposition = modelMatrix * vec4(position, 1.0);
  // float elevation = sin(modelposition.x * 10.0 + uTime) * 0.2;
  // elevation *= sin(modelposition.y * 5.0 + uTime) * 0.5;
  // modelposition.y += elevation;
  gl_Position = projectionMatrix * viewMatrix * modelposition;

  vUv = uv;
}
