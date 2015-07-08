/**
 * @constructor
 */
function GridLayer(layer) {
  this.freezeAt = 5550;
  this.neonGreen = 0x316276;
  this.neonPink = 0x9B7EBA;
  this.viewDistance = 400;
  this.random = Random(14);
  this.scene = new THREE.Scene();
  this.cameraController = new CameraController(layer.type);
  this.camera = this.cameraController.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, this.viewDistance);

  /*             */
  /* Create grid */
  /*             */

  var gridGeometry = new THREE.Geometry();
      gridMaterial = new THREE.LineBasicMaterial(
    {
      color: this.neonGreen,
      linewidth: 1 /* will always be 1 on windows no matter what you
                      actually set it to because of the ANGLE layer */
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
      -Math.PI / 3
    )
  );

  for (var i=0; i<2; i++) {
    this.scene.add(this.lightning[i].mesh);
  }

  /*                */
  /* Create pyramid */
  /*                */

  var verticesOfPyramid = [
    -1, 0, -1,
     1, 0, -1,
     1, 0,  1,
     -1, 0,  1,
     0, 1,  0
  ];

  var facesOfPyramid = [
    1, 0, 4,
    2, 1, 4,
    3, 2, 4,
    0, 3, 4
  ];

  this.pyramidSize = 30;
  var pyramidGeometry = new THREE.PolyhedronGeometry(
    verticesOfPyramid, facesOfPyramid, this.pyramidSize, 0
  );

  var map = Loader.loadTexture('res/pyramid_gradient.png');
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set( 2, 2 );

  var pyramidMaterial = new THREE.MeshBasicMaterial({
    map: map
  });
  var pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);

  this.pyramidWrapper = new THREE.Object3D();
  this.pyramidWrapper.add(pyramid);

  // Glow
  var pyramidGlowMaterial = new THREE.ShaderMaterial(SHADERS.glow);
  pyramidGlowMaterial.side = THREE.BackSide;
  pyramidGlowMaterial.blending = THREE.AdditiveBlending;
  pyramidGlowMaterial.transparent = true;

  pyramidGlowMaterial.uniforms.glowColor.value = new THREE.Color(this.neonPink);
  pyramidGlowMaterial.uniforms.viewVector.value = null;
  pyramidGlowMaterial.uniforms.c.value = 0.1;
  pyramidGlowMaterial.uniforms.p.value = 3.4;

  var pyramidGlow = new THREE.Mesh(
    new THREE.PolyhedronGeometry(
      verticesOfPyramid, facesOfPyramid, this.pyramidSize + 5, 0
    ), pyramidGlowMaterial);

  pyramidGlowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(
      this.camera.position, this.pyramidWrapper.position);
  this.pyramidWrapper.add(pyramidGlow);

  this.pyramidWrapper.position.z = -this.viewDistance;
  this.scene.add(this.pyramidWrapper);

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
  if (frame > this.freezeAt) {
    return;
  }

  this.camera.rotation.z = 0.5 + Math.sin(relativeFrame / 60) * 0.1;
  this.grid.position.z = -this.sizeZ + (relativeFrame % this.sizeZ);

  /*                  */
  /* Update lightning */
  /*                  */

  if (BEAT && frame < this.freezeAt) {
    if (BEAN % 3 == 0) {
        this.lightning[1].update();
    }
    if (BEAN % 12 == 6) {
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

  /*                */
  /* Update pyramid */
  /*                */

  this.pyramidWrapper.position.z = -this.viewDistance;

  var limit = 8 * 60,
      localFrame = relativeFrame - limit;
  if (localFrame > 0) {
    this.pyramidWrapper.position.z = smoothstep(
      -this.viewDistance,
      -100,
      localFrame  / (4 * 60));
  };


  var limit = 10 * 60,
      localFrame = relativeFrame - limit;
  if (localFrame > 0) {

    this.pyramidWrapper.position.y = smoothstep(
        0,
        -this.pyramidSize / 2,
        localFrame  / (2 * 60));

    var sizeX = 500,
        stretch = 2,
        sizeZ = sizeX * stretch,
        step = 10;
    this.sizeZ = sizeZ;

    var scale = smoothstep(0, 50, localFrame / (2 * 60));

    var length = this.grid.geometry.vertices.length / 4;
    for (var i = 0; i < length; i++) {
      var vertexHorizontalA = this.grid.geometry.vertices[i * 4 + 0];
      var vertexHorizontalB = this.grid.geometry.vertices[i * 4 + 1];
      var vertexVerticalA = this.grid.geometry.vertices[i * 4 + 2];
      var vertexVerticalB = this.grid.geometry.vertices[i * 4 + 3];
      vertexVerticalA.y = scale * Math.sin(vertexVerticalA.x);
      vertexVerticalB.y = scale * Math.sin(vertexVerticalB.x);
      vertexHorizontalA.y = scale * Math.sin(vertexVerticalA.x);
      vertexHorizontalB.y = scale * Math.sin(vertexVerticalB.x);
    }
    this.grid.geometry.verticesNeedUpdate = true;
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
