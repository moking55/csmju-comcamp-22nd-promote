<script lang="ts">
    import logo from '$lib/assets/comcamp-22nd-logo.png';

	import { navbarMenu, actionMenu } from '../data';

	export let y: number;

	$: handleScroll = (current: number, nextTarget: number) => {
		return y > current && y < nextTarget;
	};
</script>

<div class="fixed z-50 w-full text-gray-900 bg-white bg-opacity-0 backdrop-filter backdrop-blur-lg">
	<div
		class="flex items-center justify-between max-w-6xl px-4 py-3 mx-0 lg:mx-auto sm:px-6 md:space-x-10"
	>
		<div class="flex justify-start lg:w-0 lg:flex-1">
			<span class="sr-only">Logo comcamp 22nd</span><a href="/"
				><span class="block"
					><img
						alt="comcamp-22nd-navbar-logo"
						loading="lazy"
						decoding="async"
						data-nimg="1"
						class="rounded-full w-12"
						src={logo}
						style="color: transparent;"
					/></span
				></a
			>
		</div>
		<div class="-my-2 -mr-2 dropdown dropdown-end md:hidden">
			<div
				tabindex="0"
				class="bg-gray-200 text-gray-600 rounded-full p-3.5 inline-flex items-center justify-center hover:text-gray-700 hover:bg-gray-300 cursor-pointer focus:outline-none general-ring-state"
			>
				<span class="sr-only">Open menu</span><svg
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M4.75 5.75H19.25"
					/><path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M4.75 18.25H19.25"
					/><path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M4.75 12H19.25"
					/></svg
				>
			</div>
			<ul
				tabindex="0"
				class="dropdown-content z-[1] backdrop-filter backdrop-blur-lg menu mt-4 shadow bg-base-content/80 text-base rounded-box w-52"
			>
				{#each navbarMenu as data, i}
					<li><a href={data.ref}>{data.label}</a></li>
				{/each}
				{#each actionMenu as data, i}
					<li class="bg-accent rounded-md">
						<a class="text-accent-content" href={data.link}>{data.label}</a>
					</li>
				{/each}
			</ul>
		</div>
		<nav class="hidden space-x-8 text-sm lg:text-lg md:flex">
			{#each navbarMenu as data, i}
				<a href={data.ref}
					><span
						class:!text-accent={handleScroll(data.yValue, navbarMenu[i + 1]?.yValue ?? 20000)}
						class="font-normal text-base-content/70 hidden md:inline-block rounded-full hover:text-base-content transition-all"
						>{data.label}</span
					></a
				>
			{/each}
		</nav>
		<div class="items-center justify-end hidden md:flex lg:flex-1 lg:w-0">
			<a
				href={actionMenu.find((a) => a.name === 'register')?.link}
				aria-label="Register Link"
				type="button"
				class="btn btn-sm btn-accent general-ring-state"
				><div>
					{actionMenu.find((a) => a.name === 'register')?.label}
				</div></a
			>
		</div>
	</div>
</div>
