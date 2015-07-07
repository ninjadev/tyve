/**
 * @constructor
 */
function IntroLayer(layer) {
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

  this.bg = new THREE.Mesh(new THREE.BoxGeometry(160, 90, 10),
                           new THREE.MeshBasicMaterial({
                             map: Loader.loadTexture('res/bg.jpg')}));
  this.bg.position.z = -100;
  this.scene.add(this.bg);

  this.moon = new THREE.Mesh(new THREE.SphereGeometry(6, 18, 18),
                             new THREE.MeshBasicMaterial({
                               color: 0xffffff,
                               map: Loader.loadTexture('res/bg.jpg'),
                               transparent: true,
                               opacity: 0.5
                             }));

  this.moon.position.z = -20;
  this.moon.position.x = -10;
  this.moon.position.y = 7;
  this.scene.add(this.moon);

  this.bassScaler = 0;

  this.ballLine = [];
  this.bgBallLine = [];
  var boxGeometry = new THREE.SphereGeometry(0.2);
  var bgboxGeometry = new THREE.SphereGeometry(0.25);
  var boxMaterial = new THREE.MeshBasicMaterial({color: 0x4e8393, transparent: true});
  var bgboxMaterial = new THREE.MeshBasicMaterial({color: 0xce5079, transparent: true});
  this.ballLineObj = new THREE.Object3D();
  for(var i = 0; i < 100; i++) {
    var ball = new THREE.Mesh(boxGeometry, boxMaterial);
    this.ballLine[i] = ball;
    ball.position.x = -25 + i * 0.5;
    this.ballLineObj.add(ball);

    var ball = new THREE.Mesh(bgboxGeometry, bgboxMaterial);
    this.bgBallLine[i] = ball;
    ball.position.x = -25 + i * 0.5;
    ball.position.x *= 1.01;
    ball.position.z = -2;
    this.ballLineObj.add(ball);
  }
  this.scene.add(this.ballLineObj);
  this.ballLineObj.position.z = -30;

  this.everything = new THREE.Mesh(
      new THREE.BoxGeometry(7.74, 1.42, 0.0001),
      new THREE.MeshBasicMaterial({
        transparent: true,
        map: Loader.loadTexture('res/everything.png')}));
  this.isfashion = new THREE.Mesh(
      new THREE.BoxGeometry(6.77, 1.41, 0.0001),
      new THREE.MeshBasicMaterial({
        transparent: true,
        map: Loader.loadTexture('res/is-fashion.png')}));
  this.scene.add(this.everything);
  this.scene.add(this.isfashion);

  this.camera.position.z = 10;

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  Loader.start(function(){}, function(){});
}

IntroLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

IntroLayer.prototype.start = function() {
};

IntroLayer.prototype.end = function() {
};

IntroLayer.prototype.update = function(frame) {
  if(frame < 130) {
    var colorStep = smoothstep(0, 1, (frame - 70) / (200 - 70));
  } else if(frame < 600) {
    var colorStep = 1.2 - lerp(0, 0.2, (frame - 130) / (150 - 130));
  } else {
    var colorStep = 1 - lerp(0, 1, (frame - 630) / (648 - 630));
  }
  this.bg.material.color.setRGB(colorStep, colorStep, colorStep);

  if(frame < 600) {
    this.bg.position.z = -smoothstep(70, 100, (frame - 0) / (620 - 0));
  } else {
    this.bg.position.z = smoothstep(-100, -20, (frame - 620) / (648 - 620));
  }

  var rotation = 0.23;
  this.everything.rotation.z = rotation;
  this.isfashion.rotation.z = rotation;
  this.everything.position.z = -3;
  this.isfashion.position.z = -3;

  this.everything.position.x = smoothstep(-20, -5, (frame - 500) / (530 - 500)) +
                               lerp(0, 5, (frame - 520) / (640 - 520)) + 
                               smoothstep(0, 40, (frame - 600) / (670- 600));
  this.everything.position.y = smoothstep(-5, -1.25, (frame - 500) / (530 - 500)) +
                               lerp(0, 1.25, (frame - 520) / (640 - 520)) + 
                               smoothstep(0, 10, (frame - 600) / (670- 600));

  this.isfashion.position.x = -this.everything.position.x;
  this.isfashion.position.y = -this.everything.position.y - 1.6;

  this.everything.position.z = smoothstep(-3, 10, (frame - 600) / (670 - 600));
  this.isfashion.position.z = smoothstep(-3, 10, (frame - 600) / (670 - 600));

  this.bassScaler *= 0.8;
  if(this.bassScaler < 0.01) {
    this.bassScaler = 0;
  }

  this.camera.rotation.z = (frame - 500) / 5000;

  if(BEAT && (BEAN == 33) ||
             (BEAN == 36) ||
             (BEAN == 39) ||
             (BEAN == 42) ||
             (BEAN == 57) ||
             (BEAN == 60) ||
             (BEAN == 63) ||
             (BEAN == 66) ||
             (BEAN == 69)
             ) {
    this.bassScaler = 1;
  }

  if(frame == 0) {
    this.bassScaler = 1;
  }
  this.ballLine[0].material.opacity = lerp(0, 1, 10 * this.bassScaler);
  this.bgBallLine[0].material.opacity = lerp(0, 1, 10 * this.bassScaler) * 0.5;

  var length = this.ballLine.length;
  for(var i = 0; i < length; i++) {
    var y = 8 * this.bassScaler * Math.pow(Math.sin(i / length * Math.PI), 2) * Math.sin(i / 4 + frame / 5);

    this.ballLine[i].position.y = y;
    this.bgBallLine[i].position.y = y;
  }

  this.moon.material.opacity = lerp(0, 1, (frame - 250) / (800 - 250));
  this.moon.position.x = 10 + lerp(20, -70, (frame - 300) / (750 - 250));
  this.moon.position.y = 5 + 0.5 * smoothstep(10, -15, (frame - 250) / (750 - 250));
};
