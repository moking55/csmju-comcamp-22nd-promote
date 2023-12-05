<script lang="ts">
	import 'iconify-icon';
	export let errors;

	if (import.meta.env.VITE_DEV_MODE === 'true') {
		console.error(errors);
	}
</script>

<div
	class="grid space-y-4 text-center h-screen px-4 bg-grad place-content-center bg-gradient-to-r from-secondary-content to-primary-content"
>
	<div class="text-6xl text-gray-500">
		<iconify-icon icon="material-symbols:error-outline" />
	</div>
	<h1 class="tracking-widest text-2xl text-gray-500 uppercase">505 | Server Error</h1>
	<p class="text-gray-500">Please try to refresh the page, if it does not.</p>
	<p class="text-gray-500 font-bold">Please contract us at sirprak1245@gmail.com</p>
</div>
