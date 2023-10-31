<script lang="ts">
	import type { review } from '$lib/data';

	export let data: typeof review[0];
	export let index: number;
</script>

<div
	class="mx-6 sm:mx-0 card bg-opacity-60 min-h-[16rem] w-auto h-auto md:w-[40rem] bg-base-200 grid grid-flow-col sm:grid-cols-2 shadow-xl"
>
	<div class:order-1={(index + 1) % 2 === 0} class=" relative">
		<img
			class="w-72 filter saturate-100 absolute z-20 top-1/4 sm:-top-[10%]"
			src={data.image}
			alt=""
		/>
		<img
			style="  -webkit-filter: brightness(0) invert(.4);
    filter: brightness(0) invert(.4);"
			class=" w-72 absolute z-10 left-0 sm:-left-[10%] top-1/4 sm:-top-[12%]"
			src={data.image}
			alt=""
		/>
		<div
			class:bg-accent-focus={index === 0}
			class:bg-primary-focus={index === 1}
			class:bg-error={index === 2}
			class="top-1/4 sm:top-0 sm:left-1/4 pointer-events-none absolute aspect-square w-[10rem] sm:w-[15rem] rounded-full opacity-50 blur-3xl"
		/>
	</div>
	<div class="card-body grid sm:grid-rows-3">
		<div class="row-span-2">
			<h2 class:text-end={(index + 1) % 2 === 0} class="card-title text-base md:text-xl">
				{data.comment}
			</h2>
		</div>
		<div class:justify-end={(index + 1) % 2 !== 0} class="card-actions h-auto">
			<article class:text-end={(index + 1) % 2 !== 0} class="md:prose prose-sm">
				<blockquote>{data.role} <br /> {data.gen}</blockquote>
			</article>
		</div>
	</div>
</div>
