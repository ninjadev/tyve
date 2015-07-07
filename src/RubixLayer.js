/**
 * @constructor
 */
function RubixLayer(layer) {
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -500, -500, -500 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 100;
  pointLight.position.y = 500;
  pointLight.position.z = 1300;
  this.scene.add(pointLight);

  this.innerCubeGlow = 0;


  var cubeMaterials = [
    new THREE.MeshBasicMaterial({map: Loader.loadTexture('res/rubix-green.png'), transparent: true}),
    new THREE.MeshBasicMaterial({map: Loader.loadTexture('res/rubix-red.png'), transparent: true}),
    new THREE.MeshBasicMaterial({map: Loader.loadTexture('res/rubix-brown.png'), transparent: true}),
    new THREE.MeshBasicMaterial({map: Loader.loadTexture('res/rubix-yellow.png'), transparent: true}),
    new THREE.MeshBasicMaterial({map: Loader.loadTexture('res/rubix-purple.png'), transparent: true}),
    new THREE.MeshBasicMaterial({map: Loader.loadTexture('res/rubix-blue.png'), transparent: true}),
  ];
  this.innerCubeMaterialColors = [
    {r: 0x79, g: 0xbf, b: 0xa3},
    {r: 0xce, g: 0x50, b: 0x79},
    {r: 0x5f, g: 0x45, b: 0x30},
    {r: 0xe8, g: 0x9d, b: 0x3c},
    {r: 0x3f, g: 0x32, b: 0x4a},
    {r: 0x4e, g: 0x83, b: 0x93},
  ];
  this.innerCubeMaterials = [
    new THREE.MeshBasicMaterial({color: 0x79bfa3}),
    new THREE.MeshBasicMaterial({color: 0xcd5079}),
    new THREE.MeshBasicMaterial({color: 0x5f4530}),
    new THREE.MeshBasicMaterial({color: 0xe84530}),
    new THREE.MeshBasicMaterial({color: 0x3f324a}),
    new THREE.MeshBasicMaterial({color: 0x4e8393})
  ];
  var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
  this.cubeMaterial = cubeMaterial;
  var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
  var innerCubeGeometry = new THREE.BoxGeometry(9.9, 9.9, 9.9);
  this.innerCubeMaterial = new THREE.MeshFaceMaterial(this.innerCubeMaterials);
  this.rubix = [];
  this.rubixObj = new THREE.Object3D();
  for(var x = 0; x < 3; x++) {
    this.rubix[x] = [];
    for(var y = 0; y < 3; y++) {
      this.rubix[x][y] = [];
      for(var z = 0; z < 3; z++) {
        this.rubix[x][y][z] = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.rubix[x][y][z].add(new THREE.Mesh(innerCubeGeometry,
                                this.innerCubeMaterial));
        this.rubix[x][y][z].position.x = (x - 1) * 10;
        this.rubix[x][y][z].position.y = (y - 1) * 10;
        this.rubix[x][y][z].position.z = (z - 1) * 10;
        this.rubixObj.add(this.rubix[x][y][z]);
      }
    }
  }
  this.twistHelper = new THREE.Object3D();
  this.rubixObj.add(this.twistHelper);
  this.scene.add(this.rubixObj);

  this.camera.position.z = 100;

  if (!window.FILES) {
    Loader.start(function () {}, function() {});
  }

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

RubixLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

RubixLayer.prototype.start = function() {
};

RubixLayer.prototype.end = function() {
};

RubixLayer.prototype.twists = {
  61: { axis: 'z', row: 0}, 62: { axis: 'x', row: 1},
  63: { axis: 'y', row: 2}, 64: { axis: 'z', row: 0},
  65: { axis: 'y', row: 1}, 66: { axis: 'z', row: 2},
  67: { axis: 'x', row: 2}, 68: { axis: 'z', row: 1},
  69: { axis: 'x', row: 1}, 70: { axis: 'y', row: 0},
  71: { axis: 'z', row: 0}, 72: { axis: 'x', row: 1},
  73: { axis: 'y', row: 2}, 74: { axis: 'z', row: 0},
  75: { axis: 'y', row: 1}, 76: { axis: 'z', row: 2},
  77: { axis: 'x', row: 2}, 78: { axis: 'z', row: 1},
  79: { axis: 'x', row: 1}, 80: { axis: 'y', row: 0},
  81: { axis: 'x', row: 2}, 82: { axis: 'z', row: 1},
  83: { axis: 'x', row: 1}, 84: { axis: 'y', row: 0},
  85: { axis: 'z', row: 0}, 86: { axis: 'x', row: 1}
};

RubixLayer.prototype.update = function(frame, relativeFrame) {

  var framesPerBean = 32.72727272727272727272727272;
  var twistIndex = BEAN / 6 | 0;
  if(BEAT && BEAN % 6 == 0) {
    THREE.SceneUtils.detach(this.twistHelper, this.twistHelper.parent, this.scene);
    this.twistHelper = new THREE.Object3D();
    THREE.SceneUtils.attach(this.twistHelper, this.scene, this.scene);
    var cubes = [];
    for(var x = 0; x < 3; x++) {
      for(var y = 0; y < 3; y++) {
        for(var z = 0; z < 3; z++) {
          THREE.SceneUtils.detach(this.rubix[x][y][z], this.rubix[x][y][z].parent, this.scene);
          cubes.push(this.rubix[x][y][z]);
        }
      }
    }
    var that = this;
    cubes.sort(function(a, b) {
      return a.position[that.twists[twistIndex].axis] -
             b.position[that.twists[twistIndex].axis];
    });
    for(var i = 0; i < cubes.length; i++) {
      var pos = cubes[i].position;
      console.log(pos[that.twists[twistIndex].axis]);
    }
    for(var x = 0; x < 3; x++) {
      for(var y = 0; y < 3; y++) {
        for(var z = 0; z < 3; z++) {
          THREE.SceneUtils.attach(this.rubix[x][y][z], this.scene, this.rubixObj);
        }
      }
    }
    var offset = this.twists[twistIndex].row * 9;
    for(var i = offset; i < 9 + offset; i++) {
      THREE.SceneUtils.detach(cubes[i], cubes[i].parent, this.scene);
      THREE.SceneUtils.attach(cubes[i], this.scene, this.twistHelper);
    }
  }

  this.twistHelper.rotation[this.twists[twistIndex].axis] = smoothstep(
      0, Math.PI / 2,
      (frame % framesPerBean) / framesPerBean);

  this.camera.position.x = 100 * Math.sin(frame / 30);
  this.camera.position.y = 100 * Math.sin(frame / 40);
  this.camera.position.z = 100 * Math.cos(frame / 50);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));

  var flyoutScaler = 1;
  if(frame > 2430) {
    flyoutScaler = smoothstep(1, 1.01 + 0.01 * Math.sin(frame / 100), (frame - 2430) / 50);
  }
  for(var x = 0; x < 3; x++) {
    for(var y = 0; y < 3; y++) {
      for(var z = 0; z < 3; z++) {
        this.rubix[x][y][z].position.x *= flyoutScaler;
        this.rubix[x][y][z].position.y *= flyoutScaler;
        this.rubix[x][y][z].position.z *= flyoutScaler;
      }
    }
  }

  if(this.innerCubeGlow > 0) {
    this.innerCubeGlow *= 0.85;
  }

  if(BEAT && BEAN % 6 == 0) {
    this.innerCubeGlow = 1;
  }

  for(var i = 0; i < this.innerCubeMaterials.length; i++) {
    this.innerCubeMaterials[i].color.setRGB(
      this.innerCubeMaterialColors[i].r / 255 * this.innerCubeGlow,
      this.innerCubeMaterialColors[i].g / 255 * this.innerCubeGlow,
      this.innerCubeMaterialColors[i].b / 255 * this.innerCubeGlow
    );
  }
};
