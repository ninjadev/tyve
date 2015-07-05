/**
 * @constructor
 */
function BlankLayer(layer) {
  this.offset = layer.config.offset;
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.cube = new THREE.Mesh(new THREE.BoxGeometry(50, 5, 5),
                             new THREE.MeshLambertMaterial({color: 0xffffff}));
  this.scene.add(this.cube);

  this.cube.position.x = 45 * this.offset;
  this.camera.position.z = 200;

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

BlankLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

BlankLayer.prototype.start = function() {
};

BlankLayer.prototype.end = function() {
};

BlankLayer.prototype.update = function(frame) {
  this.cube.rotation.x = Math.sin(frame / 10 + this.offset);
  this.cube.rotation.y = Math.cos(frame / 10 + this.offset);
};
