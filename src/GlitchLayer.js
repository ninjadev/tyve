/*
 * @constructor
 */

function GlitchLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.glitch);
}

GlitchLayer.prototype.update = function(frame, relativeFrame) {

  this.shaderPass.uniforms.amount.value = 0.0;
  this.shaderPass.uniforms.time.value = 0;

  if(frame >= 1184 && frame < 1230) {
    this.shaderPass.uniforms.amount.value = 1;
    this.shaderPass.uniforms.time.value = frame;
  }

  if(frame >= 1350 && frame < 1400) {
    this.shaderPass.uniforms.amount.value = smoothstep(
        0.25, 0, (frame - 1250) / (1300 - 1250));
    this.shaderPass.uniforms.time.value = frame;
  }

  if(frame >= 1650 && frame < 2740) {
    this.shaderPass.uniforms.amount.value = 1;
    this.shaderPass.uniforms.time.value = frame;
  }


};

GlitchLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
