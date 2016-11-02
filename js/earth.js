// Created by Bjorn Sandvik - thematicmapping.org
var Demo = function () 
{
  var webglEl = document.getElementById('webgl');

  if (!Detector.webgl) 
  {
    Detector.addGetWebGLMessage(webglEl);
    return;
  }

  var width  = window.innerWidth;
  var height = window.innerHeight;

  // Earth params
  var radius   = 0.5;
  var segments = 32;
  var rotation = 6;  

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
  camera.position.z = 1.5;

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  scene.add(new THREE.AmbientLight(0x333333));

  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5,3,5);
  scene.add(light);

  this.sphere = createSphere(radius, segments);
  this.sphere.tex_map = this.sphere.material.map;
  this.sphere.bump_map = this.sphere.material.bumpMap;
  this.sphere.specular_map = this.sphere.material.specularMap;

  this.sphere.rotation.y = rotation; 
  scene.add(this.sphere);

  var clouds = createClouds(radius, segments);
  clouds.rotation.y = rotation;
  scene.add(clouds);

  var stars = createStars(90, 64);
  scene.add(stars);

  var controls = new THREE.TrackballControls(camera);

  webglEl.appendChild(renderer.domElement);

  render();

  function render() {
    controls.update();
    //sphere.rotation.y += 0.0005;
    clouds.rotation.y += 0.0001;    
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function createSphere(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, segments),
      new THREE.MeshPhongMaterial({
        map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
        bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
        bumpScale:   0.005,
        specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
        specular:    new THREE.Color('grey')                
      })
    );
  }

  function createClouds(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius + 0.003, segments, segments),      
      new THREE.MeshPhongMaterial({
        map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
        transparent: true
      })
    );    
  }

  function createStars(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, segments), 
      new THREE.MeshBasicMaterial({
        map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
        side: THREE.BackSide
      })
    );
  }

};
var demo = new Demo();

function update_material()
{
  demo.sphere.material.map = document.getElementById('texture_box').checked ?
    demo.sphere.tex_map : '';
  demo.sphere.material.bumpMap = document.getElementById('bump_box').checked ?
    demo.sphere.bump_map : '';
  demo.sphere.material.specularMap = document.getElementById('specular_box').checked ?
    demo.sphere.specular_map : '';
  if(document.getElementById('wireframe_box').checked)
  {
    // Don't use bump map during wireframe
    demo.sphere.material.bumpMap = '';
    demo.sphere.material.wireframe = true;
  }else
  {
    demo.sphere.material.wireframe = false;
  }
  demo.sphere.material.needsUpdate = true;
}
