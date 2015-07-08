/**
 * @constructor
 */
function ShockwaveLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.shockwave);
}

ShockwaveLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

ShockwaveLayer.prototype.start = function() {
};

ShockwaveLayer.prototype.end = function() {
};

ShockwaveLayer.prototype.update = function(frame, relativeFrame) {
    this.shaderPass.uniforms.time.value = relativeFrame;
};
