/**
 * @constructor
 */
function AtomiumLayer(layer) {
  this.layer = layer;
  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.type);
  this.camera = this.cameraController.camera;

  this.random = Random(1337);

  var sphereInfo = {
    color: new THREE.Color(0.5, 1, 1),
    position: new THREE.Vector3(0, 0, 0)
  };
  this.spheres = [sphereInfo];
  this.pins = [];

  var rotations = [
    [1,0,1],
    [1,1,0],
    [0,1,1],
    [1,0,-1],
    [1,-1,0],
    [0,-1,1],
    [-1,0,1],
    [-1,1,0],
    [0,1,-1],
    [-1,-1,0],
    [-1,0,-1],
    [0,-1,-1]
  ];

  for (var i=0; i < 100; i++) {
    var parentSphere = this.spheres[i];
    for (var j=0; j < 4; j++) {

      var rotIndex = (this.random() * rotations.length) | 0;
      var rotation = new THREE.Vector3(
        rotations[rotIndex][0],
        rotations[rotIndex][1],
        rotations[rotIndex][2]
      );

      var color = new THREE.Color(
        85 / 255,
        (128 + this.random()*127) / 255,
        (128 + this.random()*127) / 255
      );

      var ray = new THREE.Ray(parentSphere.position, rotation.normalize());

      var matchesExistingSphere = false;
      for (var k=0; k < this.spheres.length; k++) {
        if (ray.at(600).equals(this.spheres[k].position)) {
          matchesExistingSphere = true;
          var sphereInfo = this.spheres[k];
          break;
        }
      }
      if (matchesExistingSphere) {
        continue;
      }

      var sphereInfo = {
        'color': color,
        'position': ray.at(600)
      };
      this.spheres.push(sphereInfo);

      var pinInfo = {
        'from': parentSphere.position,
        'to': sphereInfo.position
      };
      this.pins.push(pinInfo);
    }
  }

  this.sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 8, 8),
                               new THREE.MeshLambertMaterial({color: 0x55aaff}));

  this.pin = new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 600, 32),
                            new THREE.MeshLambertMaterial({color: 0xffffff}));

  this.sphereMeshes = [];
  this.pinMeshes = [];

  var light = new THREE.PointLight(0xffffff, 10, 400);
  light.position.set(-150, 150, 200);
  this.scene.add(light);

  this.camLight = new THREE.PointLight(0xFFFFFF);
  this.camLight.position.set(500, 250, 130);
  this.scene.add(this.camLight);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

AtomiumLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

AtomiumLayer.prototype.start = function() {
  for (var i=0; i < this.sphereMeshes.length; i++) {
    this.scene.remove(this.sphereMeshes[i]);
  }
  for (var i=0; i < this.pinMeshes.length; i++) {
    this.scene.remove(this.pinMeshes[i]);
  }
};

AtomiumLayer.prototype.update = function(frame, relativeFrame) {
  this.cameraController.updateCamera(relativeFrame);

  this.camLight.position.copy(this.camera.position);
  this.camLight.rotation.copy(this.camera.rotation);

  if (BEAT % 6) {
    var sphereCount = ((BEAN - BEAN_FOR_FRAME(this.layer.startFrame)) / 6) | 0;

    if (sphereCount < this.spheres.length) {
      if (sphereCount in this.sphereMeshes) {
        this.scene.add(this.sphereMeshes[sphereCount]);
      } else {
        var sphereInfo = this.spheres[sphereCount];
        var newSphere = this.sphere.clone();
        newSphere.material = newSphere.material.clone();
        newSphere.material.color = sphereInfo.color;

        newSphere.position.copy(sphereInfo.position);

        this.scene.add(newSphere);
        this.sphereMeshes[sphereCount] = newSphere;
      }
    }

    var pinCount = sphereCount - 1;
    if (pinCount >= 0 && pinCount < this.pins.length) {
      if (pinCount in this.pinMeshes) {
        this.scene.add(this.pinMeshes[pinCount]);
      } else {
        var pinInfo = this.pins[pinCount];
        var newPin = this.pin.clone();
        newPin.position.copy(new THREE.Vector3().lerpVectors(pinInfo.from, pinInfo.to, 0.5));
        newPin.lookAt(pinInfo.to);
        newPin.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI/2);
        this.scene.add(newPin);
        this.pinMeshes[pinCount] = newPin;
      }
    }
  }
};
