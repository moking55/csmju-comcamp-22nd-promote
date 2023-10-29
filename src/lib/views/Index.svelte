<script lang="ts">
	import Splice from '$lib/components/Splice.svelte';
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	import { actionMenu } from '../../data';

	let animatedInitial = false;
	let splineSrc = import.meta.env.VITE_SPLICE_INDEX_SRC;
	onMount(() => {
		setTimeout(() => {
			animatedInitial = true;
		}, 1000);
	});
</script>

<!-- content here -->
<div class="h-[800px] 2xl:container 2xl:mx-auto mt-20 z-0 w-full">
	<div id="wrapper" class=" relative">
		<div class="absolute right-0 top-0">
			<Splice urlLoader={splineSrc} />
		</div>
	</div>
	{#if animatedInitial}
		<div in:fade={{ duration: 4500 }} class="relative" id="fade-pointers ">
			<div class="overflow-x-hidden">
				<div
					class="bg-secondary-focus pointer-events-none absolute -translate-x-1/2 top-0 left-0 aspect-square w-[40vw] 2xl:w-[40rem] opacity-40 rounded-full blur-3xl"
				/>
				<div
					class="top-0 bg-secondary pointer-events-none absolute left-0 aspect-square w-[50vw] 2xl:w-[50rem] rounded-full opacity-20 blur-3xl"
				/>
				<div
					class="bg-primary-focus pointer-events-none absolute top-0 right-0 aspect-square w-[35vw] 2xl:w-[35rem] rounded-full opacity-30 blur-3xl"
				/>
				<div
					class="bg-accent-focus pointer-events-none absolute bottom-0 translate-y-1/4 left-[40%] aspect-square w-[35vw] 2xl:w-[35rem] rounded-full opacity-30 blur-3xl"
				/>
			</div>
		</div>

		<div class="-translate-y-20 grid lg:grid-cols-2 h-full my-auto">
			<div class="">
				<div class="z-10 flex flex-col items-center -space-y-24">
					<img
						in:fade={{ duration: 2000 }}
						out:fly={{ y: -20, duration: 800 }}
						class="csmju-logo opacity-80"
						src="src/lib/assets/comcamp-22nd-logo.png"
						alt="comcamp-csmju-logo"
					/>
					<div class="relative">
						<div
							class="compcamp-char gradient-heading from-primary to-secondary eng-font text-flicker-out-glow"
						>
							{#each 'COMPCAMP MJU' as char, i}
								<span class="" in:fade|global={{ delay: 100 + i * 150, duration: 800 }}>{char}</span
								>
							{/each}
						</div>
						<div
							class="gradient-heading text-center text-xl font-bold from-accent to-primary tracking-widest eng-font text-flicker-out-glow"
						>
							{#each 'Open 31 October - 30 December 2023' as char, i}
								<span class="" in:fade|global={{ delay: 100 + i * 150, duration: 500 }}>{char}</span
								>
							{/each}
						</div>
					</div>
				</div>
				<div id="register-button-container" class="flex mt-10 justify-center">
					<a
						target="_blank"
						href={actionMenu.find((a) => a.name === 'register')?.link}
						class="btn btn-accent btn-md"
						role="button">Join Now</a
					>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans+Thai:400,500,600,700&display=swap&subset=thai');
	@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

	.csmju-logo {
		@apply w-auto sm:w-[40rem];
	}

	.compcamp-char {
		@apply gradient-heading text-center font-bold   tracking-widest text-3xl lg:text-5xl text-white;
	}

	.gradient-heading {
		@apply bg-clip-text text-transparent box-decoration-clone bg-gradient-to-br;
	}

	/* .centered {
		font-size: 5vw;
		position: absolute;
		left: 25%;
		top: 70%;
		transform: translate(-50%, -50%);
		letter-spacing: 0.12em;
		color: white;
		font-weight: 400;
	} */
</style>
