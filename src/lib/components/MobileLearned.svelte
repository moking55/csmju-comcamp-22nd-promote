<script lang="ts">
	import type { learningObjectives } from '../data';
	import Typewritter from './Typewritter.svelte';

	export let data: typeof learningObjectives[0];
	export let y: number;
</script>

<div id="mobile" class="container grid w-full place-items-center grid-cols-2 gap-y-10">
	<div
		data-aos="fade-right"
		data-aos-anchor-placement="up-center"
		class="mockup-phone h-3/4 border-accent-content"
	>
		<div class="relative">
			<div
				data-aos-anchor-placement="center-center"
				data-aos-duration="1000"
				data-aos="fade-down-left"
			>
				<div
					class="bg-accent-focus -top-1/2 right-0 md:-right-1/2 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 absolute aspect-square w-1/2 md:w-[25rem] rounded-full opacity-70 blur-3xl"
				/>
			</div>
		</div>
		<div class="camera" />
		<div class="display">
			<div class="artboard overflow-hidden artboard-1 phone-3">
				<div class="mockup-code h-1/2">
					<pre data-prefix=">"><code
							><Typewritter textDuration={1000} text={'// Hello CompCamp 22nd In Kotlin'} /></code
						></pre>
					<pre data-prefix=">"><code
							><Typewritter
								textDuration={4000}
								text={'fun main(args : Array<String>) {\n      println("Hello, CompCamp 22nd!") }'}
							/></code
						></pre>
				</div>
				<div class="container h- mt-2">
					<div class="mockup-code bg-base-100">
						<pre class="underline underline-offset-4">Terminal</pre>

						<pre data-prefix="$"><code
								><Typewritter textDuration={11000} text={'kotlinc compcamp_22nd.kt'} /></code
							></pre>

						<pre data-prefix="$"><code
								><Typewritter textDuration={13000} text={'Hello, CompCamp 22nd!'} /></code
							></pre>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="z-10">
		<article class="md:prose-lg prose-neutral mx-3 prose-sm">
			<h1
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="text-accent-focus eng-font bg-gradient-to-t font-bold"
			>
				{data.punchline}
			</h1>
			<p data-aos-anchor-placement="up-center" data-aos="fade-up">
				{data.body}
			</p>
		</article>
		<div class="relative">
			<div data-aos="zoom-in" data-aos-duration="2000" data-aos-anchor-placement="up-center">
				<div
					class="bg-accent top-0 left-0 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 absolute aspect-square w-[35vw] rounded-full opacity-30 blur-3xl"
				/>
			</div>
			<div data-aos="zoom-in" data-aos-duration="1000" data-aos-anchor-placement="center-bottom">
				<div
					class="bg-accent-focus top-1/2 left-1/4 pointer-events-none transform -translate-x-1/2 absolute aspect-square w-[15vw] rounded-full opacity-60 blur-2xl"
				/>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
