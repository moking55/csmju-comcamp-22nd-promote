<script lang="ts">
	import 'iconify-icon';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	let timeout = 5;
	let timer: NodeJS.Timeout;
	onMount(() => {
		timer = setInterval(() => {
			if (timeout > 0) {
				timeout--;
			} else {
				clearInterval(timer);
				goto('/');
			}
		}, 1000);
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
	});
</script>

<div
	class="grid space-y-4 text-center h-screen px-4 bg-grad place-content-center bg-gradient-to-r from-secondary-content to-primary-content"
>
	<div class="text-6xl text-gray-500">
		<iconify-icon icon="iconoir:file-not-found" />
	</div>
	<h1 class="tracking-widest text-2xl text-gray-500 uppercase">404 | Not Found</h1>
	<p class="text-gray-500">We're sorry, but the page you're looking for cannot be found.</p>
	<p class="text-gray-500">Page will be auto redirect in {timeout} seconds.</p>
</div>
