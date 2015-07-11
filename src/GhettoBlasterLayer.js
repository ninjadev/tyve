/**
 * @constructor
 */
function GhettoBlasterLayer(layer) {
  this.config = layer.config;

  this.scene = new THREE.Scene();
  this.camera = new THREE.OrthographicCamera(16 / -2, 16 / 2, 9 / 2, 9 / -2, 1, 1000);

  this.background = new Image();
  this.ghettoblaster = new Image();
  this.cassetteRoll = new Image();
  this.vibratingSpeakers = new Image();
  this.radioMarker = new Image();
  this.meter = new Image();
  this.eqMask = new Image();
  Loader.load('res/bg.jpg', this.background, function() {});
  Loader.load('res/ghettoblaster/ghettoblaster.png', this.ghettoblaster, function() {});
  Loader.load('res/ghettoblaster/cassette-roll.png', this.cassetteRoll, function() {});
  Loader.load('res/ghettoblaster/vibrating-speakers.png', this.vibratingSpeakers, function() {});
  Loader.load('res/ghettoblaster/radio-marker.png', this.radioMarker, function() {});
  Loader.load('res/ghettoblaster/meter.png', this.meter, function() {});
  Loader.load('res/ghettoblaster/eq-mask.png', this.eqMask, function() {});

  this.amplitudeLedLightColors = [
    '#20C0AF', // green
    '#F9A840', // orange
    '#ED1556' // red
  ];
  this.tunlRectColors = [
    "#E195FF",
    "#EE6A91",
    "#25E9D1",
    "#77F3FD",
    "#F4EC48",
    "#F9A840"
  ];
  this.alternateTunlRectColor = "#70607D";
  this.volume = 0.5;
  this.smoothedVolume = 0.5;
  this.bassVolume = 0.5;
  this.framesPerBeat = 32.727272727272727272727273;

  this.canvas = document.createElement('canvas');
  this.texture = new THREE.Texture(this.canvas);
  this.texture.minFilter = THREE.LinearFilter;
  this.resize();
  this.ctx = this.canvas.getContext('2d');

  this.canvasCube = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 1),
    new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true
    })
  );

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.camera.position.z = 100;
  this.scene.add(this.canvasCube);
}

GhettoBlasterLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

GhettoBlasterLayer.prototype.start = function() {
};

GhettoBlasterLayer.prototype.end = function() {
};

GhettoBlasterLayer.prototype.update = function(frame, relativeFrame) {
  this.screenWidth = 16 * GU;
  this.screenHeight = 9 * GU;
  this.calculateVolume();

  this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
  this.ctx.drawImage(this.background, 0, 0, this.screenWidth, this.screenHeight);


  this.ctx.save();

  this.transformGhettoBlaster(frame, relativeFrame);

  this.ctx.drawImage(this.ghettoblaster, 0, 0, this.screenWidth, this.screenHeight);

  this.drawCassetteRolls(frame, relativeFrame);
  this.drawVibratingSpeakers(frame, relativeFrame);
  this.drawRadioMarker(frame, relativeFrame);
  this.drawAmplitudeLedLights(frame, relativeFrame);
  this.drawMeters(frame, relativeFrame);
  this.drawEqMask(frame, relativeFrame);
  this.drawTunl(frame, relativeFrame);

  this.ctx.restore();

  this.texture.needsUpdate = true;
};

GhettoBlasterLayer.prototype.transformGhettoBlaster = function(frame, relativeFrame) {
  var zoom = 1 - 0.005 * Math.sin(frame / this.framesPerBeat * Math.PI * 2);
  this.ctx.translate(8 * GU, 4.5 * GU);
  this.ctx.scale(zoom, zoom);
  this.ctx.translate(-8 * GU, -4.5 * GU);

  if (relativeFrame < 90) {
    var x = smoothstep(16 * GU, 8 * GU, (relativeFrame) / 60);
    this.ctx.translate(x, GU);
  } else if (relativeFrame < 240) {
    this.ctx.translate(8 * GU, GU);
  } else if (relativeFrame < 300) {
    var x = smoothstep(8 * GU, 0, (relativeFrame - 240) / 30);
    var y = smoothstep(GU, 0, (relativeFrame - 240) / 30);
    this.ctx.translate(x, y);
  }

};

GhettoBlasterLayer.prototype.calculateVolume = function() {
  var beanMod = BEAN % 6;
  if (beanMod == 0) {
    this.bassVolume = 1;
    this.volume = 1;
  } else if (beanMod == 3 || beanMod == 5) {
    this.volume += 0.2;
  }

  this.bassVolume = (this.bassVolume - 0.05) * 0.95;
  this.bassVolume = clamp(0, this.bassVolume, 1);

  this.volume = (this.volume - (this.volume > 0.6 ? 0.05 : 0)) * 0.95;
  this.volume = clamp(0, this.volume, 1);

  var volumeDiff = this.volume - this.smoothedVolume;
  this.smoothedVolume += (volumeDiff > 0 ? 0.2 : 0.1) * volumeDiff; // ascend faster than descend
};

