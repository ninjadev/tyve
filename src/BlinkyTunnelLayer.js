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
      "title": "Tunnel",
      "textColor": "black",
      "body": [
        "- pressure equalizing ducts",
        "- natural lighting",
        "- endless"
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
};


BlinkyTunnelLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

BlinkyTunnelLayer.prototype.update = function(frame, relativeFrame) {
  var offset = 400;
  this.textOverlayLayer.update(frame - 400, relativeFrame - 400);
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

  if(frame > 2641) {
    this.shaderPass.uniforms.opacity.value = smoothstep(
        1, 0, (frame - 2641) / 100);
  }

  if(frame > 2610) {
    this.shaderPass.uniforms.tunnelAmount.value = smoothstep(
        1, 4, (frame - 2610) / 100);
  }

  this.wallCtx.globalAlpha = 1 * this.musicThrob;
  this.wallCtx.fillStyle = 'rgb(10, 30, 10)';
  this.wallCtx.fillRect(0, 0, 32, 18);
  this.wallCtx.fillStyle = '#d88d2c';

  var framesPerBeat = 32.727272727272727272727272727273;
  var progress = 0.5 * (1 + Math.sin(frame / framesPerBeat * Math.PI / 4));
  var linprog = frame / framesPerBeat / 3;
  linprog *= 18;
  linprog |= 0;
  progress *= 128;
  progress |= 0;
  console.log(linprog);
  this.wallCtx.fillRect(progress % 32, 0, 1, 18);
  this.wallCtx.fillRect(0, linprog % 18, 32, 1);

  this.shaderPass.uniforms.wall.value.needsUpdate = true;
};
