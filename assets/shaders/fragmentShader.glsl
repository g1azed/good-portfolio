precision mediump float;

uniform vec3 uColor;
uniform float transmission; // 투명도 값
uniform vec3 attenuationColor;
uniform float attenuationDistance;
varying vec2 vUv;

// 📌 transmission_pars_fragment.glsl의 코드 삽입
#ifdef USE_TRANSMISSION
    uniform float thickness;
    uniform mat4 modelMatrix;
    varying vec3 vWorldPosition;
#endif

void main() {
    vec3 color = uColor;

    // 📌 transmission 적용
    #ifdef USE_TRANSMISSION
        float transmittedLight = transmission;
        float attenuationFactor = exp(-attenuationDistance * transmittedLight);
        vec3 finalColor = mix(color, attenuationColor, transmittedLight * attenuationFactor);
        
        gl_FragColor = vec4(finalColor, transmittedLight); // 투명도 적용
    #else
        gl_FragColor = vec4(color, 1.0);
    #endif
}
