<script lang="ts">
	import ReviewCard from './../components/ReviewCard.svelte';
	import { review } from '../../data';

	function initAnimate(index: number) {
		return (index + 1) % 2 === 0 ? 'fade-left' : 'fade-right';
	}
</script>

<section id="benefit-section" class="container mx-auto flex flex-col gap-32">
	<div id="topic" class="flex justify-center">
		<article class="prose-lg lg:prose-2xl text-center mx-3">
			<h3
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class=" text-accent-focus font-bold"
			>
				และการรีวิวจากรุ่นพี่ที่ร่วมเข้าค่ายครั้งก่อน
			</h3>
		</article>
	</div>
	<div class="flex flex-col gap-6">
		{#each review as data, i}
			<!-- content here -->
			<div
				data-aos-anchor-placement="up-center"
				data-aos={initAnimate(i)}
				class:self-end={(1 + i) % 2 === 0}
			>
				<ReviewCard index={i} {data} />
			</div>
		{/each}
	</div>
</section>
