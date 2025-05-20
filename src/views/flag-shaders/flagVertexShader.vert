uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main() {
  vec3 pos = position;
  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

  // Create wave motion
  float frequency = 3.0;
  float amplitude = 0.2;
  float wave = sin(modelPosition.x * frequency + uTime * 2.0);

  // Add secondary wave for more complexity
  wave += sin(modelPosition.x * frequency * 1.5 + uTime * 3.0) * 0.5;

  float elevation = wave * amplitude;
  modelPosition.z += elevation;

  // Add slight y-axis movement
  modelPosition.y +=
    cos(modelPosition.x * frequency * 0.5 + uTime) * amplitude * 0.7;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  vUv = uv;
  vElevation = elevation;
}
