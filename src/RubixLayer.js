/**
 * @constructor
 */
function RubixLayer(layer) {
  this.layer = layer;
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 100000);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -500, -500, -500 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 100;
  pointLight.position.y = 500;
  pointLight.position.z = 1300;
  this.scene.add(pointLight);


  this.outerBg = new THREE.Mesh(new THREE.BoxGeometry(20000, 20000, 20000),
                                new THREE.MeshBasicMaterial({
                                  color: 0x222222,
                                  map: Loader.loadTexture('res/skybox/up.jpg'), 
                                  side: THREE.BackSide
                                }));
  this.scene.add(this.outerBg);

  this.innerCubeGlow = 0;
  this.snareGlow = 0;


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
  0: { axis: 'z', row: 0}, 1: { axis: 'x', row: 1},
  2: { axis: 'y', row: 2}, 3: { axis: 'z', row: 0},
  4: { axis: 'y', row: 1}, 5: { axis: 'z', row: 2},
  6: { axis: 'x', row: 2}, 7: { axis: 'z', row: 1},
  8: { axis: 'x', row: 1}, 9: { axis: 'y', row: 0},
  10: { axis: 'z', row: 0}, 11: { axis: 'x', row: 1},
  12: { axis: 'y', row: 2}, 13: { axis: 'z', row: 0},
  14: { axis: 'y', row: 1}, 15: { axis: 'z', row: 2},
  16: { axis: 'x', row: 2}, 17: { axis: 'z', row: 1},
  18: { axis: 'x', row: 1}, 19: { axis: 'y', row: 0},
  20: { axis: 'x', row: 2}, 21: { axis: 'z', row: 1},
  22: { axis: 'x', row: 1}, 23: { axis: 'y', row: 0},
  24: { axis: 'z', row: 0}, 25: { axis: 'x', row: 1}
};

RubixLayer.prototype.update = function(frame, relativeFrame) {

  var framesPerBean = 32.72727272727272727272727272;
  var twistIndex = (BEAN - BEAN_FOR_FRAME(this.layer.startFrame)) / 6 | 0;
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

  this.camera.position.x = 200 * Math.sin(frame / 30);
  this.camera.position.y = 20 + 75 * Math.sin(frame / 40);
  this.camera.position.z = 200 * Math.cos(frame / 50);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));

  var flyoutScaler = 1;
  if(relativeFrame > 252) {
    flyoutScaler = smoothstep(1, 1.01 + 0.01 * Math.sin(frame / 100), (relativeFrame - 252) / 50);
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
    this.innerCubeGlow *= 0.87;
  }

  if(this.snareGlow > 0) {
    this.snareGlow *= 0.95;
  }

  if(BEAT && BEAN % 6 == 0) {
    this.innerCubeGlow = 1;
  }

  if(BEAT && BEAN % 12 == 6) {
    this.snareGlow = 1;
  }

  for(var i = 0; i < this.innerCubeMaterials.length; i++) {
    this.innerCubeMaterials[i].color.setRGB(
      this.innerCubeMaterialColors[i].r / 255 * this.innerCubeGlow,
      this.innerCubeMaterialColors[i].g / 255 * this.innerCubeGlow,
      this.innerCubeMaterialColors[i].b / 255 * this.innerCubeGlow
    );
  }
  var color = this.snareGlow * 0.6 + 0.33;
  this.outerBg.material.color.setRGB(color, color, color);
};
