import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    assetsInclude: ['**/*.hdr', '**/*.glsl'], // GLSL 파일을 에셋으로 포함
    plugins: [glsl()],
    base: "./", // 상대 경로 사용
    build: {
      outDir: "dist",
    },
    define: {
      'process.env': {}, 
  }
});
