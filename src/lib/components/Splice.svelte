<script lang="ts">
	import { Application } from '@splinetool/runtime';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	onMount(() => {
		const app = new Application(canvas);
		app.load('https://prod.spline.design/Bmv6RcPqRLmHsVuc/scene.splinecode');
	});
</script>

<canvas bind:this={canvas} id="canvas3d" />
