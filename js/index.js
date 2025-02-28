import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



if ( WebGL.isWebGL2Available() ) {

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 1;

    //renderer
    const container = document.getElementById("glass-lens-container");
    console.log(container)

    const renderer = new THREE.WebGLRenderer({  antialias: true });
    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(  window.innerWidth , window.innerHeight );
    renderer.setAnimationLoop( animate );
    container.appendChild( renderer.domElement );

    // light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(20, 40, 0);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // 전체적으로 밝기를 보정
    scene.add(ambientLight);


    // geometry
    // 모델 추가
    const pivot = new THREE.Object3D();
    scene.add(pivot);

    // 축 헬퍼 추가 => 주석처리
    // const axesHelper = new THREE.AxesHelper(5);
    // pivot.add(axesHelper);

    const loader = new GLTFLoader();
    let logo_model;
    loader.load( '../assets/glb/good.glb', function ( gltf ) {

        logo_model = gltf.scene;
        logo_model.scale.set(40, 40, 40);

        pivot.add(logo_model)
        logo_model.position.set( -0.35 , -0.3 , -0.1); // 피벗을 기준으로 모델 

        scene.add( pivot);

    }, undefined, function ( error ) {

        console.error( error );

    } );

    console.log(loader)
    
    function animate() {

        // pivot.rotation.x += 0.01
        pivot.rotation.y += 0.01
        // pivot.rotation.z += 0.01
        renderer.render( scene, camera );
    
    }

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( 'glass-lens-container' ).appendChild( warning );

}