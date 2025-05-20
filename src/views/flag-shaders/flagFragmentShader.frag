uniform sampler2D flagTexture;

varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 texture = texture2D(flagTexture, vUv);
  texture.rgb += vElevation * 0.5;

  gl_FragColor = texture;
}
