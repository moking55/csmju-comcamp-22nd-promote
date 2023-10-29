<script lang="ts">
	import type { learningObjectives } from '../../data';
	import Typewritter from './Typewritter.svelte';

	export let data: typeof learningObjectives[0];
	export let y: number;
</script>

<div id="iot" class="container grid w-full place-items-center md:grid-cols-2 gap-y-28 my-60">
	<script
		src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs"
		type="module"
	></script>
	<div class="relative grid place-items-center md:order-1 w-4/6 md:w-full">
		<div class=" absolute top-0 left-2/4 transform -translate-x-1/4 w-4/6 lg:w-[22rem]">
			<img
				data-aos="fade-right"
				data-aos-duration="500"
				data-aos-anchor-placement="up-center"
				src="src/lib/assets/brain-cell.png"
				alt="brain-cell"
			/>
			<div data-aos="fade-in" data-aos-duration="1000" data-aos-anchor-placement="up-center">
				<div
					style="--cs-from-opacity: 0.4; --cs-to-opacity: 0.9;"
					class="bg-accent-focus fade-in-out-custom -z-10 top-[15%] left-[70%] pointer-events-none transform absolute aspect-square w-2/4 lg:w-[10rem] rounded-full blur-3xl"
				/>
				<div
					style="--cs-from-opacity: 0.4; --cs-to-opacity: 0.9;"
					class="bg-primary-focus fade-in-out-custom -z-10 top-[70%] left-2/4 pointer-events-none transform absolute aspect-square w-2/4 lg:w-[10rem] rounded-full blur-3xl"
				/>
			</div>
			<div
				id="chart-animation"
				data-aos="fade-right"
				data-aos-duration="500"
				data-aos-anchor-placement="up-center"
				class="absolute opacity-80 top-[10%] w-[28rem] left-0 -z-20"
			>
				<dotlottie-player
					src="https://lottie.host/84c4e6e0-e0f2-4e59-b642-a84be69b929f/UQNpAFnDY6.json"
					background="transparent"
					class="w-4/6 lg:w-full"
					speed="1"
					loop
					autoplay
				/>
			</div>
		</div>

		<div data-aos="zoom-out" data-aos-anchor-placement="up-center">
			<img class="w-3/4 lg:w-[24rem]" src="src/lib/assets/brain.png" alt="iot" />
			<div
				class="bg-secondary-focus z-0 absolute top-1/4 left-[35%] lg:left-2/4 -translate-x-2/4 pointer-events-none transform aspect-square w-2/4 lg:w-[17rem] rounded-full blur-3xl"
			/>
		</div>
		<div class="absolute top-[17%] left-[52%] -translate-x-2/4 transform">
			<img
				data-aos="zoom-in"
				data-aos-anchor-placement="up-center"
				class="w-4/6 opacity-70 lg:w-[10rem]"
				src="src/lib/assets/python_2.png"
				alt="iot"
			/>
		</div>
	</div>

	<div class="z-10">
		<article class="md:prose-lg text-center md:text-end prose-neutral mx-3 prose-sm">
			<h1
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="text-secondary-focus eng-font bg-gradient-to-t font-bold"
			>
				{data.punchline}
			</h1>
			<p data-aos-anchor-placement="up-center" data-aos="fade-up">
				{data.body}
			</p>
		</article>
	</div>
</div>

<style lang="postcss">
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 100;
		}
	}

	@keyframes fade-in-out-custom {
		from {
			opacity: var(--cs-from-opacity);
		}
		to {
			opacity: var(--cs-to-opacity);
		}
	}

	@keyframes rotate-in {
		from {
			transform: rotate(30deg);
		}
		to {
			transform: rotate(70deg);
		}
	}

	@keyframes slide-in {
		from {
			transform: translateY(-25%);
		}
		to {
			transform: translateY(0%);
		}
	}

	.fade-in {
		animation: fade-in 2s ease-in-out alternate-reverse infinite;
	}

	.rotate-in {
		animation: rotate-in 3s ease-in-out alternate-reverse infinite;
	}

	.slide-in {
		animation: slide-in 1s ease-in-out infinite alternate-reverse;
	}

	.fade-in-out-custom {
		animation: fade-in-out-custom 2s ease-in-out alternate-reverse infinite;
	}

	.cs-animate-ping {
		animation: ping var(--cs-ping-duration) cubic-bezier(0, 0, 0.2, 1) infinite;
	}
</style>
