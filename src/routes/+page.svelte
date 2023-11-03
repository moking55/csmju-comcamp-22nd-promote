<script context="module">
	import Device from 'svelte-device-info';
</script>

<script lang="ts">
	import Sponsor from '$lib/views/Sponsor.svelte';
	import Stats from '$lib/views/Stats.svelte';
	import FAQ from '$lib/views/FAQ.svelte';
	import Benefit from '$lib/views/Benefit.svelte';
	import Learning from '$lib/views/Learning.svelte';
	import About from '$lib/views/About.svelte';
	import Index from '$lib/views/Index.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/views/Contract.svelte';
	import Timeline from '$lib/views/Timeline.svelte';

	// setup google analytics
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics';
	let ga = '';
	if (window.location.host !== 'localhost') {
		ga = import.meta.env.VITE_GA_ID;
	}

	let y = 0;
	let isMobile = Device.isMobile;
</script>

<header>
	<Navbar {y} />
</header>
<!-- Google analytic -->
<GoogleAnalytics properties={[ga]} />
<main>
	<div class="flex h-full flex-col gap-24">
		<Index {isMobile} />
		<About />
		<Learning {y} />
		<Stats {y} />
		<Benefit />
		<Timeline />
		<Sponsor />
		<FAQ />
	</div>
</main>

<Footer {isMobile} />
<svelte:window bind:scrollY={y} />

<style lang="postcss">
</style>
