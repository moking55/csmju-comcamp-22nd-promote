<script context="module">
	import Device from 'svelte-device-info';
</script>

<script lang="ts">
	import Sponsor from '$lib/views/Sponsor.svelte';
	import Stats from '$lib/views/Stats.svelte';
	import FAQ from '$lib/views/FAQ.svelte';
	import Benefit from '$lib/views/Benefit.svelte';
	import Learning from '$lib/views/Learning.svelte';
	import About from '$lib/views/About.svelte';
	import Index from '$lib/views/Index.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/views/Contract.svelte';
	import Timeline from '$lib/views/Timeline.svelte';
	import { Drawer, getDrawerStore, initializeStores } from '@skeletonlabs/skeleton';
	import type { DrawerSettings, DrawerStore } from '@skeletonlabs/skeleton';
	import {auth as authData} from '$lib/firebase/actions/authAction';

	// firebase
	// setup google analytics
	import { GoogleAnalytics } from '@beyonk/svelte-google-analytics';

	import { checkAndSetUserData, type User } from '$lib/firebase/actions/userAction';
	import UserDrawer from '$lib/components/widgets/UserDrawer.svelte';
	import { goto } from '$app/navigation';
	import { initFirebase } from '$lib/firebase/config';
	import { onAuthStateChanged } from 'firebase/auth';

	initializeStores();
	const drawerStore = getDrawerStore();

	let ga = '';
	if (window.location.host !== 'localhost') {
		ga = import.meta.env.VITE_GA_ID;
	}

	let y = 0;

	let device = {
		isMobile: Device.isMobile,
		isTablet: Device.isTablet
	};

	const { auth } = initFirebase();
	let authStateReady: Promise<User | null> = new Promise((resolve, reject) => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(data) => {
				try {
					authData.set(data);
					if (data) {
						checkAndSetUserData(data.uid).then(($userData) => {
							resolve($userData);
						});
					} else {
						if (import.meta.env.VITE_DEV_MODE == 'true') console.error('No Auth Data', data);
						goto('/');
						resolve(null);
					}
				} catch (err) {
					reject(err);
				}
			},
			(error) => {
				unsubscribe();
				reject(error);
			}
		);
	});
</script>

<header>
	<Navbar {authStateReady} {drawerStore} {y} />
</header>
<!-- Google analytic -->
<GoogleAnalytics properties={[ga]} />
<main>
	<div class="flex h-full -z-10 flex-col gap-24">
		<Index {authStateReady} {device} />
		<About />
		<Timeline />
		<Learning {y} />
		<Stats {y} />
		<Benefit />
		<Sponsor />
		<FAQ />
	</div>
	<div class="z-[9999]">
		<Drawer>
			<UserDrawer />
		</Drawer>
	</div>
</main>

<Footer {device} />
<svelte:window bind:scrollY={y} />

<style lang="postcss">
</style>
