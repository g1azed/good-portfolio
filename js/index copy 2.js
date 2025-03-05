import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 1. 기본 씬 설정
const scene = new THREE.Scene();
scene.background = null; // ✅ 배경을 제거하여 유리 효과 극대화

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // ✅ 배경을 투명하게 설정
document.body.appendChild(renderer.domElement);

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
const textTexture = createTextCanvasTexture("Refraction Test");
const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
const textPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), textMaterial);
textPlane.position.set(0, 0, -2); // ✅ GLB 모델 뒤에 배치
scene.add(textPlane);

// 5. 유리 GLB 모델이 Plane을 비추도록 설정
function createGlassMaterial() {
    return new THREE.MeshPhysicalMaterial({
        transmission: 1.0,  // ✅ 완전한 유리
        thickness: 0.3,     // ✅ 두께 조정 (너무 크면 왜곡이 심해질 수 있음)
        roughness: 0.01,    // ✅ 거칠기 최소화 (투명도 향상)
        ior: 1.52,          // ✅ 굴절률 최적화 (1.5~1.7 조정 가능)
        clearcoat: 1.0,     // ✅ 표면 반사 효과 적용
        clearcoatRoughness: 0.05,
        envMapIntensity: 2.0, // ✅ 환경맵 반사 강도 조정
        transparent: true,  // ✅ 투명하게 설정
        opacity: 1,         // ✅ 완전한 투명도 유지
        depthWrite: false,  // ✅ GLB 내부에서 Plane이 보이도록 설정
        side: THREE.DoubleSide, // ✅ 유리 양면을 적용
    });
}

// 6. GLB 모델 로드 및 유리 재질 적용
const loader = new GLTFLoader();
loader.load('../assets/glb/good.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse((child) => {
        if (child.isMesh) {
            child.material = createGlassMaterial();
        }
    });

    model.position.set(0, 0, 0);
    model.scale.set(100, 100, 100);
    scene.add(model);
});

// 7. OrbitControls 추가
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 8. 애니메이션 루프 (GLB가 Plane을 통해 보이도록 설정)
function animate() {
    requestAnimationFrame(animate);
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
