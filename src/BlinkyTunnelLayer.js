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
      "body": [
        "- pressure equalizing ducts",
        "- natural lighting",
        "- endless"
      ],
      "offset": {
        "x": 1.5,
        "y": 2
      },
      "strokeColor": "white",
      "textColor": "black"
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
  this.wallCtx.fillStyle = '#5f4530';
  this.wallCtx.fillRect(0, 0, 32, 18);
  this.wallCtx.fillStyle = 'yellow';
  var framesPerBeat = 32.727272727272727272727272727273;
  var progress = frame / framesPerBeat;
  progress *= 32;
  progress |= 0;
  this.wallCtx.fillRect(progress % 64 - 32, 0, 32, 18);

  this.shaderPass.uniforms.wall.value.needsUpdate = true;
};
