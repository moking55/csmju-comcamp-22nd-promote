<script lang="ts">
	import type { Sponsor } from '$lib/firebase/actions/sponsorAction';
	import { onMount } from 'svelte';

	export let sponsor: Sponsor;
	let card: HTMLDivElement;
	let article: HTMLElement;
	let badge: HTMLDivElement;

	function randomBgColor() {
		const randCss = ['primary', 'secondary', 'accent', 'info', 'error', 'warning'][
			Math.floor(Math.random() * 6)
		];
		card.classList.add(`bg-${randCss}`, `text-${randCss}-content`);
		if (sponsor.donateAmount) {
			badge.classList.add(`badge-${randCss}`);
		}
		if (sponsor.donateDate || sponsor.from) {
			article.classList.add(`text-${randCss}-content`);
		}
	}

	onMount(() => randomBgColor());
</script>

<div bind:this={card} class="card shadow-xl shadow-base-content/40 w-96 glass">
	{#if sponsor.donateAmount}
		<div class="relative">
			<div class="absolute -top-3 right-0">
				<div bind:this={badge} class="badge font-bold badge-lg p-3 text-lg">
					{sponsor.donateAmount.toLocaleString('th-TH', {
						style: 'currency',
						currency: 'THB'
					})}
				</div>
			</div>
		</div>
	{/if}
	<div class="card-body">
		<h2 class="card-title">{sponsor.name}</h2>
		<p class="text-lg">{sponsor.position}</p>
		<article class="prose prose-sm">
			<blockquote class="-space-y-3" bind:this={article}>
				{#if sponsor.from}
					<iconify-icon icon="solar:city-bold" /> จาก: {sponsor.from} <br />
				{/if}
				{#if sponsor.donateDate}
					<iconify-icon icon="mingcute:currency-baht-fill" /> วันที่บริจาค: {sponsor.donateDate
						.toDate()
						.toLocaleDateString('th-TH', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}{' '}
				{/if}
			</blockquote>
		</article>
	</div>
</div>
