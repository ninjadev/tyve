/**
 * @constructor
 */
function ToonShaderLayer(layer) {
  this.shaderPass = new THREE.ShaderPass(SHADERS.toon);
  this.shaderPass.uniforms.GU.value = GU;
}

ToonShaderLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

ToonShaderLayer.prototype.start = function() {
};

ToonShaderLayer.prototype.end = function() {
};

ToonShaderLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.GU.value = GU;
};