GhettoBlasterLayer.prototype.drawCassetteRolls = function(frame, relativeFrame) {
  var cassetteRollSize = 0.031006201240248 * this.screenWidth;
  var cassetteRollY = 0.7222044216597244 * this.screenHeight;
  var cassetteRollPositions = [
    {x: 0.3542708541708342 * this.screenWidth, rotationOffset: 0},
    {x: 0.4054810962192438 * this.screenWidth, rotationOffset: 1},
    {x: 0.5263052610522104 * this.screenWidth, rotationOffset: 2},
    {x: 0.5745149029805961 * this.screenWidth, rotationOffset: 3}
  ];

  var rotation = relativeFrame * 0.015;
  for (var i = 0; i < cassetteRollPositions.length; i++) {
    this.ctx.save();
    this.ctx.translate(
      cassetteRollPositions[i].x + 0.5 * cassetteRollSize,
      cassetteRollY + 0.5 * cassetteRollSize
    );
    this.ctx.rotate(rotation + cassetteRollPositions[i].rotationOffset);
    this.ctx.drawImage(
      this.cassetteRoll,
      -0.5 * cassetteRollSize,
      -0.5 * cassetteRollSize,
      cassetteRollSize,
      cassetteRollSize
    );
    this.ctx.restore();
  }
};

GhettoBlasterLayer.prototype.drawVibratingSpeakers = function(frame, relativeFrame) {
  this.ctx.save();
  this.ctx.globalAlpha = this.bassVolume;
  this.ctx.drawImage(this.vibratingSpeakers, 0, 0, this.screenWidth, this.screenHeight);
  this.ctx.restore();
};

GhettoBlasterLayer.prototype.drawRadioMarker = function(frame, relativeFrame) {
  this.ctx.drawImage(
    this.radioMarker,
    (0.5909181836367273 + 0.08 * Math.sin(relativeFrame * 0.029)) * this.screenWidth,
    0.243511694969561 * this.screenHeight,
    0.0074014802960592 * this.screenWidth,
    0.0893944248638257 * this.screenHeight
  );
};

GhettoBlasterLayer.prototype.drawAmplitudeLedLights = function(frame, relativeFrame) {
  var width = 0.016003600720144 * this.screenWidth,
    height = 0.0099327138737584 * this.screenHeight;
  this.ctx.save();

  var numLitLeds = Math.round(this.volume * 16);

  for (var i = 0; i < numLitLeds; i++) {
    if (i < 11) {
      this.ctx.fillStyle = this.amplitudeLedLightColors[0];
    } else if (i < 14) {
      this.ctx.fillStyle = this.amplitudeLedLightColors[1];
    } else {
      this.ctx.fillStyle = this.amplitudeLedLightColors[2];
    }

    this.ctx.fillRect(
      (0.3280656131226245 + 0.024004800960192 * i) * this.screenWidth,
      0.2165972444729253 * this.screenHeight,
      width,
      height
    )
  }

  this.ctx.restore();
};

GhettoBlasterLayer.prototype.drawMeters = function(frame, relativeFrame) {
  var width = 0.0058011602320464 * this.screenWidth,
    height = 0.05479013136815127 * this.screenHeight;

  this.ctx.save();
  this.ctx.translate(
    0.3690738147629526 * this.screenWidth,
    0.4950336430631208 * this.screenHeight
  );
  var rotation = Math.PI * (-30 + 60 * this.smoothedVolume) / 180;
  this.ctx.rotate(rotation);

  this.ctx.drawImage(
    this.meter,
    -width / 2,
    -0.1304069208586991 * this.screenHeight,
    width,
    height
  );

  this.ctx.restore();

  this.ctx.save();

  this.ctx.translate(
    0.5919183836767353 * this.screenWidth,
    0.4950336430631208 * this.screenHeight
  );
  this.ctx.rotate(rotation);

  this.ctx.drawImage(
    this.meter,
    -width / 2,
    -0.1304069208586991 * this.screenHeight,
    width,
    height
  );

  this.ctx.restore();
};

GhettoBlasterLayer.prototype.drawEqMask = function(frame, relativeFrame) {
  var x = 0.3054610922184437 * this.screenWidth,
    y = 0.474847805190644 * this.screenHeight,
    width = 0.2254450890178036 * this.screenWidth,
    height = 0.0925985261134252 * this.screenHeight;

  var normalizedClipHeight = 1 - this.volume;

  this.ctx.drawImage(
    this.eqMask,
    0,
    0,
    this.eqMask.width,
    this.eqMask.height * normalizedClipHeight,
    x,
    y,
    width,
    height * normalizedClipHeight
  )
};

GhettoBlasterLayer.prototype.drawTunl = function(frame, relativeFrame) {
  var x = 0.5355071014202841 * this.screenWidth,
    y = 0.4863825696892022 * this.screenHeight,
    width = 0.1190238047609522 * this.screenWidth,
    height = 0.150272348606216 * this.screenHeight,
    lineWidth = 0.0025 * this.screenWidth;

  this.ctx.save();

  this.ctx.translate(x + width / 2, y + height / 2);

  this.ctx.beginPath();

  for (var i = 0; i < 12; i++) {
    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth.toString();
    this.ctx.strokeStyle = this.getTunlRectColor(i);
    this.ctx.rect(-width / 2, -height / 2, width, height);
    this.ctx.stroke();

    width *= 0.8;
    height *= 0.8;
    lineWidth *= 0.8;
  }

  this.ctx.restore();
};

GhettoBlasterLayer.prototype.getTunlRectColor = function(i) {
  i += Math.floor(BEAN / 3);
  if (i % 3 == 0) {
    return this.tunlRectColors[i % this.tunlRectColors.length];
  } else {
    return this.alternateTunlRectColor;
  }
};

GhettoBlasterLayer.prototype.resize = function() {
  this.canvas.width = 16 * GU;
  this.canvas.height = 9 * GU;
};
