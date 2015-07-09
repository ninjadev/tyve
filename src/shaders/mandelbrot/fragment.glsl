uniform float time;
uniform vec2 resolution;
uniform vec2 zoomCoordinate;
uniform sampler2D textImage;

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
    vec2 uv = (gl_FragCoord.xy / resolution);
    uv = vec2(uv.x * 3.5 - 2.5, uv.y * 2.0 - 1.0);

    float zoom = pow(2.0, -time) * 3.5;
    vec2 c = zoomCoordinate + uv * zoom;

    vec4 textImageColor = texture2D(textImage, vUv);

    vec2 stepX = vec2(1. / resolution.x, 0.);
    vec2 stepY = vec2(0., 1. / resolution.y);
    float center = mandelbrot(c);

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
            vec4(.0, .0, .0, 1.0),
            vec4(0.56, 0.69, 0.60, 1.0),
            mixer);

    gl_FragColor = vec4(mix(1.0 - textImageColor.rgb, mandelbrotColor.rgb, 1.0 - textImageColor.a), 1.0);
}
