<script lang="ts">
	import { onMount } from 'svelte';
	import type { sponsor } from '../data';

	export let data: typeof sponsor[0];

	function initClass(className: string) {
		return 'invisible';
	}

	let logoCard: HTMLDivElement;
	let card: HTMLDivElement;

	onMount(() => {
		if (!data.visible) {
			card.setAttribute('class', `invisible hidden relative z-20 xl:grid place-items-center`);
		}
		logoCard.setAttribute('class', `card p-6 w-48 ${data.bgClass}`);
	});
</script>

<div
	bind:this={card}
	data-aos-anchor-placement="up-center"
	data-aos="zoom-in-out"
	class="relative z-20 grid place-items-center"
>
	<div
		class="w-fit rounded-xl border border-white/25 bg-white/5 p-4 shadow-[inset_0_0_8px_rgba(255,255,255,0.2)] backdrop-blur-xl will-change-transform"
		style="transform: none;"
	>
		<div class="absolute inset-x-0 bottom-0" />
		<div id="logo-card" bind:this={logoCard}>
			<figure>
				<img src={data.src} alt="logo" />
			</figure>
		</div>
	</div>
</div>
