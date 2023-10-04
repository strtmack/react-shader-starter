export default `precision highp float;
uniform sampler2D uTexture;
varying vec2 vUv;
uniform vec2 uMouse;
uniform float uBulge;

const float radius = 0.95;
const float strength = 1.1;

vec2 bulge(vec2 uv, vec2 center) {
  uv -= center;
  
  float dist = length(uv) / radius; // distance from UVs top right corner
  float distPow = pow(dist, 2.); // exponential
  float strengthAmount = strength / (1.0 + distPow); // Invert bulge and add a minimum of 1)
  // uv *= strengthAmount; 
  uv *= (1. - uBulge) + uBulge * strengthAmount;

  uv += center;

  return uv;
}

void main() {
  vec2 center = vec2(0.5, 0.5);
  vec2 bulgeUV = bulge(vUv, uMouse);
  vec4 tex = texture2D(uTexture, bulgeUV);
  gl_FragColor.rgb = tex.rgb;
  gl_FragColor.a = 1.0;
}`