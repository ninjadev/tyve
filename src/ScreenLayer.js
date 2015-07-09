/**
 * @constructor
 */
function ScreenLayer(layer) {
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50);
  this.scene.add(light);
  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

  this.screen = [];

  var pixelGeometry = new THREE.BoxGeometry(10, 15, 1);
  for(var x = 0; x < 16; x++) {
    this.screen[x] = [];
    for(var y = 0; y < 9; y++) {
      var frontPixel = new THREE.Mesh(pixelGeometry, new THREE.MeshPhongMaterial({
        color: 0xe84530
      }));
      var backPixel = new THREE.Mesh(pixelGeometry, new THREE.MeshPhongMaterial({
        color: 0x3f324a
      }));
      var pixel = new THREE.Object3D();
      frontPixel.position.z = 0.5;
      backPixel.position.z = -0.5;
      pixel.add(frontPixel);
      pixel.add(backPixel);
      pixel.position.x = 16 * (x - 7.5);
      pixel.position.y = 20 * (y - 4.5);
      pixel.position.z = -100;
      pixel.targetRotation = new THREE.Vector3(0, 0, 0);
      this.screen[x][y] = pixel;
      this.scene.add(pixel);
    }
  }

  this.camera.position.z = 200;

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);

}

ScreenLayer.prototype.screenSetPixel = function(set, x, y) {
  this.screen[x][y].targetRotation.x = set * Math.PI;
};

ScreenLayer.prototype.screenSetBuffer = function(buffer) {
  for(var i = 0; i < buffer.length; i++) {
    var x = i % 16;
    var y = 8 - (i / 16 | 0);
    this.screenSetPixel(buffer[i] != ' ', x, y);
  }
};

ScreenLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

ScreenLayer.prototype.start = function() {
};

ScreenLayer.prototype.end = function() {
};

ScreenLayer.prototype.images = [
  ('||||||||||||||||' +
   '| || |  || ||  |' +
   '|  | | | | || ||' +
   '|  | | || | | ||' +
   '| |  | || | | ||' +
   '| |  | || | | ||' +
   '| || | | |||  ||' +
   '| || |  ||||  ||' +
   '||||||||||||||||').split(''),

  ('                ' +
   '    xx  xx      ' +
   '   x..xx..x     ' +
   '   x......x ss  ' +
   '    x....x s    ' +
   '     x..x   s   ' +
   '      xx     s  ' +
   '           ss   ' +
   '                ').split(''),

  ('||||||||||||||||' +
   '||||||| ||||||||' +
   '||||||| ||||||||' +
   '||||||| ||||||||' +
   '||||| | | | ||||' +
   '||||| | | | ||||' +
   '|||||       ||||' +
   '||||||||||||||||' +
   '||||||||||||||||').split(''),

  ('                ' +
   '  ||            ' +
   ' |   || |       ' +
   ' |  | | |   ||  ' +
   '     || ||    | ' +
   '      | | |  || ' +
   '    ||  ||  | | ' +
   '            ||| ' +
   '                ').split(''),

  ('||||||||||||||||' +
   '|  ||| ||||| |||' +
   '| | | | |||| |||' +
   '| | | | |||| |||' +
   '| | || || ||  ||' +
   '| | |||| | | | |' +
   '| | |||| | | | |' +
   '|  |||||| ||  ||' +
   '||||||||||||||||').split(''),

  ('                ' +
   ' |   |          ' +
   ' || ||   |      ' +
   ' | | |   |      ' +
   ' |   |   | | || ' +
   ' |   | | ||  || ' +
   ' |   | | | | |  ' +
   ' |   | | | |  | ' +
   '                ').split(''),

  ('||||||||||||||||' +
   '||   |||||  ||||' +
   '|| || ||| || |||' +
   '|| || || |||||||' +
   '||   ||| |||||||' +
   '|| ||||| |||||||' +
   '|| |||||| || |||' +
   '|| ||| |||  || |' +
   '||||||||||||||||').split(''),

  ('                ' +
   ' || || || ||    ' +
   ' || || || ||    ' +
   '  || || || ||   ' +
   '  || || || ||   ' +
   '   || || || ||  ' +
   '   || || || ||  ' +
   '                ' +
   '                ').split(''),

  ('||||||||||||||||' +
   '||            ||' +
   '|| |||||||||| ||' +
   '|| ||  ||  || ||' +
   '|| |||||||||| ||' +
   '||            ||' +
   '|| |||||||||| ||' +
   '||            ||' +
   '||||||||||||||||').split(''),

  ('                ' +
   '  |         |   ' +
   ' |||       |||  ' +
   '  |    |    |   ' +
   '      |||       ' +
   '       |    |   ' +
   '    |      |||  ' +
   '   |||      |   ' +
   '    |           ').split(''),
];

ScreenLayer.prototype.update = function(frame) {
  for(var x = 0; x < 16; x++) {
    for(var y = 0; y < 9; y++) {
      var pixel = this.screen[x][y];
      if(BEAN < 1151) {
        pixel.rotation.x = ((1 + x) * (1 + y) + frame / 20) % (Math.PI * 2);
      } else {
        pixel.rotation.x = lerp(pixel.rotation.x, pixel.targetRotation.x, 0.1);
        pixel.rotation.y = lerp(pixel.rotation.y, pixel.targetRotation.y, 0.1);
        pixel.rotation.z = lerp(pixel.rotation.z, pixel.targetRotation.z, 0.1);
      }
    }
  }

  this.camera.position.x = 0;
  this.camera.position.z = 130;
  if(BEAN >= 1176) {
    if(BEAN % 24 < 12) {
      this.camera.position.x = -lerp(140, 120, (BEAN % 12) / 12);
      this.camera.position.z = 100;
    } else {
      this.camera.position.x = lerp(140, 120, (BEAN % 12) / 12);
      this.camera.position.z = 100;
    }
    if(BEAT && BEAN % 24 == 0) {
      this.camera.lookAt(new THREE.Vector3(-80, 0, 0));
    }
    if(BEAT && BEAN % 24 == 12) {
      this.camera.lookAt(new THREE.Vector3(80, 0, 0));
    }
  } else {
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  if(BEAN >= 1151) {
  this.screenSetBuffer(this.images[((BEAN - 1151) / 12 | 0) % this.images.length]);
  }
};
