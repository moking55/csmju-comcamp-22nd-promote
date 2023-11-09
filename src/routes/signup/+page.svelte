<script>
	import LoginCard from './../../lib/components/LoginCard.svelte';
	import { activities } from '$lib/data';
</script>

<!--  bg-gradient-to-l from-base-100 to-base-300 -->
<div class="overflow-hidden">
	<section id="section" class=" h-screen">
		<!-- give me signup page with grid for 2 column, first is image and second is phone mockup -->

		<div class="ralative">
			<div class="absolute top-1/2 -translate-y-1/2">
				<div id="card-image-container" class="flex items-center flex-wrap opacity-50 gap-2">
					{#each Array.from({ length: 4 }, (v, i) => i) as item}
						<!-- content here -->
						{#each activities as data}
							<div class="w-[24rem] bg-base-100 shadow-xl">
								<figure>
									<img class=" rounded-md" src={data.img} alt="img" />
								</figure>
							</div>
						{/each}
					{/each}
				</div>
			</div>
		</div>
		<div class="grid w-full h-full grid-cols-5">
			<div id="asset-placeholder" class="col-span-3 relative">
				<div
					class="bg-primary z-10 top-0 left-1/4 pointer-events-none transform absolute aspect-square w-[20rem] rounded-full opacity-80 blur-2xl"
				/>
				<div
					class="bg-accent z-10 top-1/4 translate-y-1/2 -translate-x-1/2 left-0 pointer-events-none transform absolute aspect-square w-[20rem] rounded-full opacity-80 blur-2xl"
				/>
				<div
					class="bg-secondary z-10 top-3/4 left-0 translate-x-1/2 pointer-events-none transform absolute aspect-square w-[15rem] rounded-full opacity-80 blur-2xl"
				/>
			</div>
			<div class="col-span-2 grid place-items-center h-full bg-base-100 z-10">
				<LoginCard />
			</div>
		</div>
	</section>
</div>
