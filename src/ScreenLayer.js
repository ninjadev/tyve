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

  this.bg = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000),
                                new THREE.MeshBasicMaterial({
                                  side: THREE.BackSide
                                }));
  this.bgTargetColor = new THREE.Vector3();
  this.bgTargetColor.x = 0x3f / 255 * 0.2;
  this.bgTargetColor.y = 0x32 / 255 * 0.2;
  this.bgTargetColor.z = 0x4a / 255 * 0.2;
  this.bgStab = 0;
  this.scene.add(this.bg);

  this.placementRandom = new Random('screenlayer, yo');
  var pixelGeometry = new THREE.BoxGeometry(16 * 0.95, 20 * 0.95, 1);
  for(var x = 0; x < 16; x++) {
    this.screen[x] = [];
    for(var y = 0; y < 9; y++) {
      var frontPixel = new THREE.Mesh(pixelGeometry, new THREE.MeshPhongMaterial({
        color: 0xcd5079
      }));
      var backPixel = new THREE.Mesh(pixelGeometry, new THREE.MeshPhongMaterial({
        color: 0x3f324a
      }));
      var pixel = new THREE.Object3D();
      frontPixel.position.z = 0.5;
      backPixel.position.z = -0.5;
      pixel.add(frontPixel);
      pixel.add(backPixel);
      pixel.regularPosition = new THREE.Vector3();
      pixel.regularPosition.x = 16 * (x - 7.5);
      pixel.regularPosition.y = 20 * (y - 4.5);
      pixel.regularPosition.z = -100;
      pixel.startPosition = new THREE.Vector3();
      pixel.startPosition.x = pixel.regularPosition.x * 3;
      pixel.startPosition.y = pixel.regularPosition.y * 3;
      pixel.startPosition.z = 100;
      pixel.targetRotation = new THREE.Vector3(0, 0, 0);
      this.screen[x][y] = pixel;
      this.scene.add(pixel);
    }
  }

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
   '||||||||||||||||' +
   '|    |||||||||||' +
   '| ||||   ||   ||' +
   '|   || || | || |' +
   '| ||||   ||   ||' +
   '| |||| || | || |' +
   '| |||| || |   ||' +
   '||||||||||||||||').split(''),

  ('||||||||||||||||' +
   '|  ||| ||||| |||' +
   '| | | | |||| |||' +
   '| | | | |||| |||' +
   '| | || || ||  ||' +
   '| | |||| | | | |' +
   '| | |||| | | | |' +
   '|  |||||| ||  ||' +
   '||||||||||||||||').split(''),

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
   ' || || || ||    ' +
   ' || || || ||    ' +
   '  || || || ||   ' +
   '  || || || ||   ' +
   '   || || || ||  ' +
   '   || || || ||  ' +
   '                ' +
   '                ').split(''),

  ('                ' +
   '  |||      |||  ' +
   '   |||    |||   ' +
   '    |   |||     ' +
   '       ||       ' +
   '     |||   |    ' +
   '   |||    |||   ' +
   '  |||      |||  ' +
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

  ('         |      ' +
   '  || ||| |      ' +
   ' |   ||  |  ||| ' +
   ' |    || |      ' +
   '                ' +
   ' ||  |||  | ||| ' +
   '  || ||| |  ||  ' +
   ' ||| |    |  || ' +
   '     |   |      ').split(''),

  ('                ' +
   '  ||||      | | ' +
   '   ||       |   ' +
   '   || ||| ||| | ' +
   '   || | | | | | ' +
   '   || | | ||| | ' +
   '   ||           ' +
   '  ||||          ' +
   '                ').split(''),

  ('||||||||||||||||' +
   '||||||||| ||| ||' +
   '||||||||| ||| ||' +
   '||||||||| ||| ||' +
   '|||  |||  ||  ||' +
   '|| || | | | | ||' +
   '|| || | | | | ||' +
   '|||  |||  ||  ||' +
   '||||||||||||||||').split(''),

  ('    |  ||  |    ' +
   ' |   |    |   | ' +
   '  ||   ||   ||  ' +
   '     ||||||     ' +
   ' || |||||||| || ' +
   '     ||||||     ' +
   '  ||   ||   ||  ' +
   ' |   |    |   | ' +
   '    |  ||  |    ').split(''),

  ('||||||||||||||||' +
   '|   ||||||||||||' +
   '| || |||||||||||' +
   '| ||| ||   |  ||' +
   '| ||| | |||| | |' +
   '| ||| ||  ||  ||' +
   '| || ||||| | | |' +
   '|   |||   || | |' +
   '||||||||||||||||').split(''),

  ('                ' +
   ' ||||           ' +
   ' |       ||||   ' +
   ' |||    |    |  ' +
   ' |     |      | ' +
   ' | ||  |   || | ' +
   ' | | |  |   ||  ' +
   ' | | |   ||| || ' +
   '                ').split(''),

  ('||||||||||||||||' +
   '|    |||||||||||' +
   '| ||||||||||||||' +
   '| ||||  || || ||' +
   '|    | | | || ||' +
   '| ||||   |    ||' +
   '| |||| ||| || ||' +
   '|    | ||| || ||' +
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

ScreenLayer.prototype.update = function(frame, relativeFrame) {
  for(var x = 0; x < 16; x++) {
    for(var y = 0; y < 9; y++) {
      var pixel = this.screen[x][y];
      var positioner = relativeFrame / 40;
      pixel.position.x = easeOut(pixel.startPosition.x,
                                    pixel.regularPosition.x,
                                    positioner);
      pixel.position.y = easeOut(pixel.startPosition.y,
                                    pixel.regularPosition.y,
                                    positioner);
      pixel.position.z = easeOut(pixel.startPosition.z,
                                    pixel.regularPosition.z,
                                    positioner);

      if(BEAN < 1272) {
        pixel.rotation.x = ((1 + x) * (1 + y) + frame / 20) % (Math.PI * 2);
      } else {
        pixel.rotation.x = lerp(pixel.rotation.x, pixel.targetRotation.x, 0.1);
        pixel.rotation.y = lerp(pixel.rotation.y, pixel.targetRotation.y, 0.1);
        pixel.rotation.z = lerp(pixel.rotation.z, pixel.targetRotation.z, 0.1);
      }
    }
  }

  this.camera.position.x = 0;
  this.camera.position.z = 230;
  var framesPerBean = 32.727272727272727273;
  var xOffset = 30;
  if(BEAN >= 1272) {
    if(BEAN % 24 < 12) {
      this.camera.position.x = +100 -lerp(140, 120, (frame % (12 * framesPerBean)) / (12 * framesPerBean));
      this.camera.position.z = 230;
    } else {
      this.camera.position.x = xOffset + lerp(140, 120, (frame % (12 * framesPerBean)) / (12 * framesPerBean));
      this.camera.position.z = 230;
    }
    if(BEAT && BEAN % 24 == 0) {
      this.camera.lookAt(new THREE.Vector3(-80, 0, 0));
    }
    if(BEAT && BEAN % 24 == 12) {
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
  } else {
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  this.bgStab *= 0.85;
  if(this.bgStab < 0.01) {
    this.bgStab = 0;
  }
  
  if(BEAT && BEAN % 6 == 0) {
    this.bgStab = 1;
  }

  this.bg.material.color.setRGB(lerp(this.bgTargetColor.x, this.bgTargetColor.x * 2, this.bgStab),
                                lerp(this.bgTargetColor.y, this.bgTargetColor.y * 2, this.bgStab),
                                lerp(this.bgTargetColor.z, this.bgTargetColor.z * 2, this.bgStab));

  if(BEAN >= 1272) {
    this.screenSetBuffer(this.images[((BEAN - 1272) / 12 | 0) % this.images.length]);
  }
};
