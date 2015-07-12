/**
 * @constructor
 */
function OutroLayer(layer) {
  this.config = layer.config;

  this.scene = new THREE.Scene();
  this.camera = new THREE.OrthographicCamera(1920 / -2, 1920 / 2, 1080 / 2, 1080 / -2, 1, 1000);

  this.bg = new THREE.Mesh(new THREE.BoxGeometry(1920, 1080, 1),
                           new THREE.MeshBasicMaterial({
                             map: Loader.loadTexture('res/solskogen-2015-tyve-crew.jpg'),
                             transparent: true}));
  this.bg.position.z = -2;

  this.scene.add(this.bg);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

OutroLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

OutroLayer.prototype.start = function() {
};

OutroLayer.prototype.end = function() {
};

OutroLayer.prototype.resize = function() {
};

OutroLayer.prototype.update = function(frame, relativeFrame) {
  this.bg.material.opacity = smoothstep(0, 1, relativeFrame / 180);

  // IT'S OVER 9000!
  if (frame > 9000) {
    this.bg.material.opacity = smoothstep(1, 0, (frame - 9000) / 120);
  }
};
