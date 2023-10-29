<script lang="ts">
    import keyboard from '$lib/assets/keyboard_2.png';

	import type { learningObjectives } from '../data';
	import Splice from './Splice.svelte';
	import Typewritter from './Typewritter.svelte';

	export let data: typeof learningObjectives[0];
	export let y: number;

	let typeDone = false;
	let splineSrc = import.meta.env.VITE_SPLICE_WEB_SRC;

	$: if (y > 3000) {
		setTimeout(() => {
			typeDone = true;
		}, 6000);
	} else {
		typeDone = false;
	}
</script>

<div id="web" class="container grid w-full place-items-center grid-cols-2 gap-y-28 mt-20">
	<div class="grid place-items-center place-content-center">
		<div
			data-aos="zoom-in-out"
			data-aos-anchor-placement="center-center"
			data-aos-duration="1500"
			class="relative"
		>
			<div
				class="bg-primary -z-10 top-0 left-full translate-x-1/2 -translate-y-1/2 pointer-events-none transform absolute aspect-square w-[20rem] rounded-full opacity-60 blur-3xl"
			/>
			<div
				class="bg-secondary -z-10 top-0 left-full translate-x-1/2 translate-y-full pointer-events-none transform absolute aspect-square w-[15rem] rounded-full opacity-60 blur-3xl"
			/>
		</div>
		<div class="w-full md:w-[600px] left-0 lg:relative absolute">
			<div
				data-aos="flip-up"
				data-aos-anchor-placement="up-center"
				class="mockup-window mockup-code w-3/4 md:w-full h-96 border bg-base-300"
			>
				{#if y > 3000}
					{#if !typeDone}
						<!-- content here -->
						<div class="relative -space-y-4 w-full pl-4 py-6 h-80 bg-base-200">
							<pre data-prefix="projects ~ %"><span class="ml-20"
									><Typewritter textDuration={1000} text={'cd my-product'} /></span
								>
                         </pre>
							<pre data-prefix="projects/my-product ~ %"><span class="ml-48"
									><Typewritter textDuration={3000} text={'npm run dev'} /></span
								>
                         </pre>
						</div>
					{:else}
						<div data-aos-duration="1500" id="wrapper" data-aos="fade-up" class=" relative">
							<div class="absolute 2xl:-translate-x-1/4 right-0 top-0">
								<Splice urlLoader={splineSrc} />
							</div>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</div>

	<div class="z-10">
		<article class=" md:prose-lg text-start prose-neutral mx-3 prose-sm">
			<h1
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="text-primary eng-font bg-gradient-to-t font-bold"
			>
				{data.punchline}
			</h1>
			<p
				class="bg-base-100 bg-opacity-40 md:bg-none p-2 rounded-md text-base-content"
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
			>
				{data.body}
			</p>
		</article>
		<div class="relative">
			<div class="-top-2/4 -mt-20 z-20 right-0 absolute w-96">
				<img src={keyboard} alt="phone" />
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
