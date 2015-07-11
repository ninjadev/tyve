function BlinkyTunnelLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.tunnel);
  this.musicThrob = 1;
  this.wallCanvas = document.createElement('canvas');
  this.wallCanvas.width = 32;
  this.wallCanvas.height = 18;
  this.wallCtx = this.wallCanvas.getContext('2d');
  this.shaderPass.uniforms.wall.value = new THREE.Texture(this.wallCanvas);
  this.shaderPass.uniforms.wall.value.magFilter = THREE.NearestFilter;
  this.shaderPass.uniforms.wall.value.minFilter = THREE.NearestFilter;
  this.colorRandom = Random('yolo');

  this.textOverlayLayer = new TextOverlayLayer({
    "config": {
      "title": "Transductor",
      "textColor": "black",
      "body": [
        "- pressure equalizing trenches",
        "- natural lighting",
        "- endless"
      ],
      "offset": {
        "x": 1.5,
        "y": 2
      }
    }
  });
  this.textOverlayLayer2 = new TextOverlayLayer({
    "config": {
      "title": "Metapearls",
      "textColor": "black",
      "body": [
        "- white as milk",
        "- premium taste",
        "- no sugar added"
      ],
      "offset": {
        "x": 1.5,
        "y": 2
      }
    }
  });
  this.shaderPass.uniforms.textImage.value = this.textOverlayLayer.texture;
  this.resize();
}


BlinkyTunnelLayer.prototype.resize = function() {
  this.textOverlayLayer.resize();
  this.textOverlayLayer2.resize();
};


BlinkyTunnelLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

BlinkyTunnelLayer.prototype.update = function(frame, relativeFrame) {
  var offset = 0;
  this.textOverlayLayer.update(frame - offset, relativeFrame - offset);
  var offset2 = 400;
  this.textOverlayLayer2.update(frame - offset2, relativeFrame - offset2);
  if(this.musicThrob > 0) {
    this.musicThrob *= 0.95;
  }
  if(BEAT && BEAN % 6 == 0) {
    this.musicThrob = 1;
  }
  this.shaderPass.uniforms.throb.value = this.musicThrob;
  this.shaderPass.uniforms.t.value = relativeFrame;
  this.shaderPass.uniforms.tunnelAmount.value = smoothstep(
      0, 1, (relativeFrame - 20) / 100);
  this.shaderPass.uniforms.opacity.value = smoothstep(
      0, 1, (relativeFrame) / 20);

  this.shaderPass.uniforms.metaballAmount.value = smoothstep(
      0, 1, (relativeFrame - 450) / 100);

  this.shaderPass.uniforms.textImage.value = this.textOverlayLayer.texture;
  if(frame > 2100) {
    this.shaderPass.uniforms.textImage.value = this.textOverlayLayer2.texture;
  }

  if(frame > 2641) {
    this.shaderPass.uniforms.opacity.value = smoothstep(
        1, 0, (frame - 2641) / 100);
  }

  if(frame > 2610) {
    this.shaderPass.uniforms.tunnelAmount.value = smoothstep(
        1, 4, (frame - 2610) / 100);
  }

  this.wallCtx.globalAlpha = 1 * this.musicThrob;
  var bgFromR = 10;
  var bgFromG = 30;
  var bgFromB = 10;
  var bgToR = 30;
  var bgToG = 50;
  var bgToB = 60;
  var lineFromR = 0xd8;
  var lineFromG = 0x8d;
  var lineFromB = 0x2c;
  var lineToR = 0x92 * 1.1;
  var lineToG = 0x9f * 1.1;
  var lineToB = 0xca * 1.1;
  var progress = (frame - 2220) / 10;
  this.wallCtx.fillStyle = ('rgb(' +
                            (smoothstep(bgFromR, bgToR, progress) | 0) + ',' +
                            (smoothstep(bgFromG, bgToG, progress) | 0) + ',' +
                            (smoothstep(bgFromB, bgToB, progress) | 0) + ')');
  this.wallCtx.fillRect(0, 0, 32, 18);
  this.wallCtx.fillStyle = ('rgb(' +
                            (smoothstep(lineFromR, lineToR, progress) | 0) + ',' +
                            (smoothstep(lineFromG, lineToG, progress) | 0) + ',' +
                            (smoothstep(lineFromB, lineToB, progress) | 0) + ')');

  var framesPerBeat = 32.727272727272727272727272727273;
  var progress = 0.5 * (1 + Math.sin(frame / framesPerBeat * Math.PI / 4));
  var linprog = frame / framesPerBeat / 3;
  linprog *= 18;
  linprog |= 0;
  progress *= 128;
  progress |= 0;
  this.wallCtx.fillRect(progress % 32, 0, 1, 18);
  this.wallCtx.fillRect(0, linprog % 18, 32, 1);

  this.shaderPass.uniforms.wall.value.needsUpdate = true;
};
