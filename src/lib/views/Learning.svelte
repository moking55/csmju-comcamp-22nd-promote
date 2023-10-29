<script lang="ts">
	import IOTLearned from './../components/IOTLearned.svelte';
	import Typewritter from '$lib/components/Typewritter.svelte';
	import MobileLearned from '$lib/components/MobileLearned.svelte';
	import WebLearned from '$lib/components/WebLearned.svelte';

	import { learningObjectives } from '../../data';
	import AiLearned from '$lib/components/AILearned.svelte';
	export let y: number;

	const learningComponent = [MobileLearned, IOTLearned, WebLearned, AiLearned];
</script>

<section id="learning-section" class="h-full w-full flex flex-col mt-28 gap-32">
	<section id="topic">
		<div class="-z-10 relative">
			<div class="-top-1/2 left-1/2 -z-10 absolute transform -translate-x-1/2 -translate-y-1/2">
				<img
					data-aos-anchor-placement="center-bottom"
					data-aos="zoom-in"
					class="rotate-loop absolute w-82 -top-10"
					src="src/lib/assets/sun.png"
					alt="sun"
				/>
				<img
					data-aos-anchor-placement="center-bottom"
					data-aos="zoom-out"
					class="w-60"
					src="src/lib/assets/light-bulb.png"
					alt="light-bulb"
				/>
			</div>
			<div
				data-aos="zoom-in-out"
				data-aos-duration="3000"
				data-aos-anchor-placement="center-center"
			>
				<div
					class="bg-accent -top-1/2 left-1/2 -z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 absolute aspect-square w-1/2 md:w-[25rem] rounded-full opacity-40 blur-3xl"
				/>
			</div>
			<div
				data-aos="zoom-in-out"
				data-aos-duration="2000"
				data-aos-anchor-placement="bottom-bottom"
			>
				<div
					class="bg-accent-focus -top-1/2 left-1/2 -z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 absolute aspect-square w-1/2 md:w-[15em] opacity-60 rounded-full blur-3xl"
				/>
			</div>
		</div>
		<div class="flex justify-center">
			<div class="mockup-phone px-6 p-6">
				<!-- <div class="camera" /> -->

				<article class="md:prose-xl text-center mx-3 prose-sm">
					<h1
						data-aos-anchor-placement="bottom-bottom"
						data-aos="fade-up"
						class="gradient-heading uppercase bg-gradient-to-t font-bold from-primary-focus via-accent to-accent-focus"
					>
						Learning scope
					</h1>
				</article>
			</div>
		</div>
	</section>
	{#if y > 1000}
		<!-- content here -->

		<section id="things" class=" flex flex-col overflow-hidden gap-52 md:gap-60 items-center">
			{#each learningComponent as component, i}
				<svelte:component this={component} {y} data={learningObjectives[i]} />
			{/each}
		</section>
	{/if}
</section>

<style lang="postcss">
	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.rotate-loop {
		animation: rotate 15s linear infinite;
	}
</style>
