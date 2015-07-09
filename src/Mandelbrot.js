/**
 * @constructor
 */

function Mandelbrot(layer) {
  this.resolutionPath = new PathController([
      {
        startFrame: 25,
        endFrame: 240,
        points: [
          [0, 0, 0],
          [-0.015, -0.795467633298876, 0]
        ],
        easing: "smoothstep"
      }
  ]);
  this.zoomPath = new PathController([
      {
        startFrame: 25,
        endFrame: 238,
        points: [0, 6],
        easing: "smoothstep"
      },
      {
        startFrame: 239,
        endFrame: 250,
        points: [6, 10],
        easing: "smoothstep"
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
};

Mandelbrot.prototype.update = function(frame, relativeFrame) {
  this.textOverlayLayer.update(frame - 120, relativeFrame - 120);

  this.shaderPass.uniforms.resolution.value = new THREE.Vector2(16 * GU, 9 * GU);

  this.shaderPass.uniforms.time.value = this.zoomPath.getPoint(relativeFrame);

  var spline = this.resolutionPath.get3Dpoint(relativeFrame);
  this.shaderPass.uniforms.zoomCoordinate.value = new THREE.Vector2(spline.x, spline.y);
};
