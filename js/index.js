import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { createComposer, createCamera, createRenderer, runApp, updateLoadingProgressBar } from "./core-utils.js";
import { loadHDRI } from "./common-utils.js";

import EnvMap from "../assets/empty_warehouse_01_4k.hdr";
import TransmissionShader from "../assets/shaders/transmission_pars_fragment.glsl?raw"; // 👈 ?raw 추가


// 나머지 로직은 기존과 동일
THREE.ColorManagement.enabled = true;

const params = {
    thickness: 1,
};

// Create the scene
let scene = new THREE.Scene();

// Create the renderer
let renderer = createRenderer({ antialias: true }, (_renderer) => {
    // 최신 Three.js 버전 호환성을 위해 변경
    _renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
});


// Create the camera
let camera = createCamera(45, 1, 100, { x: 0, y: 0, z: 5 });

let app = {
    async initScene() {
        // OrbitControls
        // this.controls = new OrbitControls(camera, renderer.domElement);
        // this.controls.enableDamping = true;

        await updateLoadingProgressBar(0.1);

        let envMap = await loadHDRI(EnvMap);
        await updateLoadingProgressBar(0.3);

        // 텍스처 배경 추가
        const ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = 2048;
        ctx.canvas.height = 2048;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#FFF";
        ctx.font = "bold 512px Helvetica";
        ctx.textAlign = "center";
        ctx.fillText("Release", 1024, 768, 2048);
        ctx.fillText("Your", 1024, 1248, 2048);
        ctx.fillText("Power", 1024, 1728, 2048);
        const texture = new THREE.CanvasTexture(ctx.canvas);

        const plane = new THREE.PlaneGeometry(4, 4, 1, 1);
        const mat = new THREE.MeshBasicMaterial({
            map: texture,
        });
        const bg = new THREE.Mesh(plane, mat);
        scene.add(bg);

        // 기존 Geometry 제거 후 GLTF 모델 로드
        let refractionMaterial = new THREE.MeshPhysicalMaterial({
            thickness: 0.01,
            roughness: 0.15,
            transmission: 1,
            envMap: envMap,
            side: THREE.DoubleSide,
        });

        // GLTF 모델 로드'
        const pivot = new THREE.Object3D();
        scene.add(pivot);


        let loader = new GLTFLoader();
        loader.load( "../assets/glb/good.glb", (gltf) => {
                const model = gltf.scene;

                // 모델 내부의 모든 Mesh에 Material 적용
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.material = refractionMaterial;
                    }
                });

                // 모델의 위치 및 크기 조정
                pivot.add(model)
                
                model.position.set( -1 , -0.5 , 0); 
                model.scale.set(100, 100, 100);

                // 기존 this.mesh 대체
                this.mesh = model;
                scene.add(this.mesh);
            },
            undefined,
            (error) => {
                console.error("GLTF 로드 실패:", error);
            }
        );

        // Shader 적용
        refractionMaterial.onBeforeCompile = function (shader) {
        
            // `material.ior`이 존재하면 `ior`으로 변경
            // if (shader.fragmentShader.includes("material.ior")) {
            //     console.error("🚨 ERROR: material.ior is still present! Replacing with ior...");
            //     shader.fragmentShader = shader.fragmentShader.replace(/material.ior/g, "ior");
            // }
        
            // console.log("Updated Fragment Shader:\n", shader.fragmentShader);
        };        
    },

    updateScene(interval, elapsed) {
        // this.controls.update();
        // this.stats1.update();

        // GLTF 모델 애니메이션 적용
        if (this.mesh) {
            // this.mesh.rotation.z =
            // (Math.sin(2 * elapsed * 0.4) + Math.sin(Math.PI / 2 * elapsed * 0.4)) *
            // 0.2;
            // this.mesh.rotation.y =
            //   (Math.sin(2 * elapsed * 0.5) + Math.sin(Math.PI * elapsed * 0.5)) * 0.4;
            // this.mesh.rotation.y += 0.1;
        }
    },
};


// createComposer를 사용하여 후처리 적용
let composer = createComposer(renderer, scene, camera, (composer) => {
    // console.log("EffectComposer 초기화 완료:", composer);
});

// runApp 실행 시 composer 추가
runApp(app, scene, renderer, camera, true, undefined, composer);

