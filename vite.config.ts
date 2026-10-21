import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		// paneforge hanya publish kondisi `svelte` (tanpa export default),
		// sehingga tidak bisa di-prebundle esbuild — sajikan native via plugin Svelte.
		exclude: ['paneforge', '@lucide/svelte'],
		// Prebundle sekali di awal agar tidak ada optimizer ulang saat navigasi.
		include: [
			'@internationalized/date',
			'class-variance-authority',
			'clsx',
			'tailwind-merge',
			'tailwind-variants'
		]
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		})
	]
});
