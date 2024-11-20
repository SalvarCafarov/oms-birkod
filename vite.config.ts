import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths(), eslint(), svgr()],
	server: {
		open: true,
		port: 3000,
	},
	build: {
		outDir: 'build',
	},
});
