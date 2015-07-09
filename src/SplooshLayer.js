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
  this.stains = [];
  this.stains_mesh = [];
  this.create_droplet();
  this.create_droplet();
  this.create_droplet();
  this.create_droplet();
  this.create_droplet();
  var local_random = Random(234);
  this.create_stain(local_random);
  this.create_stain(local_random);
  this.create_stain(local_random);
  this.create_stain(local_random);
  this.create_stain(local_random);
  this.create_stain(local_random);
}

SplooshLayer.prototype.create_droplet = function() {
    var droplet = new THREE.Object3D();
    var circles = [];

    for(var i=0;i<this.num_circles;i++) {
        var material = new THREE.MeshBasicMaterial({
            color: 0x5260BF
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

SplooshLayer.prototype.create_stain = function(local_random) {
    var stain = new THREE.Object3D();
    var circles = [];

    for(var i=0;i<this.num_circles;i++) {
        var material = new THREE.MeshBasicMaterial({
            color: 0x5260BF
        });
        var radius = 1.1;
        var segments = 32;
        var circleGeometry = new THREE.CircleGeometry( radius, segments );                
        circles.push( new THREE.Mesh( circleGeometry, material ));
        circles[i].position.x = (-0.5+local_random())*5;
        circles[i].position.y = (-0.5+local_random())*5;
        stain.add(circles[i]);
    }
    this.stains.push(circles);
    this.stains_mesh.push(stain);
    this.scene.add(stain);
}

SplooshLayer.prototype.update = function(frame) {
    var start1 = 3840;
    var start2 = 4000;
    var start3 = 4060;
    var start4 = 4120;
    var start5 = 4163;
    var duration = 160;

    for(var i=0;i<this.num_circles;i++) {
        var x_wiggle = -easeOut(0,4.5,i/35) * easeIn(1,0,(frame-start1)/duration);
        this.droplets[0][i].position.x = x_wiggle + easeOut(-9,5,(frame-start1)/duration) + ((frame-start1)>84?22:0);
        var y_wiggle = 2*Math.sqrt(i/this.num_circles)*Math.sin(8*Math.sqrt((i+(frame/1))/this.num_circles*Math.PI))+Math.sin(i+frame/2)/10;
        this.droplets[0][i].position.y = y_wiggle + easeOut(-5,2,(frame-start1)/duration);

        var x_wiggle = easeOut(0,4.5,i/35) * easeIn(1,0,(frame-start2)/duration);
        this.droplets[1][i].position.x = x_wiggle - easeOut(-9,5,(frame-start2)/duration) + ((frame-start2)>84?22:0);
        var y_wiggle = 2*Math.sqrt(i/this.num_circles)*Math.sin(8*Math.sqrt((i+(frame/1))/this.num_circles*Math.PI))+Math.sin(i+frame/2)/10;
        this.droplets[1][i].position.y = y_wiggle + easeOut(-5,2,(frame-start2)/duration);

        var x_wiggle = -easeOut(0,4.5,i/35) * easeIn(1,0,(frame-start3)/duration);
        this.droplets[2][i].position.x = x_wiggle + easeOut(-9,5,(frame-start3)/duration) + ((frame-start3)>84?22:0);
        var y_wiggle = 2*Math.sqrt(i/this.num_circles)*Math.sin(8*Math.sqrt((i+(frame/1))/this.num_circles*Math.PI))+Math.sin(i+frame/2)/10;
        this.droplets[2][i].position.y = y_wiggle + easeOut(-5,2,(frame-start3)/duration);

        var x_wiggle = easeOut(0,4.5,i/35) * easeIn(1,0,(frame-start4)/duration);
        this.droplets[3][i].position.x = x_wiggle - easeOut(-9,5,(frame-start4)/duration) + ((frame-start4)>84?22:0);
        var y_wiggle = 2*Math.sqrt(i/this.num_circles)*Math.sin(8*Math.sqrt((i+(frame/1))/this.num_circles*Math.PI))+Math.sin(i+frame/2)/10;
        this.droplets[3][i].position.y = y_wiggle + easeOut(-5,2,(frame-start4)/duration);

        var x_wiggle = -easeOut(0,4.5,i/35) * easeIn(1,0,(frame-start5)/duration);
        this.droplets[4][i].position.x = x_wiggle + easeOut(-9,0,(frame-start5)/duration) + ((frame-start5)>84?22:0);
        var y_wiggle = 2*Math.sqrt(i/this.num_circles)*Math.sin(8*Math.sqrt((i+(frame/1))/this.num_circles*Math.PI))+Math.sin(i+frame/2)/10;
        this.droplets[4][i].position.y = y_wiggle + easeOut(-5,1,(frame-start5)/duration);
    }

    var splat1 = start1 + 84;
    var splat2 = start2 + 84;
    var splat3 = start3 + 84;
    var splat4 = start4 + 84;
    var splat5 = start5 + 84;
    var splat6 = start5 + 89;

    this.stains_mesh[0].position.x = 22;
    this.stains_mesh[1].position.x = 22;
    this.stains_mesh[2].position.x = 22;
    this.stains_mesh[3].position.x = 22;
    this.stains_mesh[4].position.x = 22;
    this.stains_mesh[5].position.x = 22;
    if(frame > splat1) {
        var stain_size = easeOut(0,1,(frame-splat1)/30);
        this.stains_mesh[0].scale.set(stain_size, stain_size, stain_size);
        this.stains_mesh[0].position.x = 5;
        this.stains_mesh[0].position.y = 2-(frame-splat1)/30;
    }
    if(frame > splat2) {
        var stain_size = easeOut(0,1.1,(frame-splat2)/30);
        this.stains_mesh[1].scale.set(stain_size, stain_size, stain_size);
        this.stains_mesh[1].position.x = -5;
        this.stains_mesh[1].position.y = 2-(frame-splat2)/30;
    }
    if(frame > splat3) {
        var stain_size = easeOut(0,1.3,(frame-splat3)/30);
        this.stains_mesh[2].scale.set(stain_size, stain_size, stain_size);
        this.stains_mesh[2].position.x = 5;
        this.stains_mesh[2].position.y = 2-(frame-splat3)/30;
    }
    if(frame > splat4) {
        var stain_size = easeOut(0,1.2,(frame-splat4)/30);
        this.stains_mesh[3].scale.set(stain_size, stain_size, stain_size);
        this.stains_mesh[3].position.x = -5;
        this.stains_mesh[3].position.y = 2-(frame-splat4)/30;
    }
    if(frame > splat5) {
        var stain_size = easeOut(0,2,(frame-splat5)/30);
        this.stains_mesh[4].scale.set(stain_size, stain_size, stain_size);
        this.stains_mesh[4].position.x = 0;
        this.stains_mesh[4].position.y = 1-(frame-splat5)/30;
    }
    if(frame > splat6) {
        var stain_size = easeOut(0,3,(frame-splat6)/20);
        this.stains_mesh[5].scale.set(stain_size, stain_size, stain_size);
        this.stains_mesh[5].position.x = 0;
        this.stains_mesh[5].position.y = 2;
    }
    if(frame > splat6 + 20) {
        this.stains_mesh[0].position.x = 22;
        this.stains_mesh[1].position.x = 22;
        this.stains_mesh[2].position.x = 22;
        this.stains_mesh[3].position.x = 22;
        this.stains_mesh[4].position.x = 22;
        this.stains_mesh[5].position.y = 2-(frame-splat6)/4;
    }
};

SplooshLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};
