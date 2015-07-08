varying mediump vec2 vUv;
uniform sampler2D tDiffuse;
uniform mediump float GU;


float intensity(in vec4 color){
    float gamma = 2.2;
    return (.2126 * pow(color.r, gamma) +
            .7152 * pow(color.g, gamma) +
            .0722 * pow(color.b, gamma));
}

float sobel(float stepx, float stepy, vec2 center){
    // get samples around pixel
    float tleft = intensity(texture2D(tDiffuse,center + vec2(-stepx,stepy)));
    float left = intensity(texture2D(tDiffuse,center + vec2(-stepx,0)));
    float bleft = intensity(texture2D(tDiffuse,center + vec2(-stepx,-stepy)));
    float top = intensity(texture2D(tDiffuse,center + vec2(0,stepy)));
    float bottom = intensity(texture2D(tDiffuse,center + vec2(0,-stepy)));
    float tright = intensity(texture2D(tDiffuse,center + vec2(stepx,stepy)));
    float right = intensity(texture2D(tDiffuse,center + vec2(stepx,0)));
    float bright = intensity(texture2D(tDiffuse,center + vec2(stepx,-stepy)));
    float x = tleft + 2.0*left + bleft - tright - 2.0*right - bright;
    float y = -tleft - 2.0*top - tright + bleft + 2.0 * bottom + bright;
    float color = sqrt((x*x) + (y*y));
    return color;
 }

void main() {
    float width = GU * 16.;
    float height = GU * 9.;
    float edge = sobel(1. / width, 1. / height, vUv);
    float lowerBound = 0.5;
    float upperBound = 0.9;
    if(edge < upperBound) {
        edge = mix(0., lowerBound, (edge - lowerBound) / (upperBound - lowerBound));
    }
    edge = 1. - edge;

    vec4 color = texture2D(tDiffuse, vUv);
    float posterizeSteps = 3.;
    float posterized = intensity(color);
    if(posterized < 0.3) {
        posterized = 0.6;
    } else if (posterized < 0.8){
        posterized = 0.8;
    } else {
        posterized = 1.;
    }

    gl_FragColor = vec4(color.xyz * posterized * (0.8 + 0.2 * edge), 1.);
}
