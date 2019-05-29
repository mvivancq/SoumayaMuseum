  //create the scene
var scene = new THREE.Scene( );
var ratio = window.innerWidth/window.innerHeight;
//create the perspective camera
//for parameters see https://threejs.org/docs/#api/cameras/PerspectiveCamera
var camera = new THREE.PerspectiveCamera(45,ratio,0.1,1000);

//set the camera position
camera.position.set(0,50,50);
// and the direction
camera.lookAt(0,0,0);

//create the webgl renderer
var renderer = new THREE.WebGLRenderer( );

//set the size of the rendering window
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCSoftShadowMap;
renderer.setClearColor (0x000011);

//add the renderer to the current document
document.body.appendChild(renderer.domElement );

var cube_mesh;
var sphere_mesh;
var moon_texture;
var sphere_color;
var sphere_geometry;
var sphere_material;
var time_day = 0;
var auto = true;
var dia = false;
var container;

//this clear the scene when parameters are updated
function ClearScene() {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    if(scene.children[i].type == "Mesh") {
      scene.remove(scene.children[i]);
    }
  }
}

function CreateScene() {
  //create the material of the floor (basic material)
  var material_floor = new THREE.MeshPhongMaterial();
  var normal_map = new THREE.TextureLoader().load('img/grass3.jpg');
  normal_map.wrapS = normal_map.wrapT = THREE.RepeatWrapping;
  normal_map.repeat = new THREE.Vector2(6,6);
  normal_map.anisotropy = 16;
  material_floor.map = normal_map;
  var geometry_floor = new THREE.BoxGeometry(50,0.5,50);
  var meshFloor = new THREE.Mesh(geometry_floor, material_floor);
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);

  var material_road1 = new THREE.MeshPhongMaterial();
  var material_road_map = new THREE.TextureLoader().load("/img/floor.png");
  material_road_map.wrapS = material_road_map.wrapT = THREE.RepeatWrapping;
  material_road_map.anisotropy = 16;
  material_road_map.repeat = new THREE.Vector2(2,15);
  material_road1.map = material_road_map;
  var geometry_road1 = new THREE.BoxGeometry(8,0.25,49.9);
  var geometry_road2 = new THREE.BoxGeometry(49.9,0.25,8);
  var meshRoad = new THREE.Mesh(geometry_road1, material_road1);
  meshRoad.receiveShadow = true;
  meshRoad.position.y += 0.130;
  scene.add(meshRoad);

  var material_road2 = new THREE.MeshPhongMaterial();
  var material_road_map = new THREE.TextureLoader().load("/img/floor.png");
  material_road_map.wrapS = material_road_map.wrapT = THREE.RepeatWrapping;
  material_road_map.anisotropy = 16;
  material_road_map.repeat=new THREE.Vector2(15,2);
  material_road2.map = material_road_map;
  var meshRoad = new THREE.Mesh(geometry_road2, material_road2);
  meshRoad.receiveShadow = true;
  meshRoad.position.y += 0.130;
  scene.add(meshRoad);

  var material_stairs = new THREE.MeshPhongMaterial();
  var texture_stairs = new THREE.TextureLoader().load("/img/stairs.jpg");
  texture_stairs.wrapS = material_stairs.wrapT = THREE.RepeatWrapping;
  texture_stairs.anisotropy = 16;
  texture_stairs.color = new THREE.Color(0.8,0.8,0.8);
  material_stairs.map = texture_stairs;
  let initialRadius = 12.5;
  for (var i = 0; i < 10; i++) {
    var geometry_stairs = new THREE.CylinderGeometry(initialRadius - i * 0.3, initialRadius - i * 0.3, 0.1, 64);
    var meshStairs = new THREE.Mesh(geometry_stairs, material_stairs);
    meshStairs.position.y += 0.25 + i * 0.1;
    meshStairs.receiveShadow = true;
    scene.add(meshStairs);
  }

  //sun
  sphere_color = new THREE.Color(0.8,1,1);
  sphere_geometry = new THREE.SphereGeometry(2, 32, 32 );
  sphere_material = new THREE.MeshLambertMaterial();
  moon_texture = new THREE.TextureLoader().load('img/moon.png');
  sphere_material.map = moon_texture;
  sphere_material.color = sphere_color;
  sphere_material.shininess = 100;
  sphere_material.emissive = new THREE.Color("rgb(100, 100, 150)");
  sphere_material.emissiveIntensity = .3;
  sphere_material.wireframe = false;
  sphere_mesh = new THREE.Mesh(sphere_geometry, sphere_material);
  sphere_mesh.position.y = 30;
  scene.add(sphere_mesh);
  
  // model
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  };
  var onError = function () { };
  //Trees
  var mtlTrees = new THREE.MTLLoader();
  mtlTrees.setPath('/models/');
  mtlTrees.load( 'lowpolytree.mtl', function (materials) {
    materials.preload();
    var objTrees = new THREE.OBJLoader();
    objTrees.setMaterials(materials);
    objTrees.setPath('/models/');
    objTrees.load('lowpolytree.obj', function (object) {
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.geometry.computeFaceNormals();
          child.geometry.computeVertexNormals();
          child.geometry.computeBoundingBox();
          var center = child.geometry.boundingBox.getCenter();
          //first quadrant
          for (var i = 0; i < 15; i++) {
            trees1 = new THREE.Mesh(child.geometry, child.material);
            trees1.position.x = Math.floor((Math.random() * 15) + 10);
            trees1.position.y = 2;
            trees1.position.z = Math.floor((Math.random() * 15) + 10);;
            trees1.castShadow = true;
            scene.add( trees1 );
          }
          //second quadrant
          for (var i = 0; i < 15; i++) {
            trees2 = new THREE.Mesh(child.geometry, child.material);
            trees2.position.x = Math.floor((Math.random() * 15) - 23);
            trees2.position.y = 2;
            trees2.position.z = Math.floor((Math.random() * 15) - 23);;
            trees2.castShadow = true;
            scene.add( trees2 );
          }
          //third quadrant
          for (var i = 0; i < 15; i++) {
            trees3 = new THREE.Mesh(child.geometry, child.material);
            trees3.position.x = Math.floor((Math.random() * -15) + 23);
            trees3.position.y = 2;
            trees3.position.z = Math.floor((Math.random() * -15) - 10);
            trees3.castShadow = true;
            scene.add( trees3 );
          }
          //fourth quadrant
          for (var i = 0; i < 15; i++) {
            trees4 = new THREE.Mesh(child.geometry, child.material);
            trees4.position.x = Math.floor((Math.random() * -15) - 10);
            trees4.position.y = 2;
            trees4.position.z = Math.floor((Math.random() * -15) + 25);
            trees4.castShadow = true;
            scene.add( trees4 );
          }
        }
      });
    }, onProgress, onError );
  });
  //Soumaya
  var mtlloader = new THREE.MTLLoader();
  mtlloader.setPath('/models/');
  mtlloader.load('Soumaya1.mtl', function (materials) {
    materials.preload();
    var objloader = new THREE.OBJLoader();
    objloader.setMaterials(materials);
    objloader.setPath('/models/');
    objloader.load('Soumaya1.obj', function ( geometry ) {
      geometry.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.geometry.computeFaceNormals();
          child.geometry.computeVertexNormals();
          child.geometry.computeBoundingBox();
          var center = child.geometry.boundingBox.getCenter();
          var size = child.geometry.boundingBox.getSize();
          museum_mesh = new THREE.Mesh(child.geometry, child.material);
          museum_mesh.scale.set(0.5,0.5,0.5);
          museum_mesh.position.y += 1.25;
          museum_mesh.castShadow = true;
          museum_mesh.name = "loaded_mesh";
          scene.add( museum_mesh );
        }
      });
    }, onProgress, onError);
  });
}

