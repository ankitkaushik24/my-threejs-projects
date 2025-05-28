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

  // Noise-based foam effect using model position
  //   float foamNoise = 0.0;
  //   float foamFreq = 5.0;
  //   float foamAmp = 1.0;
  //   foamNoise +=
  //     cnoise(
  //       vec2(
  //         vModelPosition.x * foamFreq + uTime * 0.5,
  //         vModelPosition.z * foamFreq + uTime * 0.4
  //       )
  //     ) *
  //     foamAmp;
  //   foamNoise +=
  //     cnoise(
  //       vec2(
  //         vModelPosition.x * foamFreq * 2.0 - uTime * 0.3,
  //         vModelPosition.z * foamFreq * 2.0 + uTime * 0.6
  //       )
  //     ) *
  //     (foamAmp * 0.5);
  //   foamNoise +=
  //     cnoise(
  //       vec2(
  //         vModelPosition.x * foamFreq * 4.0 + uTime * 0.7,
  //         vModelPosition.z * foamFreq * 4.0 - uTime * 0.5
  //       )
  //     ) *
  //     (foamAmp * 0.25);

  //   // Combine noise and elevation for foam, adjust threshold and sharpness
  //   float foam = smoothstep(-0.2, 0.5, foamNoise + vElevation * 2.0); // Adjust thresholds to control foam amount

  //   vec3 foamColor = vec3(1.0);
  //   baseColor = mix(baseColor, foamColor, foam);

  //   // Simple depth-based darkening (optional, refine as needed)
  //   float depth = 1.0 - elevationNorm;
  //   baseColor *= 1.0 - depth * 0.1; // Reduced darkening strength

  gl_FragColor = vec4(baseColor, 1.0);
}
