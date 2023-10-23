<script>
	import Benefit from './../lib/views/Benefit.svelte';
	import Learning from './../lib/views/Learning.svelte';
	import About from './../lib/views/About.svelte';
	import Index from './../lib/views/Index.svelte';
	import Splice from '../lib/components/Splice.svelte';
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import Footer from '$lib/views/Footer.svelte';

	let animatedInitial = true;

	// onMount(() => {
	// 	setTimeout(() => {
	// 		animatedInitial = true;
	// 	}, 1000);
	// });
	let y = 0;
</script>

<div class="flex flex-col gap-60">
	<Index />
	<About />
	<Learning {y} />
	<Benefit />
	<Footer />
</div>
<svelte:window bind:scrollY={y} />

<!-- content here -->

<style lang="postcss">
</style>
