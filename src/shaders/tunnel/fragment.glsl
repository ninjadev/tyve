uniform sampler2D tDiffuse;
uniform sampler2D wall;
uniform sampler2D textImage;
uniform float t;
uniform float tunnelAmount;
uniform float metaballAmount;
uniform float throb;
uniform float opacity;
varying vec2 vUv;


float metaball(vec3 p){
    float fv[5];
    float tt = t * 0.01;
    fv[0] = length(p - vec3(2.0 * sin(tt + 3.14), 0.1, 2.0 * cos(tt + 3.1)));
    fv[1] = length(p - vec3(3.1 * sin(tt), sin(tt), 1.0 * cos(tt * 0.7)));
    fv[2] = length(p - vec3(1.2 * sin(tt), 2.0 * cos(tt * 1.4), 5.0 * cos(tt + 2.1)));
    fv[3] = length(p - vec3(2.0 * cos(tt), 2.0 * cos(tt * 1.3), 1.5 * cos(tt)));
    fv[4] = length(p - vec3(2.5 * sin(tt * 0.3), 2.0 * cos(tt * 1.6), 0.5 * sin(tt)));
    float len = 0.0;
    float fs = .5;
    for (int i = 0; i < 5; i ++) {
        len += fs / (fv[i] * fv[i]);
    }
    return 1. - min(16.0, len);
}


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

    /* metaballs */
    vec3 camera_pos = vec3(0.0, 0.0, -23.0);
    vec3 org = vec3(center - vUv, -22.);
    vec3 dir = normalize(org - camera_pos);
    vec3 P = org.xyz;
    float d;
    for (int i = 0; i < 64; i++) {
        d = metaball(P.xyz * (11. - 10. * metaballAmount));
        P = P + d * dir;
    }
    float fg=min(1.0,20.0/length(P-org));
    vec4 col = vec4(vec3(fg),1)*fg*fg;
    col *= vec4(.9, .9, .9, 1.);
    vec4 orangeLighting = 1. - 8. * pow(length(dist) / 16. - 0.5, 2.) *
        vec4(9., .9, .9, .1);

    vec4 black = vec4(vec3(0.), 1);
    col = mix(black, col, metaballAmount);
    orangeLighting = mix(black, orangeLighting, metaballAmount);

    vec4 outp = diffuse * p + wallDiffuse * throb * centerDarkener + orangeLighting * 0.01;
    if(length(col.xyz) > 0.1) {
        outp = col;
    }

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
