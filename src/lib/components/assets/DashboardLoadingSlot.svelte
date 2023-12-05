<script lang="ts">
	export let loadSample: 'LOADING_PROPS' | 'LOADING_SLOT' = 'LOADING_PROPS';
</script>

{#if loadSample === 'LOADING_PROPS'}
	<!-- content here -->
	<section id="loading-props" class="space-y-4">
		<div class="flex flex-col gap-4">
			<div class="text-base md:text-2xl badge bg-base-200 skeleton w-1/4 animate-pulse" />
			<div class="text-base md:text-2xl badge bg-base-200 skeleton w-2/4 animate-pulse" />
		</div>
		<div class="divider" />
		<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
			{#each [1, 2, 3, 4, 5, 6, 7, 8] as temp}
				<div class="stats shadow">
					<div class="stat animate-pulse space-y-4 bg-base-200">
						<div class="">
							<div class="stat-title float-left animate-pulse bg-base-300 badge-sm w-12 h-4" />
							<div class="stat-title float-right animate-pulse bg-base-300 badge-sm w-8 h-4" />
						</div>
						<div class="stat-value text-base animate-pulse bg-base-300 w-full h-12" />
						<div class="stat-desc text-base animate-pulse bg-base-300 badge badge-sm w-full h-4" />
					</div>
				</div>
			{/each}
		</div>
	</section>
{:else}
	<section id="loading-slot" class="space-y-4">
		<div class="flex flex-col gap-4">
			<div class="text-base md:text-2xl badge bg-base-200 skeleton w-1/4 animate-pulse" />
			<div class="text-base md:text-2xl badge bg-base-200 skeleton w-2/4 animate-pulse" />
		</div>
		<div class="divider" />
		<div class="grid h-screen place-content-center gap-6">
			<span class="loading loading-ring w-32" />
		</div>
	</section>{/if}
