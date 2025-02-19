import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';



if ( WebGL.isWebGL2Available() ) {
    const container = document.getElementById("glass-lens-container");
    console.log(container)

    const renderer = new THREE.WebGLRenderer({  antialias: true });
    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(  window.innerWidth , window.innerHeight );
    renderer.setAnimationLoop( animate );
    container.appendChild( renderer.domElement );
    // document.body.appendChild( renderer.domElement );

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    console.log(cube)
    
    camera.position.z = 5;
    
    function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    
        renderer.render( scene, camera );
    
    }

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( 'glass-lens-container' ).appendChild( warning );

}