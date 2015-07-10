/**
 * @constructor
 */
function MaxLayer(layer) {
  this.freezeAt = layer.config.freezeAt;
  this.resumeAt = layer.config.resumeAt;
  this.viewDistance = 100000;

  this.random = Random(0x90);

  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.type);
  this.camera = this.cameraController.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, this.viewDistance);

  this.camera.position.x =  250;
  this.camera.position.y = -125;
  this.camera.position.z =  260;

  this.camera.lookAt(new THREE.Vector3(54, 30, 47));

  var maxVersion1Map = Loader.loadTexture('res/max/max1.png');
  var maxVersion2Map = Loader.loadTexture('res/max/max2.png');

  this.maxVersion1 = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 1),
                                    new THREE.MeshBasicMaterial({
                                      map: maxVersion1Map,
                                      transparent: true
                                    }));
  this.maxVersion1.position.x =  240;
  this.maxVersion1.position.y = -122;
  this.maxVersion1.position.z =  250;
  this.maxVersion1.rotation.y =   10;

  this.scene.add(this.maxVersion1);

  this.maxVersion2 = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 1),
                                    new THREE.MeshBasicMaterial({
                                      map: maxVersion2Map,
                                      transparent: true
                                    }));
  this.maxVersion2.position.x =  240;
  this.maxVersion2.position.y =  122;
  this.maxVersion2.position.z =  250;
  this.maxVersion2.rotation.y =   10;

  this.scene.add(this.maxVersion2);

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
  if(frame > this.freezeAt && frame < this.resumeAt) {
    return;
  }

  if(frame > this.resumeAt) {
    this.scene.remove(this.maxVersion1);
    this.scene.remove(this.maxVersion2);
  }

  if(BEAT && BEAN % 12 == 6) {
    this.maxVersion1.position.y = (-1) * this.maxVersion1.position.y;
    this.maxVersion2.position.y = (-1) * this.maxVersion2.position.y;
  }

  for(var i = 0; i < this.NUM_OF_SPHERES; i++) {
    var sphere = this.spheres[i];

    sphere.position.set(
        40 * (i + 1) * Math.sin((relativeFrame/30) + i + i * 60),
        40 * (i + 1) * Math.sin((relativeFrame/30) + i + i * 40) + 40,
        40 * (i + 1) * Math.cos((relativeFrame/30) + i + i * 70));
  }

  this.bg.rotation.x = Math.sin(relativeFrame/60);
  this.bg.rotation.y = Math.sin(relativeFrame/60);
  this.bg.rotation.z = Math.cos(relativeFrame/60);
};
