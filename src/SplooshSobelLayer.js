/**
 * @constructor
 */
function SplooshSobelLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.splooshsobel);
}

SplooshSobelLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

SplooshSobelLayer.prototype.start = function() {
};

SplooshSobelLayer.prototype.end = function() {
};

SplooshSobelLayer.prototype.update = function(frame, relativeFrame) {
    this.shaderPass.uniforms.time.value = relativeFrame;
};
