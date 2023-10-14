<script lang="ts">
	import { aboutComcamp } from '../../data';
</script>

<section class="h-screen z-10">
	<div class="container mx-auto">
		<article class="md:prose-lg mx-3 prose-sm">
			<h1
				class="gradient-heading bg-gradient-to-t from-secondary-content via-secondary-focus to-secondary"
			>
				"คอมแคมป์" คืออะไร ?
			</h1>
			<div class="grid md:grid-cols-3">
				<div class=" col-span-2 mockup-browser h-full mb-8 min-h-full border bg-base-300">
					<p class="mockup-browser-toolbar" />
					<p class=" mx-6 indent-4 text-base-content">{aboutComcamp}</p>
				</div>
				<div class="relative -z-10">
					<div
						class="bg-secondary  pointer-events-none absolute md:-top-24 -top-72  -right-6 aspect-square w-[20rem] rounded-full blur-3xl"
					/>
				</div>
			</div>
		</article>
	</div>
</section>

<style lang="postcss">
</style>
