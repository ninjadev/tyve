/*
 * @constructor
 */
function BloomLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.BloomPass(0.5, 16, 160, 512);
}

BloomLayer.prototype.update = function(frame) {
  this.shaderPass.copyUniforms.opacity.value = 1;
};

BloomLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
