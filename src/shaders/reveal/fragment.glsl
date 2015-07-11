uniform sampler2D texture;
uniform float reveal;
uniform float alphaBound;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(texture, vUv);

    gl_FragColor = color;
    if(gl_FragColor.a > alphaBound){
        gl_FragColor.a = alphaBound;
    }

    if(vUv.x > reveal && vUv.x < reveal + 0.05){
       gl_FragColor.a *= 1. - ((vUv.x - reveal)/0.05);
    }else if(vUv.x >= reveal + 0.05){
       gl_FragColor.a = 0.;
    }

    if(reveal == 0.){
      gl_FragColor.a = 0.;
    }

}
