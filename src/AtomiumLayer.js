/**
 * @constructor
 */
function AtomiumLayer(layer) {
  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.type);
  this.camera = this.cameraController.camera;

  this.random = Random(1337);

  this.lastDisplayedSphere = 0;

  var sphereInfo = {
    color: new THREE.Color(0.5, 1, 1),
    position: new THREE.Vector3(0, 0, 0)
  };
  this.spheres = [sphereInfo];
  this.pins = [];

  for (var i=0; i < 230; i++) {
    var rotation = new THREE.Vector3(
      this.random() * 2 - 1,
      this.random() * 2 - 1,
      this.random() * 2 - 1
    );

    var color = new THREE.Color(
      85 / 255,
      (128 + this.random()*127) / 255,
      (128 + this.random()*127) / 255
    );

    var ray = new THREE.Ray(sphereInfo.position, rotation.normalize());

    var pinInfo = {
      'from': sphereInfo.position,
      'to': ray.at(600)
    };
    this.pins.push(pinInfo);

    sphereInfo = {
      'color': color,
      'position': ray.at(600)
    };
    this.spheres.push(sphereInfo);
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
  this.lastDisplayedSphere = 0;

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

  var sphereCount = ((BEAN / 6) | 0) - 52;
  if (BEAT && sphereCount >= this.lastDisplayedSphere) {
    this.lastDisplayedSphere = sphereCount;

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
