<script lang="ts">
    import pin from '$lib/assets/pin.png'

	import type { timeline } from '$lib/data';
	export let data: typeof timeline[0];
	export let nextDateTarget: Date;
	export let index: number;

	function initPin() {
		return (
			new Date().getTime() >= data.date.getTime() &&
			new Date().getTime() < nextDateTarget.getTime()
		);
	}
</script>

<div
	class:rotate-[8deg]={(index + 1) % 2 === 0}
	class:rotate-[-8deg]={(index + 1) % 2 !== 0}
	class="stack"
>
	<div class="paper">
		<div class="image h-56">
			{#if initPin()}
				<div class="relative">
					<img
						src={pin}
						class="absolute w-20 -translate-y-12 -translate-x-10 -rotate-[25deg]"
						alt="pin"
					/>
					<div
						class="badge badge-error badge-md uppercase text-xl font-bold absolute -translate-x-6 -rotate-[30deg]"
					>
						NOW
					</div>
				</div>
			{/if}
			<div
				class="text-base-100 w-full h-full place-items-center place-content-center grid grid-rows-3"
			>
				<div class="flex flex-col gap-2 items-center text-center mt-4">
					<h3 class="badge text-2xl badge-accent rounded-sm badge-lg p-2 py-4">
						{data.date.toLocaleDateString('default', { month: 'short' })}
					</h3>
					<h1 class="badge badge-lg font-bold text-xl">
						{data.date.toLocaleDateString('default', { year: 'numeric' })}
					</h1>
				</div>
				<h1 class="text-4xl mt-4 text-primary-focus font-bold">
					{data.date.toLocaleDateString('default', { day: 'numeric' })}
				</h1>
				<h3 class="text-2xl font-bold">{data.title}</h3>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
	*,
	*:after,
	*:before {
		box-sizing: border-box;
	}
	.text-as-background {
		width: 100%;
		height: 100%;
		position: absolute;

		bottom: 0;
		z-index: 1;
		transform: rotate(300deg);
		-webkit-transform: rotate(300deg);
	}

	.card-section {
		font-family: 'Inter', sans-serif;
		line-height: 1.5;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	img {
		display: block;
		max-width: 100%;
	}
	.stack {
		width: 85%;
		max-width: 400px;
		transition: 0.25s ease;
	}
	.stack:hover {
		transform: rotate(5deg);
	}
	.stack:hover .paper:before {
		transform: translatey(-2%) rotate(-4deg);
	}
	.stack:hover .paper:after {
		transform: translatey(2%) rotate(4deg);
	}
	.paper {
		aspect-ratio: 1.5;
		border: 4px solid;
		background-color: #eee;
		position: relative;
		transition: 0.15s ease;
		cursor: pointer;
		padding: 5% 5% 15% 5%;
	}
	.paper:before,
	.paper:after {
		content: '';
		display: block;
		position: absolute;
		height: 100%;
		width: 100%;
		border: 4px solid;

		background-color: #fff;
		transform-origin: center center;
		z-index: -1;
		transition: 0.15s ease;
		top: 0;
		left: 0;
	}
	.paper:before {
		transform: translatey(-2%) rotate(-6deg);
	}
	.paper:after {
		transform: translatey(2%) rotate(6deg);
	}
	.image {
		width: 100%;
		border: 4px gray solid;
		background-color: #eeeeee;
		aspect-ratio: 1;
		position: relative;
	}
	.browser-warning {
		margin-bottom: 4rem;
	}
	@supports (aspect-ratio: 1 / 1) {
		.browser-warning {
			display: none;
		}
	}
</style>
