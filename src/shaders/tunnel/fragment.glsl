uniform sampler2D tDiffuse;
uniform sampler2D wall;
uniform sampler2D textImage;
uniform float t;
uniform float tunnelAmount;
uniform float throb;
uniform float opacity;
varying vec2 vUv;


void main(void)
{
    vec2 uv = vUv;

    vec2 center = vec2(0.5, 0.5);

    center.x += .2 * sin(t * 0.017) * tunnelAmount;
    center.y += .2 * cos(t * 0.015) * tunnelAmount;

    vec2 dist = (uv - center);
    dist.x *= 16.;
    dist.y *= 9.;
    float radius = 9. / length(dist) + t * 0.05;
    uv = mix(
            uv,
            mod(vec2(6. / 3.1415926535 / 2. * atan(dist.y / 16., dist.x / 16.) + 2. * sin(t * 0.005) / length(dist) + t * 0.002,
                     radius),
                1.),
            tunnelAmount);

    vec2 tiles = vec2(32., 18.);

    vec4 diffuse = texture2D(tDiffuse, (0.5 + floor(uv * tiles)) / tiles);
    vec4 wallDiffuse = texture2D(wall, 0.01 + floor(uv * tiles) / tiles);
    float p = 1.0 - (diffuse.r + diffuse.g + diffuse.b) / 3.;
    p = min(max(p * 3.0 - 1.8, 0.1), 10.0);
    p = 1.;
    
    vec2 r = mod(uv * tiles, 1.0);
    r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
    p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);
    wallDiffuse *= p;

    float lighting = 1. - 4. * pow(length(dist) / 16. - 0.5, 2.);
    lighting = clamp(0., 1., lighting);

    p = p * mix(1., throb * lighting, tunnelAmount);

    
    float centerDarkener = mix(1., length(dist * 4.) / length(center * 16.),
        tunnelAmount);

    vec4 orangeLighting = 1. - 8. * pow(length(dist) / 16. - 0.5, 2.) *
        vec4(9., .6, .0, .1);

    vec4 outp = diffuse * p + wallDiffuse * throb * centerDarkener + orangeLighting * 0.01;

    if(t >= 1250.) {
        outp = mix(outp, outp + vec4(1.), smoothstep(0., 1., (t - 1250.) / 20.));
    }

    vec4 textImageColor = texture2D(textImage, vUv);
    outp = vec4(mix(outp.xyz, 1. - textImageColor.xyz, textImageColor.a), 1.);

    gl_FragColor = mix(
        texture2D(tDiffuse, vUv),
        outp,
        opacity);
}
