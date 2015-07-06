/**
 * @constructor
 */
function GridLayer(layer) {
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

  for (var i=0; i<2; i++) {
    this.lightning.push(new THREE.Mesh(
      new THREE.PlaneGeometry(64, 64),
      new THREE.MeshBasicMaterial({
        map: map,
        transparent: true
      })
    ));
  }

  this.positions = [[], []];

  for (var i=0; i<60; i++) {
    var x = -30 + Math.random() * 10 | 0,
        y = 32,
        z = -50 + Math.random() * 20 | 0;
    this.positions[0].push(new THREE.Vector3(x, y, z));
  }

  for (var i=0; i<60; i++) {
    var x = 10 + Math.random() * 10 | 0,
        y = 32,
        z = -80 + Math.random() * 50 | 0;
    this.positions[1].push(new THREE.Vector3(x, y, z));
  }

  for (var i=0; i<2; i++) {
    this.lightning[i].position = this.positions[i][0];
    this.lightning[i].rotation.y = (i % 2 ? 1 : -1) * Math.PI / 4;
    this.scene.add(this.lightning[i]);
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

  this.lightning[0].position = this.positions[0][(relativeFrame / 60) | 0];
  this.lightning[1].position = this.positions[1][(relativeFrame / 50) | 0];

  if (relativeFrame % 7) {
    for (var i=0; i<this.lightning.length; i++) {
      this.lightning[i].position.add(new THREE.Vector3(
          Math.random() - 0.5, 0, Math.random() - 0.5
      ));
    }
  }
};
