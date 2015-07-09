/**
 * @constructor
 */
function MaxLayer(layer) {
  this.viewDistance = 100000;

  this.random = Random(0x90);

  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.type);
  this.camera = this.cameraController.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, this.viewDistance);
  this.camera.position.z = 400;

  var skyboxMaterials = [
    new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/max/blue.png'),
      side: THREE.BackSide
    }),
    new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/max/red.png'),
      side: THREE.BackSide
    }),
    new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/max/blue.png'),
      side: THREE.BackSide
    }),
    new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/max/green.png'),
      side: THREE.BackSide
    }),
    new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/max/red.png'),
      side: THREE.BackSide
    }),
    new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/max/green.png'),
      side: THREE.BackSide
    }),
  ];

  for(var i = 0; i < skyboxMaterials.length; i++) {
    var map = skyboxMaterials[i].map;
    map.wrapS = map.wrapT = THREE.RepeatMapping;
    map.repeat.set(16,16);
  }

  this.bg = new THREE.Mesh(new THREE.BoxGeometry(20000, 20000, 20000, 1, 1, 1),
                           new THREE.MeshFaceMaterial(skyboxMaterials));

  this.scene.add(this.bg);

  this.box = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20),
                            new THREE.MeshBasicMaterial({color:0x00ff00}));
  this.scene.add(this.box);

  if(!window.FILES) {
    Loader.start(function(){}, function(){});
  }
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

MaxLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

MaxLayer.prototype.start = function() {
};

MaxLayer.prototype.end = function() {
};

MaxLayer.prototype.update = function(frame, relativeFrame) {
  this.camera.rotation.y = 0.75 + Math.cos(relativeFrame / 60) * 0.9;
  this.camera.rotation.x = 0.75 + Math.cos(relativeFrame / 60) * 0.9;
};
