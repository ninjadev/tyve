/**
 * @constructor
 */

function Mandelbrot(layer) {
  this.startFrame = +layer.startFrame;
  this.stab = 0;
  this.resolutionPath = new PathController([
      {
        startFrame: 90,
        endFrame: 150,
        points: [
          [0, 0, 0],
          [-0.1002, 0.8373, 0]
        ],
        easing: 'smoothstep'
      },
      {
        startFrame: 150,
        endFrame: 350,
        points: [
          [-0.1002, 0.8373, 0],
          [-0.0990, 0.8369, 0]
        ]
      },
      {
        startFrame: 350,
        endFrame: 440,
        points: [
          [-0.0990, 0.8369, 0],
          [-0.745, 0.101, 0]
        ],
        easing: 'smoothstep'
      },
      {
        startFrame: 440,
        endFrame: 600,
        points: [
          [-0.745, 0.101, 0],
          [-0.744, 0.1005, 0]
        ],
      },
      {
        startFrame: 600,
        endFrame: 710,
        points: [
          [-0.744, 0.1005, 0],
          [-0.0152, -0.795567633298876, 0]
        ],
        easing: 'smoothstep'
      },
      {
        startFrame: 710,
        endFrame: 770,
        points: [
          [-0.0152, -0.795567633298876, 0],
          [-0.015, -0.795467633298876, 0]
        ]
      }
  ]);
  this.zoomPath = new PathController([
      {
        startFrame: 0,
        endFrame: 60,
        points: [0, 2],
        easing: 'smoothstep'
      },
      {
        startFrame: 120,
        endFrame: 180,
        points: [2, 11],
        easing: 'smoothstep'
      },
      { // Top -> Left
        startFrame: 330,
        endFrame: 400,
        points: [11, 4],
        easing: 'easeOut'
      },
      {
        startFrame: 400,
        endFrame: 440,
        points: [4,  10],
        easing: 'easeIn'
      },
      { // Left -> Right
        startFrame: 600,
        endFrame: 655,
        points: [10, 4],
        easing: 'easeOut'
      },
      {
        startFrame: 655,
        endFrame: 720,
        points: [4,  10],
        easing: 'easeIn'
      }
  ], '1D');

  this.textOverlayLayer = new TextOverlayLayer({
    "config": {
      "title": "Mandelbrot",
      "body": [
        "- Chaos theory",
        "- Neon Genesis",
        "- Fashionable: 80's"
      ],
      "offset": {
        "x": 1,
        "y": 2
      },
      "flip": true,
      "textColor": "black",
      "strokeColor": "white"
    }
  });

  this.shaderPass = new THREE.ShaderPass(SHADERS.mandelbrot);
  this.shaderPass.uniforms.textImage.value = this.textOverlayLayer.texture;

  this.update(0, 0);
  this.resize();
}

Mandelbrot.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

Mandelbrot.prototype.start = function() {
};

Mandelbrot.prototype.end = function() {
};

Mandelbrot.prototype.resize = function() {
  this.textOverlayLayer.resize();
};

Mandelbrot.prototype.update = function(frame, relativeFrame) {

  this.textOverlayLayer.update(frame - 630, relativeFrame - 630);

  var freezeBean = 1205;
  if(BEAN >= freezeBean) {
    frame = 6570;
    relativeFrame = frame - this.startFrame;
  }

  this.shaderPass.uniforms.resolution.value = new THREE.Vector2(16 * GU, 9 * GU);

  this.shaderPass.uniforms.time.value = this.zoomPath.getPoint(relativeFrame);

  this.shaderPass.uniforms.frame.value = frame;

  this.stab *= 0.95;
  if(this.stab < 0.01) {
    this.stab = 0;
  }
  if(BEAT && BEAN % 12 == 6) {
    if(frame > 5896) {
      this.stab = 1;
    }
  }

  if(BEAN >= freezeBean) {
    this.stab = 0;
  }
  this.shaderPass.uniforms.stab.value = this.stab;
  this.shaderPass.uniforms.time.value = this.zoomPath.getPoint(relativeFrame);

  var spline = this.resolutionPath.get3Dpoint(relativeFrame);
  this.shaderPass.uniforms.zoomCoordinate.value = new THREE.Vector2(spline.x, spline.y);
};
