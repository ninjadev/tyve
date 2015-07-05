varying mediump vec2 vUv;
uniform sampler2D tDiffuse;

const float RADIUS = 0.85;
const float SOFTNESS = 0.65;

void main() {
    vec2 position = vUv / vec2(0.6,1.0) - vec2(0.8,0.5) ;
    float len = length(position);
    float vignette = 1.0 - smoothstep(RADIUS, RADIUS - SOFTNESS, len);
    float r = texture2D(tDiffuse, vUv - (vignette * (position * (len * 0.015)))).r;
    float g = texture2D(tDiffuse, vUv).g;
    float b = texture2D(tDiffuse, vUv + (vignette * (position * (len * 0.015)))).b;
    gl_FragColor = vec4(r, g, b, 1.0);
}
