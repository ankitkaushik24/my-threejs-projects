#define PI (3.14159265358979323846)

varying vec2 vUv;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

uniform float uTime;
uniform float uOffset;

//	Classic Perlin 2D Noise
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x) {
  return mod((x * 34.0 + 1.0) * x, 289.0);
}
vec2 fade(vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm =
    1.79284291400159 -
    0.85373472095314 *
      vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// rotate a vector by an angle
vec2 rotate(vec2 v, float angle, vec2 center) {
  float s = sin(angle);
  float c = cos(angle);
  mat2 m = mat2(c, -s, s, c);
  return m * (v - center) + center;
}

void main() {
  // Create a gradient from blue to purple

  vec3 color1 = vec3(1.0, 32.0 / 255.0, 224.0 / 255.0);
  vec3 color2 = vec3(211.0 / 255.0, 65.0 / 255.0, 224.0 / 255.0);
  vec3 color3 = vec3(109.0 / 255.0, 218.0 / 255.0, 228.0 / 255.0);

  // Use the fragment's y-coordinate to create the gradient
  // float gradient = gl_FragCoord.y / 800.0; // 800 is an approximate height, adjust if needed

  // Mix the colors based on the gradient
  //   vec3 finalColor = mix(uColor1, uColor2, gradient);

  //   vec3 c1 = (1.0 - vUv.x * vUv.y) * uColor1;
  //   vec3 c2 = vUv.x * uColor2;
  //   vec3 c3 = vUv.x * vUv.y * uColor3;

  //   float crossX = step(0.8, mod(vUv.x * 10.0, 1.0));
  //   float crossY = step(0.8, mod(vUv.y * 10.0, 1.0));

  //   float x = vUv.x;
  //   float y = vUv.y;

  //   float barX =
  //     step(0.3, mod(x * 10.0, 1.0)) * step(0.8, mod(y * 10.0 + uOffset, 1.0));

  //   float barY =
  //     step(0.3, mod(y * 10.0, 1.0)) * step(0.8, mod(x * 10.0 + uOffset, 1.0));
  //   float color = abs(sin(vUv.x * 2.0 - 1.0)) * 0.7;
  //   color = mod((vUv.x - 0.5) * 2.0, 1.0);
  //   float midX = abs(vUv.x - 0.5);
  //   float midY = abs(vUv.y - 0.5);
  // float threshold = vUv.x + 0.2;

  // 0     10        20       30       40       50
  // 0  5  10  13    20
  // 13 % 10 => 3
  // 13 / 10 => 1 * 10 + 10

  //   float divisions = 10.0;
  //   float normalised = 1.0 / 10.0;

  //   float shade = (floor(vUv.x / normalised) + normalised) / divisions; // 1 2 3 4 5

  //   float shadeX = floor(vUv.x * 10.0) / 10.0;
  //   float shadeY = floor(vUv.y * 10.0) / 10.0;

  //   float y = vUv.y + vUv.x;

  // generate a random value from 0 to 1
  //   float random = fract(
  //     sin(dot(floor(vec2(vUv.x, y) * 10.0) / 10.0, vec2(12.9898, 78.233))) *
  //       43758.5453
  //   );

  // vec2 wave = vec2(
  //   vUv.x + sin(vUv.y * 60.0 + uTime * 10.0) / 10.0,
  //   vUv.y + sin(vUv.x * 60.0 + uTime * 10.0) / 10.0
  // );

  // float ring = 1.0 - step(0.01, abs(length(wave - 0.5) - 0.4));
  // 1.55740772
  // vec2 st = vUv * 2.0 - 1.0;
  // float xColor = (atan(st.x, st.y) + PI) / (PI * 2.0);
  // xColor *= 10.0;
  // xColor = sin(xColor * 8.0);

  // float tan = (atan(st.x, st.y) + PI) / (PI * 2.0);
  // float sintan = sin(tan * 80.0);
  // float radius = 0.6 + sintan * 0.2;
  // float d = length(st) - radius;
  // float xColor = step(0.01, abs(d));

  // float xBar =
  //   step(0.3, mod(vUv.x * 10.0 - uOffset, 1.0)) *
  //   step(0.8, mod(vUv.y * 10.0 + uOffset, 1.0));

  // float yBar =
  //   step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.3, mod(vUv.y * 10.0, 1.0));

  // float color = abs(vUv.x - 0.5);
  // float yColor = abs(vUv.y - 0.5);

  // float square = step(0.1, abs(max(color, yColor) - 0.2));

  // float colorX = ceil(vUv.x * 10.0) / 10.0;
  // float colorY = ceil((vUv.y + vUv.x * vUv.y) * 10.0) / 10.0;
  // //colorX * colorY
  // float randomP = random(vec2(colorX, colorY));

  // vec2 st = rotate(vUv, PI / 4.0, vec2(0.5, 0.5)) * 2.0 - 1.0;

  // // st = rotate(st, PI / 4.0, vec2(0.0, 0.0));

  // float dX = 0.15 / length(vec2(st.x * 5.0, st.y));
  // float dY = 0.15 / length(vec2(st.x, st.y * 5.0 + 0.1));

  // vec2 st = vUv * 2.0 - 1.0;
  // float angle = (atan(st.x, st.y) + PI) / (PI * 2.0);
  // float angle2 = mod(angle * 20.0, 1.0);
  // float angle3 = sin(angle * 100.0);
  // st = vec2(
  //   st.x + sin(st.y * 30.0 + uTime) * 0.5,
  //   st.y + sin(st.x * 30.0 + uTime) * 0.5
  // );
  // float radius = 0.5;
  // float d = abs(length(st) - radius);
  // float d2 = 1.0 - step(0.02, d * 10.0);
  vec2 st = vUv * 2.0 - 1.0;
  // float tan = (atan(st.x, st.y) + PI) / (PI * 2.0);
  // float radius = 0.5 + sin(tan * 100.0) * 0.1;
  // float d = abs(length(st) - radius);
  // float d2 = 1.0 - step(0.01, d);

  float colorX = ceil(vUv.x * 10.0) / 10.0;
  float colorY = ceil((vUv.y + vUv.x * vUv.y) * 10.0) / 10.0;

  float factor = cnoise(vUv * 10.0 * uOffset);
  float processedNoise = smoothstep(0.0, 0.5, sin(factor * 10.0 + uTime));
  vec3 color = vec3(0.0);
  vec3 gradient = vec3(st, 0.5);

  vec3 mixColor = mix(color, gradient, processedNoise);

  gl_FragColor = vec4(mixColor, 1.0);
}
