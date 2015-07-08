/*
 * @constructor
 */
function RobotsLayer(layer) {
  this.scene = new THREE.Scene();
  this.camera = new THREE.OrthographicCamera(
      16 / -2,
      16 / 2,
      9 / 2,
      9 / -2,
      1,
      1000);
  this.scene.add(this.camera);
  this.camera.position.z = 100;
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  image = Loader.loadTexture('res/robots.png');
  image.minFilter = THREE.LinearFilter;
  this.cube = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 1),
                             new THREE.MeshBasicMaterial({map: image}));
  this.scene.add(this.cube);
  Loader.start(function() {}, function() {});
}

RobotsLayer.prototype.update = function(frame) {
};

RobotsLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};
