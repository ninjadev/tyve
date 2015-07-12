function BGLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.img);
  this.bg = Loader.loadTexture('res/bg.jpg');
  this.shaderPass.uniforms.img.value = this.bg;
}

BGLayer.prototype.update = function() {
};

BGLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
