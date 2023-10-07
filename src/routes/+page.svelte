<script>
	import { fly, fade } from 'svelte/transition';

	let visible = false;
</script>

<label>
	<input type="checkbox" bind:checked={visible} />
	toggle me
</label>

{#if visible}
	<div
		in:fade={{ duration: 600 }}
		out:fly={{ y: -20, duration: 800 }}
		class=" opacity-80 grid w-full place-items-center place-content-center"
	>
		<img class="csmju-logo" src="../src/lib/assets/logo.png" alt="" />
	</div>
	<div class="centered" out:fly={{ y: -20, duration: 800 }}>
		{#each 'COMPCAMP' as char, i}
			<span in:fade|global={{ delay: 1000 + i * 150, duration: 800 }}>{char}</span>
		{/each}
	</div>
{/if}

<style lang="postcss">
	.csmju-logo {
		@apply w-96;
	}

	.centered {
		font-size: 10vw;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-family: 'Overpass';
		letter-spacing: 0.12em;
		color: #676778;
		font-weight: 400;
	}

	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
