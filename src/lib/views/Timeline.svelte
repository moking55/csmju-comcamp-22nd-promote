<script lang="ts">
	import TimeLineCard from './../components/TimeLineCard.svelte';
	import { timeline } from '../../data';
</script>

<section id="benefit-section" class="h-auto overflow-hidden mx-auto py-6 flex flex-col gap-32">
	<div id="topic" class="flex justify-center">
		<article class="prose-lg lg:prose-2xl text-center mx-3">
			<h1
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="gradient-heading uppercase bg-gradient-to-t font-bold from-primary-focus via-primary to-secondary-focus"
			>
				Timeline
			</h1>
			<h3
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class=" text-secondary-focus font-bold"
			>
				เตรียมตัวให้พร้อมกับการเรียนรู้และสนุกไปพร้อมกัน
			</h3>
		</article>
	</div>
	<div
		class=" grid translate-x-0 md:-translate-x-[5%] lg:translate-x-0 gap-y-10 gap-x-6 place-items-center md:place-items-stretch h-fit md:h-96 md:grid-cols-5"
	>
		{#each timeline as data, i}
			<!-- content here -->
			<div class="grid" class:place-content-start={(i + 1) % 2 === 0}>
				<div class="grid relative">
					<img
						class={(i + 1) % 2 !== 0
							? 'absolute top-3/4  rotate-[125deg] md:rotate-0  md:top-0 w-40 -scale-x-100 left-[85%] md:left-[40%]'
							: 'absolute w-40 top-3/4  md:top-[80%] -left-1/2 md:left-[40%] rotate-[240deg] md:rotate-180'}
						class:hidden={i === timeline.length - 1}
						src="src/lib/assets/right-curve-arrow.png"
						alt="curved-pointer"
					/>

					<TimeLineCard index={i} {data} />
				</div>
			</div>
		{/each}
	</div>
</section>
