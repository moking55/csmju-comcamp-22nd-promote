<script lang="ts">
	import { Application } from '@splinetool/runtime';
	import { onMount } from 'svelte';

	export let urlLoader: string;

	let canvas: HTMLCanvasElement;

	if (urlLoader) {
		onMount(() => {
			const app = new Application(canvas);
			app.load(urlLoader as string);
		});
	} else {
		throw new Error('No urlLoader provided');
	}
</script>

<canvas bind:this={canvas} id="canvas3d" />
