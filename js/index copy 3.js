import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


document.addEventListener("DOMContentLoaded", () => {

    const vertexShaderScript = document.getElementById('vertexShader');
    const fragmentShaderScript = document.getElementById('fragmentShader');

    if (!vertexShaderScript || !fragmentShaderScript) {
        console.error("❌ Shader script not found! HTML 파일을 확인하세요.");
        return;
    }

    const vertexShader = vertexShaderScript.textContent;
    const fragmentShader = fragmentShaderScript.textContent;

    console.log("✅ Vertex Shader Loaded:", vertexShader);
    console.log("✅ Fragment Shader Loaded:", fragmentShader);
    

    // 1. 기본 씬 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 2. 텍스트 Plane 생성
    const textTexture = new THREE.TextureLoader().load('../assets/roughness.jpg'); // 텍스트 이미지 로드
    const textMaterial = new THREE.ShaderMaterial({
        uniforms: {
            textTexture: { value: textTexture }
        },
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        transparent: true
    });

    const textPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), textMaterial);
    textPlane.position.set(0, 0, -2);
    scene.add(textPlane);

    // 3. GLB 로드 및 굴절 셰이더 적용
    const loader = new GLTFLoader();
    loader.load('../assets/glb/good.glb', function (gltf) {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(100, 100, 100);
        // 모델에 굴절 셰이더 적용  
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.ShaderMaterial({
                    uniforms: {
                        textTexture: { value: textTexture }
                    },
                    vertexShader: document.getElementById('vertexShader').textContent,
                    fragmentShader: document.getElementById('fragmentShader').textContent,
                    transparent: true
                });
            }
        });

        scene.add(model);
    });

    // 4. 애니메이션 루프
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

});

