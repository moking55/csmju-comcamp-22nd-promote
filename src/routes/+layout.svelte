<script>
	import './../app.postcss';
	import 'aos/dist/aos.css';
	import AOS from 'aos';
	import { onMount } from 'svelte';

	onMount(() => {
		AOS.init();
	});
</script>

<slot />

<!-- <style lang="postcss">
	body {
		overflow-x: hidden;
	}
</style> -->
