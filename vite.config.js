import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    assetsInclude: ['**/*.hdr'], // .hdr 파일을 에셋으로 포함
    plugins: [glsl()],
    define: {
        global: 'window', // global을 window로 매핑
      }
});



