<script lang="ts">
	import { aboutComcamp } from '$lib/data';
</script>

<section class="my-16 z-10">
	<div id="#about-comcamp-section" class="container mx-auto">
		<article class="md:prose-lg mx-3 prose-sm">
			<h1
				data-aos="fade-right"
				class="gradient-heading eng-font font-bold bg-gradient-to-t from-secondary-content via-secondary-focus to-secondary"
			>
				WHAT IS COMCAMP?
			</h1>
			<div class="grid md:grid-cols-3">
				<div class="col-span-2 relative">
					<div
						data-aos-anchor-placement="bottom-bottom"
						data-aos="fade-right"
						class="  mockup-browser h-full mb-8 min-h-full border bg-base-300"
					>
						<p class="mockup-browser-toolbar" />
						<p class=" mx-6 indent-4 text-base-content">{aboutComcamp}</p>
					</div>
					<img
						data-aos-duration="1000"
						data-aos-anchor-placement="top-center"
						data-aos="fade-up"
						src="https://www.svgrepo.com/show/12934/laptop.svg"
						class="w-80 absolute md:invisible -z-10 visible -top-1/2 right-0"
						alt=""
					/>
				</div>
				<div class="relative -z-10">
					<img
						data-aos-duration="2000"
						data-aos-anchor-placement="bottom-bottom"
						data-aos="fade-up"
						src="https://www.svgrepo.com/show/12934/laptop.svg"
						class="w-80 absolute z-10 invisible md:visible -top-1/4 lg:-top-1/2 right-0"
						alt=""
					/>
					<div
						data-aos-duration="1000"
						data-aos-anchor-placement="bottom-bottom"
						data-aos="zoom-in"
						class="bg-secondary pointer-events-none absolute md:-top-24 -top-72 -right-6 aspect-square w-[20rem] rounded-full blur-3xl"
					/>
				</div>
			</div>
		</article>
	</div>
</section>
