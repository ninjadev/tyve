uniform float time;
uniform sampler2D tDiffuse;
uniform sampler2D bg;
uniform float bgEnabled;

varying vec2 vUv;


mat3 gx = mat3(
        1.0,  2.0,  1.0,
        0.0,  0.0,  0.0,
        -1.0, -2.0, -1.0
        );

mat3 gy = mat3(
        -1.0, 0.0, 1.0,
        -2.0, 0.0, 2.0,
        -1.0, 0.0, 1.0
        );

vec3 edgeColor = vec3(1.0, 0.5, 0.75);

float intensity(vec3 pixel) {
    return (pixel.r + pixel.g + pixel.b) / 3.0;
}

float pixelIntensity(vec2 vUv, vec2 d) {
    vec3 pix = texture2D(tDiffuse, vUv + d*2. / vec2(1600.,900.)).rgb;
    return intensity(pix);
}


float convolv(mat3 a, mat3 b) {
    float result = 0.0;

    for (int i=0; i<3; i++) {
        for (int j=0; j<3; j++) {
            result += a[i][j] * b[i][j];
        }
    }

    return result;
}

float sobel(vec2 vUv) {
    mat3 pixel = mat3(0.0);

    for (int x=-1; x<2; x++) {
        for (int y=-1; y<2; y++) {
            pixel[x+1][y+1] = pixelIntensity(vUv, vec2(float(x), float(y)));
        }
    }

    float x = convolv(gx, pixel);
    float y = convolv(gy, pixel);

    return sqrt(x * x + y * y);
}

void main() {
    float width = .01;
    vec4 pixel = texture2D(tDiffuse, vec2(vUv.x, vUv.y));
    vec4 right = texture2D(tDiffuse, vec2(vUv.x+width, vUv.y));
    vec4 up = texture2D(tDiffuse, vec2(vUv.x, vUv.y+width));
    float pixelSum = pixel.r+pixel.g+pixel.b;
    float rightSum = right.r+right.g+right.b;
    float upSum = up.r+up.g+up.b;
    float edge = abs(pixelSum-rightSum)+abs(pixelSum-upSum);

    float s = sobel(vUv);
    edge = clamp(edge,0.,1.);

    float blackboard = texture2D(tDiffuse,vUv).r;

    //float color = max(edge,0.)*(blackboard*.3)+blackboard*.3;
    float color = max(s,0.)*(blackboard)+blackboard*.3;
    
    vec4 outp;
    outp = pixel + clamp(vec4(color*4.-2.),0.,1.);
    if(bgEnabled == 1.0 && outp.r < 0.1) {
        outp = texture2D(bg, vUv);
    }
    gl_FragColor = outp;
}
