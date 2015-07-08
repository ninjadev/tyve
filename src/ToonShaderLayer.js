/**
 * @constructor
 */
function NoiseFXLayer(layer) {
  this.shaderPass = new THREE.ShaderPass(SHADERS.toon);
  this.shaderPass.uniforms.GU.value = GU;
}

NoiseFXLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

NoiseFXLayer.prototype.start = function() {
};

NoiseFXLayer.prototype.end = function() {
};

NoiseFXLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.GU.value = GU;
};
