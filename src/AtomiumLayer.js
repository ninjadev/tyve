/**
 * @constructor
 */
function AtomiumLayer(layer) {
  this.layer = layer;
  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.type);
  this.camera = this.cameraController.camera;

  this.bg = new THREE.Mesh(new THREE.BoxGeometry(10000, 10000, 10000),
                           new THREE.MeshBasicMaterial({
                               color: 0x3B3390,
                               map: Loader.loadTexture('res/skybox/starbg.png'),
                               side: THREE.BackSide
                           }));
  this.bg.material.map.wrapS = this.bg.material.map.wrapT = THREE.RepeatWrapping;
  this.bg.material.map.repeat.set(8, 8);
  this.scene.add(this.bg);
  this.innerCubeGlow = 0;
  this.snareGlow = 0;

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

  var colors = [
    0x79bfa3,
    0xcd5079,
    0xe3ae64,
    0xe84530,
    0xc9a0eb,
    0x6dc8e3
  ];

  for (var i=0; i < 410; i++) {
    var parentSphere = this.spheres[i];
    for (var j=0; j < 4; j++) {

      var rotIndex = (this.random() * rotations.length) | 0;
      var rotation = new THREE.Vector3(
        rotations[rotIndex][0],
        rotations[rotIndex][1],
        rotations[rotIndex][2]
      );

      var colorIndex = (this.random() * colors.length) | 0;
      var color = new THREE.Color(colors[colorIndex]);

      this.random(); // For old times sake

      var ray = new THREE.Ray(parentSphere.position, rotation.normalize());
      var pos = ray.at(600);

      var matchesExistingSphere = false;
      for (var k=0; k < this.spheres.length; k++) {
        var old = this.spheres[k].position;
        if ((Math.abs(pos.x - old.x) < 1) &&
            (Math.abs(pos.y - old.y) < 1) &&
            (Math.abs(pos.z - old.z) < 1)) {
          matchesExistingSphere = true;
          break;
        }
      }
      if (matchesExistingSphere) {
        continue;
      }

      var sphereInfo = {
        'color': color,
        'position': pos
      };
      this.spheres.push(sphereInfo);

      var pinInfo = {
        'from': parentSphere.position,
        'to': sphereInfo.position
      };
      this.pins.push(pinInfo);
    }
  }

  this.sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 32),
                               new THREE.MeshLambertMaterial({color: 0x55aaff}));
  this.sphere.scale.set(0, 0, 0);

  this.pin = new THREE.Object3D();
  var subPin1 = new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 600, 32),
                               new THREE.MeshLambertMaterial({color: 0xffffff}));
  var subPin2 = new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 600, 32),
                               new THREE.MeshLambertMaterial({color: 0xffffff}));
  var subPin3 = new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 600, 32),
                               new THREE.MeshLambertMaterial({color: 0xffffff}));
  subPin1.scale.set(0.4, 1.1, 0.4);
  subPin2.scale.set(0.4, 1.0, 0.4);
  subPin3.scale.set(0.4, 0.9, 0.4);
  var distance = 10;
  subPin1.position.x = distance * Math.sin(1 / 3 * Math.PI * 2);
  subPin1.position.z = distance * Math.cos(1 / 3 * Math.PI * 2);
  subPin2.position.x = distance * Math.sin(2 / 3 * Math.PI * 2);
  subPin2.position.z = distance * Math.cos(2 / 3 * Math.PI * 2);
  subPin3.position.x = distance * Math.sin(3 / 3 * Math.PI * 2);
  subPin3.position.z = distance * Math.cos(3 / 3 * Math.PI * 2);
  this.pin.add(subPin1);
  this.pin.add(subPin2);
  this.pin.add(subPin3);
  subPin1.position.y = 300;
  subPin2.position.y = 300;
  subPin3.position.y = 300;
  this.pin.scale.y = 0;

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
};

AtomiumLayer.prototype.update = function(frame, relativeFrame) {
  if (relativeFrame > 801) {
    relativeFrame = 801;
    frame = this.layer.startFrame + relativeFrame;
    BEAN = BEAN_FOR_FRAME(frame);
  }
  this.cameraController.updateCamera(relativeFrame);

  this.camLight.position.copy(this.camera.position);
  this.camLight.rotation.copy(this.camera.rotation);

  var layerTick = ((BEAN - BEAN_FOR_FRAME(this.layer.startFrame)) / 6) | 0;

  var progress = 0;
  var framesPerBeat = 32.727272727272727273;
  var flooredBean = (BEAN / 6 | 0) * 6;
  var fromFrame = FRAME_FOR_BEAN(flooredBean);
  var toFrame = FRAME_FOR_BEAN(flooredBean + 6);
  progress = (frame - fromFrame) / (toFrame - fromFrame);
  if(BEAT && BEAN % 6 == 0) {
    progress = 0;
  }
  if(BEAN % 6 == 5 && BEAN_FOR_FRAME(frame % 1) > BEAN) {
    progress = 1;
  }

  var multiplier = (layerTick >= 8) ? (layerTick >= 16) ? (layerTick >= 24) ? 32 : 16 : 4 : 1;
  for (var i=0; i < multiplier; i++) {
    var sphereCount = 8 + (layerTick - 8) * Math.min(multiplier, 4) + i;
    if (layerTick >= 16) {
      sphereCount += (layerTick - 16) * 12;
    }
    if (layerTick >= 24) {
      sphereCount += (layerTick - 24) * 16;
    }
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
      var scale = smoothstep(0, 1, progress);
      this.sphereMeshes[sphereCount].scale.set(scale, scale, scale);
    }

    var pinCount = sphereCount - 1;

    if (pinCount >= 0 && pinCount < this.pins.length) {
      if (pinCount in this.pinMeshes) {
        this.scene.add(this.pinMeshes[pinCount]);
      } else {
        var pinInfo = this.pins[pinCount];
        var newPin = this.pin.clone();
        newPin.position.copy(pinInfo.from);
        newPin.lookAt(pinInfo.to);
        newPin.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI/2);
        this.scene.add(newPin);
        this.pinMeshes[pinCount] = newPin;
      }
      var scale = smoothstep(0, 1, progress);
      this.pinMeshes[pinCount].scale.y = scale;
    }
  }

  for(var i = 0; i < this.sphereMeshes.length; i++) {
    var sphere = this.sphereMeshes[i];
    if (!sphere) continue;
    sphere.glow = sphere.glow || 0;
    if(sphere.glow > 0) {
      sphere.glow *= 0.87;
    }
    if(BEAN > 550) {
      if(BEAT && BEAN % 6 == (i % 6)) {
        sphere.glow = 1;
      }
    }
    var color = sphere.glow * 0.3;
    sphere.material.emissive.setRGB(color, color, color);
  }

  if (this.snareGlow > 0) {
    this.snareGlow *= 0.95;
  }

  if (BEAN > 544 && BEAT && BEAN % 12 == 6) {
    this.snareGlow = 1;
  }

  var color = this.snareGlow * 0.6 + 0.33;
  this.bg.material.color.setRGB(color, color, color);
};
