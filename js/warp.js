import * as THREE from 'three';
import gsap from 'gsap';

// Three.js 기본 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// PlaneGeometry 생성 (세분화 필수)
const width = 3;
const height = 2;
const segmentsX = 100;
const segmentsY = 20;
const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
const material = new THREE.MeshBasicMaterial({ color: 0xffddaa, side: THREE.DoubleSide, wireframe: true });
const paper = new THREE.Mesh(geometry, material);
scene.add(paper);

// 원본 Vertex 데이터 저장
const positionAttribute = geometry.attributes.position;
const vertexCount = positionAttribute.count;
const originalPositions = new Float32Array(positionAttribute.array); // 초기 좌표 저장

// 🌟 원통형으로 말기
function curlPaper(progress) {
    const positions = positionAttribute.array;
    const radius = width / (2 * Math.PI); // 원통의 반지름 설정

    for (let i = 0; i < vertexCount; i++) {
        const index = i * 3;
        const x = originalPositions[index]; // 원본 X 좌표
        const y = originalPositions[index + 1]; // 원본 Y 좌표

        const leftEdge = -width / 2;
        const rightEdge = width / 2;
        
        // 🎯 X 위치에 따라 원통 곡률 적용
        if (x < leftEdge + 0.5 || x > rightEdge - 0.5) {
            const direction = x < 0 ? -1 : 1; // 왼쪽(-1), 오른쪽(1) 구분
            const dist = Math.abs(x - (direction < 0 ? leftEdge : rightEdge));
            const theta = (dist / width) * Math.PI * progress; // 🎯 원통 회전 각도 (θ)
            
            // 🌟 원통 좌표 변환 적용 (극좌표 -> 데카르트 좌표)
            positions[index] = radius * Math.sin(theta) * direction;
            positions[index + 2] = radius * (1 - Math.cos(theta));
        }
    }

    positionAttribute.needsUpdate = true; // 위치 정보 업데이트
}

// GSAP 애니메이션: 점점 말려서 원통형으로
gsap.to({ progress: 0 }, {
    progress: 1,
    duration: 3,
    onUpdate: function () {
        curlPaper(this.targets()[0].progress);
    },
    ease: "power2.inOut"
});

// 렌더링 루프
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
