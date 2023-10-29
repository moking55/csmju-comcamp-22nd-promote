<script>
	import Navbar from './../lib/components/Navbar.svelte';
	import Sponsor from './../lib/views/Sponsor.svelte';
	import Stats from './../lib/views/Stats.svelte';
	import FAQ from './../lib/views/FAQ.svelte';
	import Benefit from './../lib/views/Benefit.svelte';
	import Learning from './../lib/views/Learning.svelte';
	import About from './../lib/views/About.svelte';
	import Index from './../lib/views/Index.svelte';

	import Footer from '$lib/views/Contract.svelte';
	import Timeline from '$lib/views/Timeline.svelte';

	let y = 0;
</script>

<header>
	<Navbar {y} />
</header>
<main>
	<div class="flex h-full flex-col gap-40">
		<Index />
		<About />
		<Learning {y} />
		<Stats {y} />
		<Benefit />
		<Timeline />
		<Sponsor />
		<FAQ />
	</div>
</main>

<Footer />
<svelte:window bind:scrollY={y} />

<style lang="postcss">
</style>
