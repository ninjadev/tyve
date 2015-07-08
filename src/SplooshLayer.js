/*
 * @constructor
 */
function SplooshLayer(layer) {
  this.num_circles = 35;

  this.scene = new THREE.Scene();
  this.camera = new THREE.OrthographicCamera(
      16 / -2,
      16 / 2,
      9 / 2,
      9 / -2,
      1,
      1000);
  this.scene.add(this.camera);
  this.camera.position.z = 100;
  this.renderPass = new THREE.RenderPass(this.scene, this.camera);

  this.droplets = [];
  this.create_droplet();
  this.create_droplet();
}

SplooshLayer.prototype.create_droplet = function() {
    var droplet = new THREE.Object3D();
    var circles = [];

    for(var i=0;i<this.num_circles;i++) {
        var material = new THREE.MeshBasicMaterial({
            color: 0xaf219b
        });
        var radius = Math.sqrt(1/i);
        var segments = 32;
        var circleGeometry = new THREE.CircleGeometry( radius, segments );                
        circles.push( new THREE.Mesh( circleGeometry, material ));
        circles[i].position.x = easeOut(0,4.5,i/this.num_circles);
        circles[i].position.y = easeOut(0,1.5,i/this.num_circles);
        if(i<22)droplet.add(circles[i]);
    }
    this.droplets.push(circles);
    this.scene.add(droplet);
}

SplooshLayer.prototype.update = function(frame) {
    //Hide the robot image at the start.
    
    var start1 = 3840;
    var start2 = 4000;
    var duration = 160;

    for(var i=0;i<this.num_circles;i++) {
        var x_wiggle = -easeOut(0,4.5,i/35) * easeIn(1,0,(frame-start1)/duration);
        this.droplets[0][i].position.x = x_wiggle + easeOut(-9,5,(frame-start1)/duration);
        var y_wiggle = 2*Math.sqrt(i/this.num_circles)*Math.sin(8*Math.sqrt((i+(frame/1))/this.num_circles*Math.PI))+Math.sin(i+frame/2)/10;
        this.droplets[0][i].position.y = y_wiggle + easeOut(-5,2,(frame-start1)/duration);

        var x_wiggle = easeOut(0,4.5,i/35) * easeIn(1,0,(frame-start2)/duration);
        this.droplets[1][i].position.x = x_wiggle - easeOut(-9,5,(frame-start2)/duration);
        var y_wiggle = 2*Math.sqrt(i/this.num_circles)*Math.sin(8*Math.sqrt((i+(frame/1))/this.num_circles*Math.PI))+Math.sin(i+frame/2)/10;
        this.droplets[1][i].position.y = y_wiggle + easeOut(-5,2,(frame-start2)/duration);
    }
};

SplooshLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};
