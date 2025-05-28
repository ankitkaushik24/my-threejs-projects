uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uTime;
uniform float uAmp;

varying float vElevation;
varying vec3 vModelPosition;

void main() {
  // Smoother color transition based on elevation
  float multiplier = 1.0 / (uAmp * 2.0);
  float elevationNorm = (vElevation + uAmp) * multiplier + 0.2;
  //   clamp((vElevation + uAmp) * multiplier, 0.0, 1.0);

  vec3 baseColor = mix(uDepthColor, uSurfaceColor, elevationNorm);

  gl_FragColor = vec4(baseColor, 1.0);
}
