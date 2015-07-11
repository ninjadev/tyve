/**
 * @constructor
 */
function ColorLayer(layer) {
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

  this.bg = new THREE.Mesh(new THREE.BoxGeometry(160, 90, 10),
                           new THREE.MeshBasicMaterial({
                             color: 0xff00ff}));
  this.bg.position.z = -100;
  this.scene.add(this.bg);
}

ColorLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

ColorLayer.prototype.start = function() {
};

ColorLayer.prototype.end = function() {
};

ColorLayer.prototype.update = function(frame) {
};
