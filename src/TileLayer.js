/**
 * @constructor
 */
function TileLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.tile);
}

TileLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

TileLayer.prototype.start = function() {
};

TileLayer.prototype.end = function() {
};

TileLayer.prototype.update = function(frame, relativeFrame) {
  this.shaderPass.uniforms.multiplier.value = this.config.multiplier;
};
