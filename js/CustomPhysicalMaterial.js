import * as THREE from 'three';
import TransmissionShader from "../assets/shaders/transmission_pars_fragment.glsl?raw";

class CustomPhysicalMaterial extends THREE.MeshPhysicalMaterial {
    constructor(params) {
        super(params);
    }

    onBeforeCompile(shader) {
        console.log("🔹 기존 Fragment Shader 코드:", shader.fragmentShader);

        if (shader.fragmentShader.includes("#include <transmission_pars_fragment>")) {
            console.log("✅ transmission_pars_fragment 찾음, GLSL 코드 적용");
            shader.fragmentShader = shader.fragmentShader.replace(
                "#include <transmission_pars_fragment>",
                TransmissionShader
            );
        } else {
            console.error("❌ transmission_pars_fragment 없음! GLSL 코드 적용 불가");
        }

        console.log("📝 수정된 Fragment Shader:", shader.fragmentShader);
    }
}

export { Cust
