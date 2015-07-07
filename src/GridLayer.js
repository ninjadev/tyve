/**
 * @constructor
 */
function GridLayer(layer) {
  this.random = Random(14);
  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.type);
  this.camera = this.cameraController.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 400);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  /*             */
  /* Create grid */
  /*             */

  var gridGeometry = new THREE.Geometry();
      gridMaterial = new THREE.LineBasicMaterial(
    {
      color: 0x316276,
      linewidth: 2
    }
  );

  var sizeX = 500,
      stretch = 2,
      sizeZ = sizeX * stretch,
      step = 10;
  this.sizeZ = sizeZ;

  for (var i=-sizeX; i<=sizeX; i+=step) {
    // Horizontal lines
    gridGeometry.vertices.push(new THREE.Vector3(-sizeX, 0, i * stretch));
    gridGeometry.vertices.push(new THREE.Vector3(sizeX, 0, i * stretch));

    // Vertical lines
    gridGeometry.vertices.push(new THREE.Vector3(i, 0, -sizeZ));
    gridGeometry.vertices.push(new THREE.Vector3(i, 0, sizeZ));
  }

  this.grid = new THREE.Line( gridGeometry, gridMaterial, THREE.LinePieces );
  this.scene.add(this.grid);

  this.camera.position.y = 15;
  this.camera.rotation.set(-0.15, 0.1, 0.5);

  /*                  */
  /* Create lightning */
  /*                  */

  var map = Loader.loadTexture('res/stock_lightning.png');

  this.lightning = [];
  this.lightning.push(
    new Lightning(map,
      new THREE.Vector3(-20, 16, -45),
      new THREE.Vector3(30, 0, 40),
      Math.PI / 3));
  this.lightning.push(
    new Lightning(map,
      new THREE.Vector3(10, 24, -80),
      new THREE.Vector3(50, 0, 50),
      -Math.PI / 3));

  for (var i=0; i<2; i++) {
    this.scene.add(this.lightning[i].mesh);
    console.log(this.lightning[i].mesh.position);
  }

  if (!window.FILES) {
    Loader.start(function () {}, function() {});
  }

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

GridLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

GridLayer.prototype.start = function() {
};

GridLayer.prototype.end = function() {
};

GridLayer.prototype.update = function(frame, relativeFrame) {
  this.camera.rotation.z = 0.5 + Math.sin(relativeFrame / 60) * 0.1;

  this.grid.position.z = -this.sizeZ + (relativeFrame % this.sizeZ);

  if (BEAT) {
    if (BEAN % 3 == 0) {
        this.lightning[1].update();
    }
    if (BEAN % 12 == 5) {
        this.lightning[0].update();
    }
  }

  if (relativeFrame % 25) {
    for (var i=0; i<this.lightning.length; i++) {
      var r = this.random() - 0.5;
      this.lightning[i].mesh.position.add(
          new THREE.Vector3(r, 0, r));
    }
  }
};

function Lightning(map, basePosition, jiggle, rotation) {
    this.random = Random(14);
    this.basePosition = basePosition;
    this.jiggle = jiggle;
    this.rotation = rotation;

    var geometry = new THREE.PlaneGeometry(64, 64);
    var material = new THREE.MeshBasicMaterial({
      map: map,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.y = rotation;

    this.update();
}

Lightning.prototype.update = function() {
  var r = this.random() - 0.5;
  this.mesh.position.set(
        this.basePosition.x + this.jiggle.x * r,
        this.basePosition.y + this.jiggle.y * r,
        this.basePosition.z + this.jiggle.z * r
      );
  this.mesh.rotation.y = this.rotation * this.random();
}
