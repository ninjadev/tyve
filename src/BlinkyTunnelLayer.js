function BlinkyTunnelLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.tunnel);
  this.musicThrob = 1;
  this.greetCanvas = document.createElement('canvas');
  this.greetCanvas.width = 32;
  this.greetCanvas.height = 18;
  this.greetCtx = this.greetCanvas.getContext('2d');
  this.shaderPass.uniforms.greets.value = new THREE.Texture(this.greetCanvas);
  this.shaderPass.uniforms.greets.value.magFilter = THREE.NearestFilter;
  this.shaderPass.uniforms.greets.value.minFilter = THREE.NearestFilter;
}


BlinkyTunnelLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

BlinkyTunnelLayer.prototype.update = function(frame, relativeFrame) {
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
};
