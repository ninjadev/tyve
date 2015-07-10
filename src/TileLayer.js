/**
 * @constructor
 */
function TileLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.tile);
  this.multiplier = 1;
}

TileLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

TileLayer.prototype.start = function() {
};

TileLayer.prototype.end = function() {
};

TileLayer.prototype.update = function(frame, relativeFrame) {
  var startBean = 192;
  if (BEAN < startBean) {
    this.multiplier = 1;
  } else if (BEAN < startBean + 6) {
    this.multiplier = 2;
  } else if (BEAN < startBean + 12) {
    this.multiplier = 3;
  } else if (BEAN < startBean + 18) {
    this.multiplier = 4;
  } else {
    this.multiplier = 5;
  }
  this.shaderPass.uniforms.multiplier.value = this.multiplier;
};
