<script context="module">
	import Device from 'svelte-device-info';
</script>

<script lang="ts">
	import Error550 from '$lib/components/errors/Error550.svelte';
	import LoginCard from '../../lib/components/LoginCard.svelte';
	import { imgGallery } from '$lib/data';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth as authStore, signOutUser } from '$lib/firebase/actions/authAction';
	import { Toast } from '$lib/middleware/alertConfig';
	import { checkAndSetUserData } from '$lib/firebase/actions/userAction';
	import { initFirebase } from '$lib/firebase/config';
	import { onAuthStateChanged } from 'firebase/auth';
	import { disableRegistration } from '$lib/controller';

	let action: 'SIGN_IN' | 'SIGN_UP';
	let promise: Promise<unknown>;
	let deviceChecker = {
		mobile: Device.isMobile,
		tablet: Device.isTablet
	};

	onMount(() => {
		const { auth } = initFirebase();
		promise = new Promise((resolve, reject) => {
			try {
				onAuthStateChanged(auth, (data) => {
					authStore.set(data);
					if (data) {
						if (data.email === import.meta.env.VITE_ADMIN_EMAIL) {
							signOutUser().then(() => {
								resolve(
									Toast.fire({
										icon: 'warning',
										title: 'รหัสผ่านไม่ถูกต้อง'
									})
								);
							});
						}

						checkAndSetUserData(data.uid).then((userData) => {
							if (!userData) return goto('/authentication/info-register');
							resolve(goto('/dashboard'));
						});
					} else {
						resolve(null);
					}
				});
			} catch (err) {
				reject(err);
			}
		});
	});
</script>

{#await promise}
	<div
		class="bg-gradient-to-r h-screen w-full grid place-content-center from-secondary-content to-primary-content"
	>
		<div class="loading loading-lg loading-dots" />
	</div>
{:then}
	<div class="overflow-hidden">
		<section id="section" class=" bg-gradient-to-l to-base-100/10 from-base-200/80 -z-20">
			<!-- give me signup page with grid for 2 column, first is image and second is phone mockup -->

			{#if deviceChecker.tablet || !deviceChecker.mobile}
				<!-- content here -->
				<div class="ralative">
					<div class="absolute top-1/2 space-y-2 -translate-y-1/2 slice-animate-first -left-1/2">
						<div id="card-image-container" class="flex items-center opacity-50 gap-2">
							{#each Array.from({ length: 2 }, (v, i) => i) as item}
								{#each imgGallery.galleryOne as filePathPromise}
									{#await filePathPromise}
										<!-- promise is pending -->
										<div
											class="w-[24rem] h-48 bg-base-100 blur-sm grid place-content-center shadow-xl"
										>
											<figure>
												<span class="loading text-base-content loading-spinner loading-lg" />
											</figure>
										</div>
									{:then src}
										<div class="w-[24rem] bg-base-100 shadow-xl">
											<figure>
												<img class="on-image-hovering rounded-md" {src} alt="img" />
											</figure>
										</div>
									{/await}
								{/each}
							{/each}
						</div>
						<div id="card-image-container" class="flex items-center opacity-50 gap-2">
							{#each Array.from({ length: 2 }, (v, i) => i) as item}
								{#each imgGallery.galleryTwo as filePathPromise}
									{#await filePathPromise}
										<div
											class="w-[24rem] h-48 bg-base-100 blur-sm grid place-content-center shadow-xl"
										>
											<figure>
												<span class="loading text-base-content loading-spinner loading-lg" />
											</figure>
										</div>
									{:then src}
										<div class="w-[24rem] bg-base-100 shadow-xl">
											<figure>
												<img class="on-image-hovering rounded-md" {src} alt="img" />
											</figure>
										</div>
									{/await}
								{/each}
							{/each}
						</div>
					</div>
				</div>
			{/if}
			<div class="grid w-full h-full md:grid-cols-2 lg:grid-cols-5">
				<div
					id="asset-placeholder"
					class="grid-cols-1 lg:col-span-3 overflow-hidden -z-10 opacity-60 absolute md:relative"
				>
					<div
						class="bg-primary top-0 left-1/4 pointer-events-none transform absolute aspect-square w-[20rem] rounded-full blur-2xl"
					/>
					<div
						class="bg-accent top-1/4 translate-y-1/2 -translate-x-1/2 left-0 pointer-events-none transform absolute aspect-square w-[20rem] rounded-full blur-2xl"
					/>
					<div
						class="bg-secondary top-2/4 left-1/4 translate-x-1/2 pointer-events-none transform absolute aspect-square w-[25rem] rounded-full blur-2xl"
					/>
				</div>
				<div
					class="col-span-1 lg:col-span-2 backdrop-blur-md md:backdrop-blur-sm grid place-items-center h-full bg-gradient-to-r to-base-200 to-90% from-base-200/0 from-10% z-10"
				>
					<LoginCard {disableRegistration} bind:action />
				</div>
			</div>
		</section>
	</div>{:catch errors}
	<Error550 {errors} />
{/await}

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans+Thai:400,500,600,700&display=swap&subset=thai');

	.on-image-hovering {
		@apply hover:opacity-80 hover:shadow-lg  shadow-white transition-opacity duration-300 ease-in-out;
	}

	/* make slide keyframe transition to move on x axis form left: 0 to left: 100 then repeat */
	@keyframes slide {
		100% {
			left: 0%;
		}
	}

	.slice-animate-first {
		animation: slide 20s linear infinite alternate;
	}
	.slice-animate-second {
		animation: slide 10s linear infinite alternate;
	}

	body {
		font-family: 'IBM Plex Sans Thai', sans-serif;
		overflow-x: hidden;
	}
</style>
