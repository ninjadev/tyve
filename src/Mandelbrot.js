/**
 * @constructor
 */

function Mandelbrot(layer) {
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
        endFrame: 400,
        points: [
          [-0.0990, 0.8369, 0],
          [-0.745, 0.101, 0]
        ],
        easing: 'smoothstep'
      },
      {
        startFrame: 400,
        endFrame: 540,
        points: [
          [-0.745, 0.101, 0],
          [-0.744, 0.1005, 0]
        ],
      },
      {
        startFrame: 540,
        endFrame: 650,
        points: [
          [-0.744, 0.1005, 0],
          [-0.0152, -0.795567633298876, 0]
        ],
        easing: 'smoothstep'
      },
      {
        startFrame: 650,
        endFrame: 680,
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
        endFrame: 375,
        points: [11, 3],
        easing: 'easeOut'
      },
      {
        startFrame: 375,
        endFrame: 420,
        points: [3,  10],
        easing: 'easeIn'
      },
      { // Left -> Right
        startFrame: 540,
        endFrame: 595,
        points: [10, 4],
        easing: 'easeOut'
      },
      {
        startFrame: 595,
        endFrame: 650,
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
      "flip": true
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
}

Mandelbrot.prototype.update = function(frame, relativeFrame) {
  this.textOverlayLayer.update(frame - 530, relativeFrame - 530);

  this.shaderPass.uniforms.resolution.value = new THREE.Vector2(16 * GU, 9 * GU);

  this.shaderPass.uniforms.time.value = this.zoomPath.getPoint(relativeFrame);

  var spline = this.resolutionPath.get3Dpoint(relativeFrame);
  this.shaderPass.uniforms.zoomCoordinate.value = new THREE.Vector2(spline.x, spline.y);
};

