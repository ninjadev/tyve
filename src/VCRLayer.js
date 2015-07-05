function VCRLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.vcr);
}

VCRLayer.prototype.update = function() {
};

VCRLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
