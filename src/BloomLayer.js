/*
 * @constructor
 */
function BloomLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.BloomPass(this.config.amount || 1, 16, 160, 512);
  this.stab = 0;
}

BloomLayer.prototype.update = function(frame) {

  this.stab *= 0.9;
  if(this.stab < 0.1) {
    this.stab = 0;
  }
  if(BEAT && BEAN % 6 == 0) {
    this.stab = 1;
  }
  this.shaderPass.copyUniforms.opacity.value = (this.config.amount || 1) * this.stab;
};

BloomLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
