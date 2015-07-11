/**
 * @constructor
 */
function SplooshSobelLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.splooshsobel);
  this.texture = Loader.loadTexture('res/skybox/ft.jpg');
  Loader.start(function() {}, function() {});
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
    if(frame > 3849) {
      this.shaderPass.uniforms.bg.value = this.texture;
    } else {
      this.shaderPass.uniforms.bg.value = null;
    }
};
