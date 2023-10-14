<script>
	import About from './../lib/views/About.svelte';
	import Index from './../lib/views/Index.svelte';
	import Splice from '../lib/components/Splice.svelte';
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	let animatedInitial = true;

	// onMount(() => {
	// 	setTimeout(() => {
	// 		animatedInitial = true;
	// 	}, 1000);
	// });
</script>

<div class="flex flex-col gap-20">
	<Index />
	<About />
</div>

<!-- content here -->

<style lang="postcss">
</style>
