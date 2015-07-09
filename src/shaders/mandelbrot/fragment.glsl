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

    return 1.0 - float(depth - depth_reached) / float(depth);
}


void main(void)
{
    vec2 uv = (gl_FragCoord.xy / resolution);
    uv = vec2(uv.x * 3.5 - 2.5, uv.y * 2.0 - 1.0);

    float zoom = pow(2.0, -time) * 3.5;
    vec2 c = zoomCoordinate + uv * zoom;

    vec4 textImageColor = texture2D(textImage, vUv);
    vec4 mandelbrotColor =
      mandelbrot(c) > 0.1 ?
        vec4(0.56, 0.69, 0.60, 1.0) :
        vec4(.0, .0, .0, 1.0);

    gl_FragColor = vec4(mix(1.0 - textImageColor.rgb, mandelbrotColor.rgb, 1.0 - textImageColor.a), 1.0);
}
