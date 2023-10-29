<script lang="ts">
	import Sponsor from './Sponsor.svelte';
	import SponsorCard from '$lib/components/SponsorCard.svelte';
	import { slide } from 'svelte/transition';
	import { sponsor } from '../../data';
</script>

<section id="sponsor-section" class="overflow-hidden">
	<div class="grid bg-gradient-to-b from-base-100 via-[85%] via-orange-700/80 my-40 py-10">
		<div class="relative h-full">
			<div
				class="bg-secondary z-10 top-0 md:-top-[10%] -left-[5%] md:left-[5%] pointer-events-none transform absolute aspect-square w-[14rem] lg:w-[24rem] rounded-full opacity-40 blur-3xl"
			/>
			<div class="absolute opacity-60 inset-x-0 inset-y-8 lg:inset-y-18">
				<div
					class="absolute inset-0 will-change-transform"
					style="background: radial-gradient(95% 150% at 13.18% 0%, rgb(14, 115, 204) 0%, rgb(98, 75, 187) 29.47%, rgb(255, 69, 93) 52.87%, rgb(243, 88, 21) 86.38%, rgb(254, 213, 74) 100%); opacity: 1; filter: blur(1px); transform: none;"
				/>
			</div>
			<div
				class="bg-accent z-10 top-0 translate-y-3/4 md:translate-y-1/2 left-3/4 pointer-events-none transform absolute aspect-square w-[20rem] lg:w-[24rem] rounded-full opacity-60 blur-3xl"
			/>
			<div class="grid z-10 h-full container w-full mx-auto gap-y-10 sm:grid-cols-5">
				<div
					id="logo-grid-2"
					class=" sm:col-span-2 flex flex-col xl:flex-row gap-10 justify-start flex-nowrap xl:flex-wrap"
				>
					{#each sponsor.slice(0, 4) as data}
						<SponsorCard {data} />

						<!-- content here -->
					{/each}
				</div>
				<div id="text-grid" class="flex justify-center items-center xl:items-start">
					<div class="absolute xl:relative">
						<article class="z-10 prose-2xl text-center">
							<div class="rotate-90 lg:rotate-0">
								<h1
									data-aos-anchor-placement="up-center"
									data-aos="fade-up"
									class="gradient-heading uppercase bg-gradient-to-t font-bold from-primary-focus via-primary to-accent-focus"
								>
									Sponsors
								</h1>
							</div>
							<h3
								data-aos-anchor-placement="up-center"
								data-aos="fade-up"
								class="hidden lg:block font-bold"
							>
								ขอขอบคุณผู้ใหญ่ใจดี
							</h3>
						</article>
					</div>
				</div>
				<div
					id="logo-grid-2"
					class="sm:col-span-2 flex flex-col xl:flex-row gap-10 justify-end flex-nowrap xl:flex-wrap"
				>
					{#each sponsor.slice(4, 8) as data}
						<SponsorCard {data} />
						<!-- content here -->
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
