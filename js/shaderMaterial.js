import * as THREE from "three";
import transmissionParsFragment from "../assets/shaders/transmission_pars_fragment.glsl?raw";

export class CustomPhysicalMaterial extends THREE.MeshPhysicalMaterial {
    constructor(params) {
        super(params);
    }
    onBeforeCompile(shader) {
        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            `${transmissionParsFragment} \n void main() {`
        );

        // shader.fragmentShader = shader.fragmentShader
        //     .replace(/transmission/g, "_custom_transmission")
        //     .replace(/thickness/g, "_custom_thickness")
        //     .replace(/attenuationDistance/g, "_custom_attenuationDistance")
        //     .replace(/attenuationColor/g, "_custom_attenuationColor");
    }
}
