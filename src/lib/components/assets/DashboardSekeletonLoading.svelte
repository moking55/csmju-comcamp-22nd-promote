<script>
	import DashboardLoadingSlot from './DashboardLoadingSlot.svelte';
</script>

<section id="main-container" class="">
	<div class="drawer lg:drawer-open bg-gradient-to-r from-secondary-content to-primary-content">
		<input id="my-drawer-2" type="checkbox" class="hidden drawer-toggle" />
		<div class="drawer-content flex flex-col">
			<!-- Page content here -->
			<div class="w-full fixed lg:hidden navbar bg-base-300">
				<div class="dropdown">
					<div class="flex-none lg:hidden">
						<label
							tabindex="0"
							for="my-drawer-3"
							aria-label="open sidebar"
							class="btn btn-square btn-ghost"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								class="inline-block w-6 h-6 stroke-current"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/></svg
							>
						</label>
					</div>
					<ul
						tabindex="0"
						class="dropdown-content z-[1] menu p-2 mt-4 shadow bg-base-300 rounded-box w-52"
					>
						{#each [1, 2, 3, 4] as list}
							<li>
								<div class="skeleton w-42" />
							</li>
						{/each}

						<li>
							<div class="skeleton w-32" />
						</li>
					</ul>
				</div>

				<div class="flex-1 px-2 mx-2">
					<div class="skeleton w-32" />
				</div>
			</div>

			<div class="w-11/12 mx-4 mt-20 sm:mx-6 my-12">
				<DashboardLoadingSlot />
			</div>
		</div>

		<div class="drawer-side h-screen">
			<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay" />
			<ul
				class="menu p-4 w-80 gap-y-2 min-h-full backdrop-filter backdrop-blur-lg py-6 bg-base-200/30 text-base-content text-base"
			>
				<div class="profile-avatar animate-pulse flex flex-col items-center gap-4 my-8">
					<div class="avatar skeleton placeholder">
						<div class="bg-base-200 text-neutral-content rounded-full w-16" />
					</div>
					<div class="skeleton w-32" />
					<span class="badge skeleton w-32 bg-base-200" />
					<span class="badge skeleton w-32 bg-base-200" />
				</div>
				<div class="btn skeleton bg-base-200 btn-sm" />
				<div class="divider" />
				{#each [1, 2, 3, 4] as list}
					<div class="skeleton animate-pulse bg-base-200 w-42 h-12 btn-sm btn" />
				{/each}
			</ul>
		</div>
	</div>
</section>
