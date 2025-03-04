import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 1. 기본 씬 설정
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222); // ✅ 배경을 제거하여 유리 효과 극대화

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // ✅ 배경을 투명하게 설정
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


// 2. HDR 환경맵 로드 (유리 반사 최적화)
const rgbeLoader = new RGBELoader();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
rgbeLoader.load('../assets/glb/empty_warehouse_01_4k.hdr', function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    pmremGenerator.dispose();
});

// 3. 텍스트 Plane (GLB 뒤에 배치하여 투과 테스트)
function createTextCanvasTexture(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 512;

    ctx.fillStyle = 'rgba(255,255,255,0)'; // ✅ 배경을 투명하게 설정
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// 4. Plane을 GLB 모델 뒤에 배치
const renderTarget = new THREE.WebGLRenderTarget(512, 512);
const textTexture = createTextCanvasTexture("Hello World");

const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
const textPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), textMaterial);
textPlane.position.set(0, 0, -2); // ✅ GLB 모델 뒤에 배치
scene.add(textPlane);



function captureRenderTarget() {
    renderer.setRenderTarget(renderTarget);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
}

const glassMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTexture: { value: textTexture },
        uRefractionRatio: { value: 1.2 },
        uDistortion: { value: 0.05 },
        baseColor: { value: new THREE.Color(0.3, 0.3, 0.3) } // 예시 기본 색상
    },
    vertexShader: `...`,
    fragmentShader: `...`, // 위 수정된 코드 적용
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
            uniform sampler2D uTexture;
            uniform float uRefractionRatio;
            uniform float uDistortion;
            uniform vec3 baseColor;
            varying vec2 vUv;

            void main() {
                vec2 distortedUV = vUv;
                distortedUV.x += sin(distortedUV.y * 10.0) * uDistortion;
                vec4 texColor = texture2D(uTexture, distortedUV);

                float refraction = uRefractionRatio * (texColor.r - 0.5);
                vec2 refractedUV = vUv + refraction * vec2(0.02, 0.02);
                vec4 finalColor = texture2D(uTexture, refractedUV);
                
                // baseColor를 추가하여 텍스처가 투명한 부분에도 색상을 보이도록 함
                gl_FragColor = vec4(finalColor.rgb + baseColor * (1.0 - texColor.a), 0.8);
            }

    `,
    transparent: true,  // ✅ 투명 재질 허용
    depthWrite: false,  // ✅ 깊이 버퍼 쓰기 비활성화 (투명 모델 처리 문제 방지)
    side: THREE.DoubleSide // ✅ 양면 렌더링 설정
});



// 6. GLB 모델 로드 및 유리 재질 적용
const loader = new GLTFLoader();
loader.load('../assets/glb/good.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse((child) => {
        if (child.isMesh) {
            child.material = glassMaterial; // ✅ ShaderMaterial 적용
        }
    });

    model.position.set(0, 0, 0);
    model.scale.set(100, 100, 100);
    scene.add(model);

    const box = new THREE.Box3().setFromObject(model);
    console.log("모델 크기:", box.getSize(new THREE.Vector3())); // ✅ 모델 크기 확인
});




// 7. OrbitControls 추가
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 8. 애니메이션 루프 (GLB가 Plane을 통해 보이도록 설정)
function animate() {
    requestAnimationFrame(animate);

    captureRenderTarget();
    controls.update();
    renderer.render(scene, camera);
}
animate();

// 9. 반응형 리사이징 처리
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
