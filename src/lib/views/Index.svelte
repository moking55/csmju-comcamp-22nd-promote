<script lang="ts">
	import Splice from '$lib/components/Splice.svelte';
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import Particles from 'svelte-particles';
	import { loadSlim } from 'tsparticles-slim'; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.

	import preset from '$lib/assets/tsparticles-config/preset.json';

	let onParticlesLoaded = (event: any) => {
		const particlesContainer = event.detail.particles;
	};

	let particlesInit = async (engine: any) => {
		// you can use main to customize the tsParticles instance adding presets or custom shapes
		// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
		// starting from v2 you can add only the features you need reducing the bundle size
		//await loadFull(engine);
		await loadSlim(engine);
	};

	let animatedInitial = false;

	onMount(() => {
		setTimeout(() => {
			animatedInitial = true;
		}, 1000);
	});
</script>

<!-- content here -->
<div class="h-[800px] z-0 w-full">
	<div id="wrapper" class=" relative">
		<div class="absolute 2xl:-translate-x-1/4 right-0 top-0">
			<Splice />
		</div>
	</div>
	{#if animatedInitial}
		<div in:fade={{ duration: 4500 }} class="" id="fade-pointers">
			<div
				class="bg-secondary-focus pointer-events-none absolute -translate-x-1/2 top-0 left-0 aspect-square w-[25rem] opacity-40 rounded-full blur-3xl"
			/>
			<div
				class="top-0 bg-secondary pointer-events-none absolute left-0 aspect-square w-[35rem] rounded-full opacity-20 blur-3xl"
			/>
			<div
				class="bg-primary-focus pointer-events-none absolute top-0 right-0 aspect-square w-[20rem] rounded-full opacity-30 blur-3xl"
			/>
		</div>

		<div class=" grid lg:grid-cols-2 h-full my-auto place-items-center">
			<div class="z-10 space-y-6">
				<img
					in:fade={{ duration: 2000 }}
					out:fly={{ y: -20, duration: 800 }}
					class="csmju-logo opacity-80"
					src="../src/lib/assets/logo.png"
					alt="comcamp-csmju-logo"
				/>
				<div class="compcamp-char text-flicker-out-glow">
					{#each 'CSMJU COMPCAMP' as char, i}
						<span
							class=""
							in:fade|global={{ delay: 100 + i * 150, duration: 800 }}>{char}</span
						>
					{/each}
				</div>
				<!-- i want div above to had blur background -->
			</div>
		</div>
		<!-- <Particles
			id="tsparticles"
			class="z-50"
			options={preset}
			on:particlesLoaded={onParticlesLoaded}
			{particlesInit}
		/> -->
	{/if}
</div>

<style lang="postcss">

	.csmju-logo {
		@apply w-96;
	}

	.compcamp-char {
		@apply gradient-heading text-center font-bold   tracking-widest text-2xl md:text-4xl text-white;
	}

	.gradient-heading {
		@apply bg-clip-text text-transparent box-decoration-clone bg-gradient-to-br;
		@apply from-primary to-secondary;
	}

	/* .centered {
		font-size: 5vw;
		position: absolute;
		left: 25%;
		top: 70%;
		transform: translate(-50%, -50%);
		letter-spacing: 0.12em;
		color: white;
		font-weight: 400;
	} */
</style>
