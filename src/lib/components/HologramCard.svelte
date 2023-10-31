<script lang="ts">
	import galaxy from '$lib/assets/galaxy.png';

	import type { benefits } from '$lib/data';

	export let data: typeof benefits[0];
</script>

<div id="horogram-card" class="flex flex-col items-center">
	<div
		data-aos-anchor-placement="center-center"
		data-aos="fade-up"
		class="flex flex-col items-center bg-gradient-to-b from-base-100 via-secondary-content/60 from-20% to-secondary-focus/70 h-[24rem] w-64 rounded-lg"
	>
		<figure><img class="opacity-80 w-52 mb-6" src={data.pic} alt="Shoes" /></figure>
		<article class="z-10 md:prose-lg text-center prose-neutral mx-3 prose-sm">
			<h3 class="font-semibold">{data.punchline}</h3>
			<p>{data.body}</p>
		</article>
		<div class="card-body text-center" />
	</div>
	<div data-aos-anchor-placement="center-bottom" data-aos="fade-up" class="relative">
		<div />
		<div
			class="bg-secondary-focus z-0 absolute -top-1/4 left-2/4 -translate-x-2/4 pointer-events-none transform aspect-square w-[10rem] opacity-80 rounded-full blur-3xl"
		/>
		<div
			class="bg-secondary z-0 absolute -top-3/4 left-2/4 -translate-x-2/4 -translate-y-1/2 pointer-events-none transform aspect-square w-[20rem] opacity-40 rounded-full blur-3xl"
		/>
		<div>
			<img class="w-44 -mt-6 z-10 rotate-45" src={galaxy} alt="blue-ellipse" />
		</div>
	</div>
</div>
