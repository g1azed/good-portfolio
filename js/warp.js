import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 기본 Three.js 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 5);

const container = document.getElementById("warp-div");
console.log(container)

const renderer = new THREE.WebGLRenderer({  antialias: true });
// renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(  window.innerWidth , window.innerHeight );
renderer.setAnimationLoop( animate );
container.appendChild( renderer.domElement );

// ✅ 텍스처 로드
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("../assets/mapping_test.jpg"); // 파일 경로를 넣어야 함

// 📌 PlaneGeometry 생성 (가로 세분화 높임)
const width = 8;
const height = 4;
const segmentsX = 100; // X축 세분화 (더 부드러운 변형을 위해 증가)
const segmentsY = 20;
const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
const material = new THREE.MeshBasicMaterial({  map: texture, side: THREE.DoubleSide });
const paper = new THREE.Mesh(geometry, material);
paper.rotateY(Math.PI )
scene.add(paper);

// ✅ 원본 Vertex 데이터 저장 (애니메이션을 위해 필요)
const positionAttribute = geometry.attributes.position;
const vertexCount = positionAttribute.count;
const originalPositions = new Float32Array(positionAttribute.array); // 초기 좌표 저장

// 🎯 원통형으로 말기 & 펼치기 함수
function transformPaper(progress) {
    const positions = positionAttribute.array;
    const radius = width / (2 * Math.PI); // 🌟 원통 반지름 (너비를 기준으로 계산)

    for (let i = 0; i < vertexCount; i++) {
        const index = i * 3;
        const x = originalPositions[index]; // 원본 X 좌표
        const y = originalPositions[index + 1]; // 원본 Y 좌표

        const theta = (x / width) * Math.PI * 2 * progress; // 🌟 원통형 변형 비율 적용

        // 📌 애니메이션: 원통형 <-> 평면 변환
        positions[index] = radius * Math.sin(theta) * progress + x * (1 - progress); // X 좌표 보정
        positions[index + 2] = radius * (1 - Math.cos(theta)) * progress; // Z축 변형

    }

    positionAttribute.needsUpdate = true; // 업데이트 적용
}

// ✅ GSAP ScrollTrigger 적용
let progressData = { progress: 1 };

gsap.to(progressData, {
    progress: 0,
    ease: "none", // 스크롤에 맞춰 정확히 따라가도록 설정
    scrollTrigger: {
        // markers : true,
        trigger: renderer.domElement, // 스크롤 감지 대상
        start: "top-=500px center", // 시작 지점 (화면 상단에서 애니메이션 시작)
        end: "bottom bottom", // 종료 지점 (스크롤을 끝까지 내리면 애니메이션 완료)
        scrub: 1, // 📌 스크롤에 따라 점진적으로 애니메이션 진행
        // pin: true, // 애니메이션이 진행되는 동안 고정
    },
    onUpdate: function () {
        transformPaper(progressData.progress);
    },
});

// 렌더링 루프
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
