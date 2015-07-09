/**
 * @constructor
 */
function SobelPulseLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.sobelpulse);
}

SobelPulseLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

SobelPulseLayer.prototype.start = function() {
};

SobelPulseLayer.prototype.end = function() {
};

SobelPulseLayer.prototype.update = function(frame, relativeFrame) {
    this.shaderPass.uniforms.time.value = relativeFrame;
    this.shaderPass.uniforms.amount.value = (frame%33.7272727272727273)/33/3;
};
