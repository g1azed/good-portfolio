#ifdef USE_TRANSMISSION

// Transmission code is based on glTF-Sampler-Viewer
// https://github.com/KhronosGroup/glTF-Sample-Viewer

uniform float transmission;
uniform float thickness;
uniform float attenuationDistance;
uniform vec3 attenuationColor;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
varying vec3 vWorldPosition;

void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}