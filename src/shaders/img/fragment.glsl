varying mediump vec2 vUv;
uniform sampler2D img;

void main() {
    gl_FragColor = texture2D(img, vUv);
}