CreateScene();

//lighting
//basic light from camera towards the scene
var cameralight = new THREE.PointLight( new THREE.Color(1,1,1), 0.15 );
camera.add( cameralight );
scene.add(camera);

//then add ambient
//ambient lighting
var ambientlight = new THREE.AmbientLight(new THREE.Color(1,1,1),0.15);
scene.add(ambientlight);

var moonlight = new THREE.PointLight(new THREE.Color("rgb(100, 100, 150)"), 0.3);
moonlight.position.y=30;
moonlight.castShadow = true;
scene.add(moonlight);

controls = new THREE.OrbitControls( camera, renderer.domElement );

//final update loop
var MyUpdateLoop = function () {
  //call the render with the scene and the camera
  renderer.render(scene,camera);
  
  controls.update();
  moonlight.position.x = 40 * Math.cos(3.1416/720*time_day);
  moonlight.position.y = 40 * Math.sin(3.1416/720*time_day);
  sphere_mesh.position.y = moonlight.position.y;
  sphere_mesh.position.x = moonlight.position.x;
  if (auto) {
    time_day+=1;
    if (time_day>720) {
      time_day=0;
      toggleDayN();
    }
  }
  sphere_mesh.rotation.x+=0.01
  requestAnimationFrame(MyUpdateLoop);
};

requestAnimationFrame(MyUpdateLoop);

//this fucntion is called when the window is resized
var MyResize = function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width,height);
  camera.aspect = width/height;
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
};

function toggleDayN() {
  dia = !dia;
  if (dia) {
    moon_texture = new THREE.TextureLoader().load('img/sun.jpg');
    sphere_material.map= moon_texture;
    sphere_material.emissive = new THREE.Color("rgb(231, 248, 14)");
    sphere_material.emissiveIntensity = .5;
    moonlight.color.setHex(0xFFFFCC);
    renderer.setClearColor (0x0080FF);
    moonlight.intensity =  0.5;
  } else {
    moon_texture = new THREE.TextureLoader().load('img/moon.png');
    sphere_material.map= moon_texture;
    sphere_material.emissive = new THREE.Color("rgb(100, 100, 150)");
    sphere_material.emissiveIntensity = .3;
    moonlight.color.setHex(0x646496);
    renderer.setClearColor (0x000011);
    moonlight.intensity =  0.3;
  }
}

var gui;
function buildGui() {
  gui = new dat.GUI();
  var params = {
    time: time_day,
    day_night: dia,
    auto: auto
  };
  gui.add(params, 'time', 0, 720).onChange(function(val) {
    time_day = val;
  });
  gui.add(params, 'auto', 0, 1).onChange(function() {
    auto = !auto;
  });
  gui.add(params, 'day_night', 0, 1).onChange(toggleDayN);
  gui.open();
}
buildGui();

//link the resize of the window to the update of the camera
window.addEventListener( 'resize', MyResize);
