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

        // 모델의 모든 메시에 굴절 효과 추가
        logo_model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshPhysicalMaterial({
                    transmission: 1.0, // 유리 효과
                    ior: 1.5, // 굴절률
                    thickness: 2.0, // 두께
                    roughness: 0.05, // 매끄러움
                    metalness: 0.1,
                    reflectivity: 1.0,  // 반사율 최대로 설정
                    clearcoat: 1.0,     // 표면 투명 코팅 추가
                    clearcoatRoughness: 0.1
                });
            }
        });


        pivot.add(logo_model)
        logo_model.position.set( 1 , 0.3 , 1); // 피벗을 기준으로 모델 

        scene.add( pivot);

    }, undefined, function ( error ) {

        console.error( error );

    } );

    console.log(loader)

    /* Test */
        const geometry_s = new THREE.SphereGeometry( 15, 32, 16 ); 
        const material_s = new THREE.MeshBasicMaterial( { 
            color: 0xeeeeee,
            thickness: 1,
            roughness: 0.15,
            transmission: 1,
        } ); 
        const sphere = new THREE.Mesh( geometry_s, material_s ); 
        sphere.position.set(0,0, -100);
        scene.add( sphere );

    /* Test */

    // 캔버스 텍스처 생성 함수
    function createTextTexture(text, fontSize = 64) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;

        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        return new THREE.CanvasTexture(canvas);
    }

    // 2D 텍스트 평면 추가
    const textTexture = createTextTexture('프리즘 효과');
    const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
    const textGeometry = new THREE.PlaneGeometry(1, 0.5);
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 0, -2); // 더 깊숙이 배치하여 굴절 효과 확인
    scene.add(textMesh);
    
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