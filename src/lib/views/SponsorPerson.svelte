<script lang="ts">
	import { getSponsorList } from '$lib/firebase/actions/sponsorAction';
	import { concat, reverse, slice } from 'lodash';
	import SponsorPersonCard from './../components/SponsorPersonCard.svelte';
	import { sponsor } from '$lib/data';
</script>

{#await getSponsorList() then sponsorList}
	{#if sponsorList.length > 0}
		<div id="text-grid" class="flex justify-center items-center">
			<h1
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="text-4xl md:text-6xl py-4 gradient-heading uppercase bg-gradient-to-b to-80% font-bold from-primary-focus via-primary to-accent-focus"
			>
				และผู้สนับสนุนโครงการ
			</h1>
		</div>
		<div class="h-[32rem] overflow-x-hidden">
			<div class="h-full flex justify-center items-center flex-col gap-10 flex-1">
				<div class=" slice-animate-to-left">
					<div class="flex justify-center gap-4 flex-1">
						<div class="flex flex-container gap-6 min-h-min">
							{#each sponsorList.concat(sponsorList.length > 4 ? sponsorList.slice(0, 4) : sponsorList) as sponsor}
								<SponsorPersonCard {sponsor} />
							{/each}
						</div>
					</div>
				</div>
				<div class=" slice-animate-to-right">
					<div class="flex justify-center gap-4 flex-1">
						<div class="flex flex-container gap-6 min-h-min">
							{#each sponsorList
								.concat(sponsorList.length > 4 ? sponsorList.slice(0, 4) : sponsorList)
								.reverse() as sponsor}
								<SponsorPersonCard {sponsor} />
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/await}

<style lang="postcss">
	@keyframes slide-to-left {
		0% {
			transform: translateX(0%);
		}
		100% {
			transform: translateX(20rem);
		}
	}
	@keyframes slide-to-right {
		0% {
			transform: translateX(20rem);
		}
		100% {
			transform: translateX(0);
		}
	}

	.slice-animate-to-left {
		animation: slide-to-left 10s linear infinite alternate;
	}
	.slice-animate-to-right {
		animation: slide-to-right 10s linear infinite alternate;
	}
</style>
