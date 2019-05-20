//create the scene
    var scene = new THREE.Scene( );
    var ratio = window.innerWidth/window.innerHeight;
    //create the perspective camera
    //for parameters see https://threejs.org/docs/#api/cameras/PerspectiveCamera
    var camera = new THREE.PerspectiveCamera(45,ratio,0.1,1000);

    //set the camera position
    camera.position.set(0,0,15);
    // and the direction
	  camera.lookAt(0,0,1);

    //create the webgl renderer
    var renderer = new THREE.WebGLRenderer( );

    //set the size of the rendering window
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCSoftShadowMap;

    //add the renderer to the current document
    document.body.appendChild(renderer.domElement );

    var cube_mesh;
    var sphere_mesh;
    var moon_texture;
    var sphere_color;
    var sphere_geometry;
    var sphere_material;
    var time_day = 0;
    var direction = 1;
    var dia = false;

    //this clear the scene when parameters are updated
    function ClearScene()
    {
      for (let i = scene.children.length - 1; i >= 0; i--)
        if(scene.children[i].type == "Mesh")
            scene.remove(scene.children[i]);
    }

    function CreateScene()
    {
      //create the material of the floor (basic material)
      var material_floor = new THREE.MeshPhongMaterial();
      material_floor.shininess=100;
      material_floor.color=  new THREE.Color(0.8,0.8,0.8);
      material_floor.side = THREE.DoubleSide;
      var normal_map = new THREE.TextureLoader().load('img/normal_map.gif');
      normal_map.wrapS = normal_map.wrapT = THREE.RepeatWrapping;
      normal_map.repeat=new THREE.Vector2(6,6);
      material_floor.normalMap= normal_map;
      var geometry_floor = new THREE.BoxGeometry(50,0.5,50);
      var meshFloor= new THREE.Mesh( geometry_floor, material_floor );
      meshFloor.receiveShadow=true;
      scene.add( meshFloor );

      //sun
      sphere_color = new THREE.Color(0.8,1,1);
      sphere_geometry = new THREE.SphereGeometry(2, 32, 32 );
      sphere_material = new THREE.MeshLambertMaterial();
      moon_texture = new THREE.TextureLoader().load('img/moon.png');
      sphere_material.map= moon_texture;
      sphere_material.color=sphere_color;
      sphere_material.shininess=100;
      sphere_material.emissive = new THREE.Color("rgb(100, 100, 150)");
      sphere_material.emissiveIntensity = .3;

      sphere_material.wireframe=false;
      sphere_mesh = new THREE.Mesh( sphere_geometry, sphere_material );
      sphere_mesh.position.y = 30;
      scene.add( sphere_mesh );

      var loader = new THREE.STLLoader();
      var museum_mesh = null;
      loader.load('models/Soumaya.stl', function ( geometry ) {
            geometry.computeVertexNormals();
            geometry.computeBoundingBox();

            var center = geometry.boundingBox.getCenter();
            var size = geometry.boundingBox.getSize();

            var material = new THREE.MeshPhongMaterial();
            material.color= new THREE.Color(0.8, 0.8, 0.8);
            material.shininess=100;
            museum_mesh = new THREE.Mesh( geometry, material );
            museum_mesh.scale.set(0.5,0.5,0.5);
            museum_mesh.position.x-=size.x/4;
            museum_mesh.position.z-=size.z/4;
            museum_mesh.position.y+=0.5;
            museum_mesh.castShadow = true;
            museum_mesh.name = "loaded_mesh";

            scene.add( museum_mesh );
        } );
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
  var MyUpdateLoop = function ( )
  {
    //call the render with the scene and the camera
    renderer.render(scene,camera);

    controls.update();
    if (direction == 1) {
      moonlight.position.x = 40 * Math.cos(3.1416/12*time_day);
      moonlight.position.y = 40 * Math.sin(3.1416/12*time_day);
      sphere_mesh.position.y = moonlight.position.y;
      sphere_mesh.position.x = moonlight.position.x;
      if (time_day > 12) {
        direction = 2;
      }
    }
    sphere_mesh.rotation.x+=0.01
    requestAnimationFrame(MyUpdateLoop);

  };

  requestAnimationFrame(MyUpdateLoop);

  //this fucntion is called when the window is resized
  var MyResize = function ( )
  {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.render(scene,camera);
  };

  var gui;
  function buildGui()
  {
    gui = new dat.GUI();
    var params = {
      time: time_day,
      day_nigth: dia
    };
    gui.add(params, 'time', 0, 12).onChange(function(val){
      time_day = val;
    });
    gui.add(params, 'day_nigth', 0, 1).onChange(function(val){
      dia = !dia;
      if (dia) {
        moon_texture = new THREE.TextureLoader().load('img/sun.jpg');
        sphere_material.map= moon_texture;
        sphere_material.emissive = new THREE.Color("rgb(231, 248, 14)");
        sphere_material.emissiveIntensity = .5;
        moonlight.color.setHex(0xFFFF99);
        moonlight.intensity =  0.5;
      }
      else {
        moon_texture = new THREE.TextureLoader().load('img/moon.png');
        sphere_material.map= moon_texture;
        sphere_material.emissive = new THREE.Color("rgb(100, 100, 150)");
        sphere_material.emissiveIntensity = .3;
        moonlight.color.setHex(0x646496);
        moonlight.intensity =  0.3;
      }
    });
    gui.open();
  }
  buildGui();

  //link the resize of the window to the update of the camera
  window.addEventListener( 'resize', MyResize);
