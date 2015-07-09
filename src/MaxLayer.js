/**
 * @constructor
 */
function MaxLayer(layer) {
  this.freezeAt = layer.config.freezeAt;
  this.viewDistance = 100000;

  this.random = Random(0x90);

  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.type);
  this.camera = this.cameraController.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, this.viewDistance);

  this.camera.position.x =  250;
  this.camera.position.y = -125;
  this.camera.position.z =  260;

  this.camera.lookAt(new THREE.Vector3(54, 30, 47));

  var blueTexture = Loader.loadTexture('res/max/blue.png');
  var greenTexture = Loader.loadTexture('res/max/green.png');
  var redTexture = Loader.loadTexture('res/max/red.png');

  var skyboxMaterials = [
    new THREE.MeshBasicMaterial({
      map: blueTexture,
      side: THREE.BackSide
    }),
    new THREE.MeshBasicMaterial({
      map: redTexture,
      side: THREE.BackSide
    }),
    new THREE.MeshBasicMaterial({
      map: blueTexture,
      side: THREE.BackSide
    }),
    new THREE.MeshBasicMaterial({
      map: greenTexture,
      side: THREE.BackSide
    }),
    new THREE.MeshBasicMaterial({
      map: redTexture,
      side: THREE.BackSide
    }),
    new THREE.MeshBasicMaterial({
      map: greenTexture,
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

  this.NUM_OF_SPHERES = 3;
  this.spheres = [];
  var colors = [0x79bfa3, 0xcd5079, 0x4e8393];

  for(var i = 0; i < this.NUM_OF_SPHERES; i++) {
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 20),
                                new THREE.MeshBasicMaterial({color:colors[i]}));
    sphere.position.set(i*40, i*40, i*40);
    this.spheres.push(sphere);
    this.scene.add(sphere);
  }

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
  if(frame > this.freezeAt) {
    return;
  }

  for(var i = 0; i < this.NUM_OF_SPHERES; i++) {
    var sphere = this.spheres[i];

    sphere.position.set(
        40 * (i + 1) * Math.sin((relativeFrame/60) + i + i * 40),
        40 * (i + 1) * Math.sin((relativeFrame/60) + i + i * 40),
        40 * (i + 1) * Math.cos((relativeFrame/60) + i + i * 40));
  }
};
