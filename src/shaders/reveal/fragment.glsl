uniform sampler2D texture;
uniform float reveal;
uniform float alphaBound;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(texture, vUv);

    vec4 outp = color;
    if(outp.a > alphaBound){
        outp.a = alphaBound;
    }

    if(vUv.x > reveal && vUv.x < reveal + 0.05){
       outp.a *= 1. - ((vUv.x - reveal)/0.05);
    }
    else if(vUv.x >= reveal + 0.05){
       outp.a = 0.5;
    }

    if(reveal == 0.){
      outp.a = 0.;
    }

    gl_FragColor = outp;
}
