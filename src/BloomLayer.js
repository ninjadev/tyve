/*
 * @constructor
 */
function BloomLayer(layer) {
  this.config = layer.config;
  this.amount = this.config.amount;
  this.noStabs = !!this.config.noStabs;
  this.shaderPass = new THREE.BloomPass(this.amount, 16, 160, 512);
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
  var multiplier = this.noStabs ? 1 : this.stab;
  this.shaderPass.copyUniforms.opacity.value = this.amount * multiplier;
};

BloomLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
