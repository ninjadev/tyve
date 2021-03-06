/**
 * @constructor
 */
function NoiseFXLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.noise);
}

NoiseFXLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

NoiseFXLayer.prototype.start = function() {
};

NoiseFXLayer.prototype.end = function() {
};

NoiseFXLayer.prototype.update = function(frame, relativeFrame) {
    this.shaderPass.uniforms.width.value = 16 * 10000;
    this.shaderPass.uniforms.height.value = 9 * 10000;
    this.shaderPass.uniforms.time.value = frame;
    if (this.config && this.config.fadeIn) {
      var amount = (this.config && this.config.amount) || 0.1;
      this.shaderPass.uniforms.amount.value = easeOut(0, amount, relativeFrame / 300);
    } else {
      this.shaderPass.uniforms.amount.value = (this.config && this.config.amount) || 0.1;
    }
};
