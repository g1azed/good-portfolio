import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

if ( WebGL.isWebGL2Available() ) {

    // scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 10;

    //renderer
    const container = document.getElementById("warp-div");
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

    // curved
    // ✅ 곡선 Plane 생성
    const width = 50, height = 10;
    const segments = 50; // 세그먼트 수 (곡선의 부드러움을 조절)

    // PlaneGeometry 생성
    const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
    const position = geometry.attributes.position;

    const radius = 5;
    const angleMax = Math.PI / 2;
    let x, y, z;
    let theta, newX;

    // ✅ Plane을 곡선 형태로 변형 (x 축 방향으로 곡선 적용)
    for (let i = 0; i < position.count; i++) {
        x = position.getX(i);
        y = position.getY(i);
        theta = ( x / width) * angleMax * 2 - angleMax; // X를 기준으로 각도 변환 (-π/2 ~ π/2)
        newX = Math.sin(theta) * radius; // X축의 위치를 원의 호를 따라 조정
        z = Math.cos(theta) * radius - radius; // 원형 곡선 적용 (중심 조정)
        position.setXYZ(i, newX, y, z);
    }
    console.log(position)

    geometry.attributes.position.needsUpdate = true; // 변경 사항 적용

    // ✅ 텍스처 로드
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("../assets/mapping_test.jpg"); // 파일 경로를 넣어야 함

    // ✅ Mesh 생성
    // const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    geometry.center(); // 중심을 (0, 0, 0)으로 이동
    mesh.rotateY(Math.PI / 2);
    // mesh.rotateY(0);

    scene.add(mesh);

    // gsap 
    let scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top center",
        end: "bottom bottom",
        scrub: 1,
        markers: {
            startColor: 'red',
            endColor: 'red'
        },
        onUpdate: (self) => {
            console.log("progress:", self.progress);
            let progress = self.progress;
            for (let i = 0; i < position.count; i++) {
                let normalizedX = (i % (segments + 1)) / segments; // 0 ~ 1 사이의 X 좌표
                x = (normalizedX - 0.5) * width * (1 + progress * 0.5); // ✅ 너비 유지하면서 확장
                y = position.getY(i);
                z = 0; // ✅ 모든 Z 값을 0으로 설정하여 평평하게 만듦
            
                position.setXYZ(i, x, y, z);
        
            }
            mesh.rotation.y = 0; // Y축 회전을 0으로 초기화
        }

    });

    gsap.to(mesh.geometry.attributes.position.array, {
        scrollTrigger: scrollTrigger, // ✅ ScrollTrigger 인스턴스를 참조
        onUpdate: (e) => {
            position.needsUpdate = true; // 업데이트 적용
        },

        duration: 1,
    });

    function animate() {
        renderer.render( scene, camera );
        requestAnimationFrame(animate);
    }

	// Initiate function or other initializations here
	animate();

    console.log(mesh); 
    console.log(geometry); 

} else {

	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( 'warp-div' ).appendChild( warning );

}