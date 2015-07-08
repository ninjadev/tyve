uniform float time;
uniform sampler2D tDiffuse;
varying vec2 vUv;

#define PI 3.14159265359
#define SLOWDOWN 0.8
#define STARTTIME 0.2
#define SHOCKTIME PI/SLOWDOWN
#define SOUNDSPEED 1.5

float cross(vec2 uv) {
    return 1.-abs(abs(uv.x-.5)-abs(uv.y-.5));
}

float dist(vec2 uv, float x, float y) {
    return sqrt(pow(abs(uv.x-x)*16./9.,2.)+ pow(abs(uv.y-y),2.));
}

vec2 deltaCoor(vec2 uv, vec2 center) {
    return vec2(uv.x-center.x, uv.y-center.y);
}

float shockwave(float rawX) {
    float x = rawX - STARTTIME/SLOWDOWN;
    float shock = sin(x*50.-PI)/(x*50.-PI);
    float squareFunction = ceil(x/1e10)-ceil((x-SHOCKTIME)/1e10);
    return shock*squareFunction*8.;
}

void main() {
    //vec2 uv = fragCoord.xy / iResolution.xy;

    /*float noiseX = (texture2D(iChannel1, vec2(vUv.x, vUv.y)).r-.5)/50.;
    float noiseY = (texture2D(iChannel1, vec2(vUv.y, vUv.x)).r-.5)/50.;
    */
    float noiseX = 0.0;
    float noiseY = 0.0;
    float d = dist(vUv, .5+noiseX,.5+noiseY);

    //float amp = shockwave(iGlobalTime/SLOWDOWN-d*SOUNDSPEED);
    float amp = shockwave(time/51.-d*SOUNDSPEED);
    float x = amp*(vUv.x-.5);
    float y = amp*(vUv.y-.5);

    vec4 image = texture2D(tDiffuse, vec2(vUv.x+x, vUv.y+y));
    gl_FragColor = image;
}
