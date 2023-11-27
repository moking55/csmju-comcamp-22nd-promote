<script lang="ts">
	import Error550 from '$lib/components/errors/Error550.svelte';
	import DashboardSekeletonLoading from './../../lib/components/assets/DashboardSekeletonLoading.svelte';
	import 'iconify-icon';
	import { goto } from '$app/navigation';
	import { auth as authData, signOutUser } from '$lib/firebase/actions/authAction';
	import { Toast } from '$lib/middleware/alertConfig';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { checkAndSetUserData } from '$lib/firebase/actions/userAction';
	import { adminMenu } from '$lib/dashboardData';
	import { getList, listStore } from '$lib/firebase/admin-actions/adminListAction';
	import { initFirebase } from '$lib/firebase/config';
	import { onAuthStateChanged } from 'firebase/auth';
	import { userData } from '$lib/firebase/actions/userAction';

	let promise: Promise<unknown>;

	onMount(() => {
		initFirebase();
		const { auth } = initFirebase();
		onAuthStateChanged(auth, (data) => {
			authData.set(data);
			promise = new Promise((resolve, reject) => {
				try {
					if (data) {
						checkAndSetUserData(data.uid).then(async ($userData) => {
							await ifAdmin();
							resolve($userData);
						});
					} else {
						if (import.meta.env.VITE_DEV_MODE == 'true') console.error('No Auth Data', data);
						resolve(goto('/'));
					}
				} catch (err) {
					reject(err);
				}
			});
		});
	});

	function singOut() {
		signOutUser().then(() => {
			return goto('/');
		});
	}

	async function ifAdmin() {
		if ($authData) {
			if ($authData?.email !== import.meta.env.VITE_ADMIN_EMAIL) {
				return signOutUser().then(() => {
					return Toast.fire({
						icon: 'warning',
						title: 'กรุณาเข้าสู่ระบบในฐานะผู้ดูแลระบบ'
					});
				});
			}
		} else {
			return goto('/authentication');
		}
	}
</script>

{#await promise}
	<!-- promise is pending -->
	<DashboardSekeletonLoading />
{:then}
	{#if $userData}
		<!-- content here -->
		<section id="main-container" class="">
			<div
				class="drawer lg:drawer-open overflow-x-auto bg-gradient-to-r from-secondary-content to-primary-content"
			>
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
								{#each adminMenu as list}
									<li class:list-active={$page.url.pathname === list.path}>
										<a href={list.path}><iconify-icon icon={list.icon} />{list.title}</a>
									</li>
								{/each}

								<li>
									<button on:click={() => singOut()} class="bg-error">ออกจากระบบ</button>
								</li>
							</ul>
						</div>

						<div class="flex-1 px-2 mx-2">
							<h1>
								{$userData.info.name}
								<p class="text-xs text-base-content/50">{$authData?.email}</p>
							</h1>
						</div>
					</div>

					<div class="mx-6 sm:w-11/12 h-screen overflow-x-auto mt-20">
						<slot />
					</div>
				</div>

				<div class="drawer-side h-full">
					<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay" />
					<ul
						class="menu p-4 w-80 gap-y-2 min-h-full backdrop-filter backdrop-blur-lg py-6 bg-base-200/30 text-base-content text-xl"
					>
						<div class="profile-avatar flex flex-col items-center gap-4 my-8">
							<div class="avatar online placeholder">
								<div class="bg-neutral text-neutral-content rounded-full w-16">
									<span class="text-xl">A</span>
								</div>
							</div>
							<h1>Admin</h1>
							<span class="badge badge-outline">{$authData?.email}</span>
						</div>
						<div on:click={() => singOut()} class="btn btn-error btn-sm">ออกจากระบบ</div>
						<div class="divider" />
						{#each adminMenu as list}
							<li class:list-active={$page.url.pathname === list.path}>
								<a href={list.path}><iconify-icon icon={list.icon} />{list.title}</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>
	{/if}
{:catch errors}
	<Error550 {errors} />
{/await}

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans+Thai:400,500,600,700&display=swap&subset=thai');
	@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
	body {
		font-family: 'IBM Plex Sans Thai', sans-serif;
		overflow-x: hidden;
	}

	.eng-font {
		font-family: 'Roboto', sans-serif;
	}
	.list-active {
		@apply border-2 border-base-content/50 rounded-lg;
	}

	/* total width */
	body::-webkit-scrollbar {
		background-color: hsl(var(--b3));
		width: 4px;
	}

	/* background of the scrollbar except button or resizer */
	body::-webkit-scrollbar-track {
		background-color: hsl(var(--b1));
	}

	/* scrollbar itself */
	body::-webkit-scrollbar-thumb {
		background-color: hsl(var(--b2));
		border-radius: 16px;
		border: 4px solid #fff;
	}

	/* set button(top and bottom of the scrollbar) */
	body::-webkit-scrollbar-button {
		display: none;
	}
</style>
