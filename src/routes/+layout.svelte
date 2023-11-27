<script context="module" lang="ts">
</script>

<script lang="ts">
	import './../app.postcss';
	import 'aos/dist/aos.css';
	// import './../../'
	import AOS from 'aos';
	import { onMount } from 'svelte';

	onMount(() => {
		AOS.init();
	});
</script>

<slot />
