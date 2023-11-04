<script lang="ts">
	import CounterNumber from '$lib/components/CounterNumber.svelte';
	import { stats } from '$lib/data';
	import Review from './Review.svelte';
	export let y: number;
</script>

<section
	id="stats-section"
	class="container overflow-hidden md:overflow-visible mx-auto flex flex-col gap-32"
>
	<div id="stats-topic" class="flex justify-center">
		<article class="prose-lg lg:prose-2xl text-center mx-3">
			<h1
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="gradient-heading uppercase bg-gradient-to-t font-bold from-primary-focus via-primary to-accent-focus"
			>
				Stats
			</h1>
			<h3
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class=" text-primary-focus font-bold"
			>
				จากสถิติทั้งหมดของคอมแคมป์เรา
			</h3>
		</article>
	</div>
	{#if y > 4500}
		<div
			data-aos-anchor-placement="up-center"
			data-aos="fade-up"
			id="stats-box"
			class="flex justify-center"
		>
			<div class="stats overflow-hidden w-3/4 stats-vertical lg:stats-horizontal shadow">
				<div
					data-aos-anchor-placement="center-center"
					data-aos-duration="1000"
					data-aos="zoom-in-out"
					class="relative"
				>
					<div
						class="bg-primary top-0 left-0 pointer-events-none transform translate-x-3/4 -translate-y-1/2 absolute aspect-square w-[40vw] rounded-full opacity-40 blur-3xl"
					/>
					<div
						class="bg-accent top-0 left-0 pointer-events-none transform -translate-x-1/4 -translate-y-1/2 absolute aspect-square w-[40vw] rounded-full opacity-40 blur-3xl"
					/>
				</div>
				{#each stats as data}
					<div class="stat overflow-hidden bg-base-200 bg-opacity-30">
						<div class="relative">
							{#await data.imgBg}
								<!-- promise is pending -->
							{:then value}
								<img
									class="absolute opacity-40 sm:opacity-100 z-0 w-28 top-full right-[5%] lg:-right-[10%]"
									src={value}
									alt=""
								/>
							{/await}
						</div>
						<div class="stat-title z-10">{data.title}</div>
						<div class="text-4xl md:text-6xl font-bold text-primary z-10">
							<CounterNumber
								interval={700}
								increase={data.increase}
								initialValue={data.initValue}
								direction={'up'}
								values={Array.from({ length: data.value + 1 }, (_, i) =>
									new String(i).padStart(2, '0')
								)}
							/>{data.symbol}
						</div>
						<div class="stat-desc z-10">{data.subtitle}</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
	<div id="review-section">
		<Review />
	</div>
</section>

<style lang="postcss">
	.stats::-webkit-scrollbar {
		background-color: hsl(var(--b3));
		width: 2px;
	}

	/* background of the scrollbar except button or resizer */
	.stats::-webkit-scrollbar-track {
		background-color: hsl(var(--b1));
	}

	/* scrollbar itself */
	.stats::-webkit-scrollbar-thumb {
		background-color: hsl(var(--b1));
		border-radius: 16px;
		border: 1px solid hsl(var(--b1));
	}

	/* set button(top and bottom of the scrollbar) */
	.stats::-webkit-scrollbar-button {
		display: none;
	}
</style>
