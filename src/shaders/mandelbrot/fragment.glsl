uniform float time;
uniform float frame;
uniform float stab;
uniform vec2 resolution;
uniform vec2 zoomCoordinate;
uniform sampler2D textImage;
uniform sampler2D tDiffuse;

#define PI 3.14159265358979323846
varying vec2 vUv;

const int depth = 256;

vec2 complexMult(vec2 a, vec2 b)
{
    float real = a.x * b.x - a.y * b.y;
    float complex = a.y * b.x + a.x * b.y;
    return vec2(real, complex);
}

float mandelbrot(vec2 c)
{
    vec2 z = vec2(0.0, 0.0);

    int depth_reached = 0;
    for (int i=0; i<depth; i++) {
        if (dot(z, z) > 4.0) {
            depth_reached = i;
            break;
        }
        z = complexMult(z, z) + c;
    }

    return float(depth_reached) / float(depth);
}


void main(void)
{
    float framesPerBeat = 32.727272727272727273;
    vec2 uv = (gl_FragCoord.xy / resolution);
    uv -= vec2(0.5, 0.5);

    vec3 color = vec3(0.56, 0.69, 0.60) * 0.8;

    float ratio = 16. / 9.;

    if(0.5 + uv.x * ratio + 1.> uv.y + mod(0. / 3. + frame / 127. - 1., 2.)) {
        uv.x -= 0.1 * stab;
        color *= 1. + stab * 0.8;
    }

    if(0.5 + uv.x * ratio + 1.> uv.y + mod(1. / 3. + frame / 127. - 1., 2.)) {
        uv.x -= 0.1 * stab;
        color *= 1. + stab * 0.8;
    }

    if(0.5 + uv.x * ratio + 1.> uv.y + mod(2. / 3. + frame / 127. - 1., 2.)) {
        uv.x -= 0.1 * stab;
        color *= 1. + stab * 0.8;
    }

    if(0.5 + uv.x * ratio + 1.> uv.y + mod(3. / 3. + frame / 127. - 1., 2.)) {
        uv.x -= 0.1 * stab;
        color *= 1. + stab * 0.8;
    }

    if(0.5 + uv.x * ratio + 1.> uv.y + mod(4. / 3. + frame / 127. - 1., 2.)) {
        uv.x -= 0.1 * stab;
        color *= 1. + stab * 0.8;
    }

    if(0.5 + uv.x * ratio + 1.> uv.y + mod(5. / 3. + frame / 127. - 1., 2.)) {
        uv.x -= 0.1 * stab;
        color *= 1. + stab * 0.8;
    }

    float zoom = pow(2.0, -time) * 3.5;
    zoom += 0.00005 * sin(frame / framesPerBeat * PI * 2.);

   vec2 lastTranslate = vec2(0., 0.);

   if(frame >= 6778. + 136.) {
        zoom -= mix(0., .003, clamp((frame - 6778. - 136.) / 100., 0., 1.));
        lastTranslate -= mix(vec2(0.),
                             vec2(0.005, -0.001),
                             clamp((frame - 6778. - 136.) / 100., 0., 1.));
   }

    uv *= vec2(3.5, 2.0) * zoom;
    /*
    */

    float angle = 0.02 * sin(frame / framesPerBeat * PI);
    uv = vec2(uv.x * cos(angle) - uv.y * sin(angle),
              uv.x * sin(angle) + uv.y * cos(angle));

    uv += zoomCoordinate + lastTranslate;

    /*
    */

    /*
    */

    vec4 textImageColor = texture2D(textImage, vUv);

    vec2 stepX = vec2(1. / resolution.x, 0.);
    vec2 stepY = vec2(0., 1. / resolution.y);
    float center = mandelbrot(uv);

    float mixer = 0.;
    if(center <= 0.1) {
        mixer = 0.;
    } else if(center > 0.1) {
        mixer = mix(1., 0., (center - 0.1) / 0.9);
    } else {
        mixer = 1.;
    }

    vec4 mandelbrotColor =
        mix(
            vec4(color * stab * 0.2, 1.0),
            vec4(vec3(color), 1.0),
            mixer);

    if(mixer < 0.1) {
        mandelbrotColor = texture2D(tDiffuse, vUv);
    }

    gl_FragColor = vec4(mix(1.0 - textImageColor.rgb, mandelbrotColor.rgb, 1.0 - textImageColor.a), 1.0);
}
