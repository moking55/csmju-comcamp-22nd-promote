<script lang="ts">
	import HologramCard from './../components/HologramCard.svelte';
	import { benefits } from '$lib/data';
</script>

<section class="container mx-auto flex flex-col gap-32">
	<div id="topic" class="flex justify-center">
		<article class="prose-lg lg:prose-2xl text-center mx-3">
			<h2
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="uppercase font-bold text-secondary-focus"
			>
				once in a
			</h2>
			<h1
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="gradient-heading uppercase bg-gradient-to-t font-bold from-primary-focus via-primary to-secondary-focus"
			>
				lifetime opportunity!
			</h1>
			<h3
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class=" text-secondary-focus font-bold"
			>
				สิ่งที่พวกเราทุกคนจะได้รับในการเข้าร่วม
			</h3>
		</article>
	</div>
	<div id="benefit-section" />
	<div class="grid gap-y-20 md:grid-cols-2 xl:grid-cols-4">
		{#each benefits as data}
			<HologramCard {data} />
		{/each}
	</div>
</section>
