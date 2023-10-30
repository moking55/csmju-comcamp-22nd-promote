<script lang="ts">
	import user from '$lib/assets/user.png';

	import Mapbox from '$lib/components/Mapbox.svelte';
	import { contract } from '$lib/data';

	let socialDisplay: 'facebook' | 'tiktok' = 'facebook';
	export let isMobile: boolean;
</script>

<section id="contact-section" class="bg-accent-focus/80 space-y-6 pt-14">
	<div id="contact-topic" class="container mx-auto flex justify-center lg:justify-start">
		<article class="prose-lg xl:prose-2xl text-start mx-3">
			<h1
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="text-base-content font-semibold"
			>
				Contact Us
			</h1>
		</article>
	</div>
	<footer
		class="xl:container mx-0 xl:mx-auto grid gap-y-8 lg:grid-cols-4 place-items-center bg-accent-focus/[0.01] h-[80rem] lg:h-[30rem] text-base-content"
	>
		<div
			data-aos-anchor-placement="up-center"
			data-aos="fade-up"
			class="mockup-phone shadow-xl shadow-white/50 col-span-full lg:col-span-1 text-base xl:text-lg border-white/80 h-full w-72"
		>
			<div class="camera" />
			<div class="display bg-base-200 w-full h-full">
				<div class="bg-slate-600/20 flex items-end pb-4 justify-center w-full h-1/4">
					<p class="font-semibold text-lg xl:text-xl text-base-content/80">Contactor</p>
				</div>
				<div class="relative p-4 gap-6 h-3/4 flex flex-col justify-center py-3">
					{#each contract.telContractor as data}
						<div class="flex items-center gap-4">
							<img src={user} alt="person" class="card z-10 h-14 w-14 bg-base-300 border-white" />
							<div class="">
								<p class=" font-semibold">{data.name}</p>
								<p>{data.tel}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
		{#if !isMobile}
			<!-- content here -->
			<div class="hidden lg:block col-span-full lg:col-span-1 text-base h-full w-72">
				<div class="relative">
					<div class="absolute -top-10 left-6">
						<button
							on:click={() =>
								socialDisplay === 'facebook'
									? (socialDisplay = 'tiktok')
									: (socialDisplay = 'facebook')}
							class:btn-secondary={socialDisplay !== 'facebook'}
							class="btn btn-sm"
						>
							{socialDisplay !== 'facebook' ? 'Facebook' : 'Tiktok'}
						</button>
					</div>
				</div>
				<div
					data-aos-anchor-placement="up-center"
					data-aos="fade-up"
					class:!z-10={socialDisplay === 'facebook'}
					class:!opacity-10={socialDisplay !== 'facebook'}
					class="mockup-phone shadow-xl z-0 shadow-white/50 text-base xl:text-lg border-white/80 h-full w-full"
				>
					<div class="camera" />
					<div class="display bg-base-200 w-full h-full">
						<iframe
							src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FCCCSMJU%2F&tabs=timeline&width=260&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
							class=" w-full h-full"
							style="border:none;overflow:hidden"
							scrolling="no"
							frameborder="0"
							allowfullscreen={true}
							allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
						/>
					</div>
				</div>
				<div
					class:!-z-10={socialDisplay !== 'tiktok'}
					class:!z-10={socialDisplay === 'tiktok'}
					class="absolute -translate-x-40 -translate-y-10 mockup-phone shadow-xl shadow-white/50 text-base xl:text-lg h-[32rem] border-white/80 w-80"
				>
					<div class="camera" />
					<div class="display bg-base-200 w-full relative h-[500px]">
						<iframe
							src="https://www.tiktok.com/embed/7254833307748224264"
							class="w-full h-full absolute"
							allowfullscreen
							scrolling="no"
							allow="encrypted-media;"
						/>
					</div>
				</div>
			</div>
		{/if}
		<div
			data-aos-anchor-placement="up-center"
			data-aos="fade-up"
			class="mockup-phone lg:hidden block shadow-xl shadow-white/50 col-span-full lg:col-span-1 text-base xl:text-lg border-white/80 h-full w-72"
		>
			<div class="camera" />
			<div class="display bg-base-200 w-full h-full">
				<div class="bg-slate-600/20 flex items-end pb-4 justify-center w-full h-1/4">
					<p class="font-semibold text-lg xl:text-xl text-base-content/80">Social Media</p>
				</div>
				<div class="relative p-4 gap-6 h-3/4 flex flex-col justify-center py-3">
					{#each contract.socials as data}
						<a href={data.link} class="flex items-center gap-4">
							<img
								src={data.icon}
								alt={data.name}
								class="card z-10 h-14 w-14 bg-base-300 border-white"
							/>
							<span class=" font-semibold">{data.name}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>

		<aside
			id="location-container"
			class="col-span-full space-y-4 h-fit lg:place-self-end lg:self-center md:h-full mt-0 lg:-mt-8 order-first lg:order-none lg:col-span-2"
		>
			<article
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="prose-sm xl:prose -space-y-6 mx-auto text-center"
			>
				<h1 class="">Address</h1>
				<h3 class="text-base-content/90">
					{contract.location.address}
				</h3>
			</article>
			<div
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="hidden h-3/4 md:flex justify-end"
			>
				<div class="mockup-browser shadow-xl shadow-white/50 w-full border bg-base-300">
					<div class="mockup-browser-toolbar">
						<div class="input">https://csmju-comcamp-22nd.com</div>
					</div>
					<div id="map-container" class="w-full h-72 lg:h-full">
						<Mapbox />
					</div>
				</div>
			</div>
		</aside>
	</footer>
	<div class="h-8 flex items-center justify-center bg-accent-content py-6 text-xs lg:text-base">
		<p class="text-center">
			© 2023 Comcamp 22 All right reserved. Designed and Developed by CSMJU27.
		</p>
	</div>
</section>

<!--- old version -->
<!-- <div class="relative gap-6 h-full flex justify-center items-center flex-wrap py-3">
					{#each contract.socials as data}
						<a href={data.link}>
							<img
								src={data.icon}
								alt={data.name}
								class="card z-10 h-14 w-14 bg-base-300 border-white"
							/>
						</a>
					{/each}
				</div> -->
