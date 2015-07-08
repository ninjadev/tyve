/**
 * @constructor
 */
function TextOverlayLayer(layer) {
  this.config = layer.config;

  if (!document.getElementById('yellow-font')) {
    var s = document.createElement('style');
    s.setAttribute('id', 'yellow-font');
    Loader.loadAjax('res/yellow.base64', function(response) {
      s.innerHTML = [
        "@font-face {",
          "font-family: 'Yellowjacket';",
          "src: url(data:application/x-font-woff;charset=utf-8;base64," + response + ") format('woff');",
        "}"
      ].join('\n');
    })
    document.body.appendChild(s);
  }

  this.scene = new THREE.Scene();
  this.camera = new THREE.OrthographicCamera(16 / -2, 16 / 2, 9 / 2, 9 / -2, 1, 1000);

  this.canvas = document.createElement('canvas');
  this.texture = new THREE.Texture(this.canvas);
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

TextOverlayLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

TextOverlayLayer.prototype.start = function() {
};

TextOverlayLayer.prototype.end = function() {
};

TextOverlayLayer.prototype.update = function(frame, relativeFrame) {
  var offsetX = this.config.offset.x * GU;
  var offsetY = this.config.offset.y * GU;

  this.ctx.clearRect(0, 0, 16 * GU, 9 * GU);
  this.ctx.fillStyle = "white";

  this.ctx.font = (GU | 0) + "px Yellowjacket";
  var step = stepForFrame(relativeFrame, offsetX);
  this.ctx.fillText(this.config.title, offsetX - step, offsetY);

  this.ctx.font = ((GU * 3 / 5) | 0) + "px Yellowjacket";
  for (var i=0; i<this.config.body.length; i++) {
    var step = stepForFrame(relativeFrame - 10 * i, offsetX);
    this.ctx.fillText(
        this.config.body[i], step + offsetX, offsetY + ((1 + i) * GU));
  }

  this.texture.needsUpdate = true;
};

TextOverlayLayer.prototype.resize = function() {
  this.canvas.width = 16 * GU;
  this.canvas.height = 9 * GU;
}

function stepForFrame(frame, offsetX) {
  return smoothstep(-16 * GU, 0, (frame - 2 * 60) / 40) +
    lerp(-offsetX / 2, offsetX / 4, (frame - 1 * 60) / 400) +
    smoothstep(0, 16 * GU, (frame - 6 * 60) / 40);
}
