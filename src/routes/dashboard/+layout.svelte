<script context="module" lang="ts">
	export function getStatus(
		status: boolean | undefined,
		user: User
	): 'success' | 'warning' | 'pending' {
		if (status) {
			return 'success';
		} else if (user?.assets.paymentReceiptSrc && user?.assets.parentPermissionSrc) {
			return 'pending';
		} else {
			return 'warning';
		}
	}

	export let getStatusText = (status: 'success' | 'warning' | 'pending') => {
		const statusMap = {
			pending: 'รอการตรวจสอบ',
			success: 'ผ่านการตรวจสอบ',
			warning: 'ยังไม่ได้ส่งหลักฐาน'
		};
		return statusMap[status];
	};
</script>

<script lang="ts">
	import DashboardSekeletonLoading from './../../lib/components/assets/DashboardSekeletonLoading.svelte';
	import Error550 from '$lib/components/errors/Error550.svelte';
	import 'iconify-icon';
	import { goto } from '$app/navigation';
	import { auth as authStore, signOutUser } from '$lib/firebase/actions/authAction';
	import { Toast } from '$lib/middleware/alertConfig';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { checkAndSetUserData, userData, type User } from '$lib/firebase/actions/userAction';
	import { filesDownloader, menu } from '$lib/dashboardData';
	import { cloudinaryConfig } from '$lib/config/cloundinary';
	import { initFirebase } from '$lib/firebase/config';
	import { onAuthStateChanged } from 'firebase/auth';

	let statusDesc = [
		'1. ยังไม่ได้ส่งหลักฐาน : ส่งหลักฐานไม่ครบ \n',
		'2. รอการตรวจสอบ: ส่งหลักฐานครบแล้ว รอการตรวจสอบและอนุมัติ \n',
		'3. ผ่านการตรวจสอบ: ผ่านการอนุมัติของโครงการ \n'
	];

	let statusText: string;
	let status: ReturnType<typeof getStatus>;

	function singOut() {
		signOutUser().then(() => {
			return goto('/');
		});
	}

	onMount(() => {
		initFirebase();
		const { auth } = initFirebase();
		onAuthStateChanged(auth, (authData) => {
			authStore.set(authData);
			if (!$authStore) {
				goto('/authentication');
				Toast.fire({
					icon: 'warning',
					title: 'กรุณาเข้าสู่ระบบก่อน'
				});
			} else {
				checkAndSetUserData(authData!.uid).then((userData) => {
					if (!userData) return goto('/authentication/info-register');
					cloudinaryConfig();
				});
			}
		});
	});

	const sub = userData.subscribe((data) => {
		if ($userData) {
			status = getStatus(data?.status, $userData);
			statusText = getStatusText(status);
		}
	});

	onDestroy(sub);
</script>

{#if $authStore}
	{#await checkAndSetUserData($authStore?.uid)}
		<DashboardSekeletonLoading />
	{:then userData}
		<section id="main-container" class="">
			<div class="drawer lg:drawer-open bg-gradient-to-r from-secondary-content to-primary-content">
				<input id="my-drawer-2" type="checkbox" class="hidden drawer-toggle" />
				<div class="drawer-content flex flex-col">
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
								class="dropdown-content z-[9999] menu p-2 mt-4 shadow bg-base-300 rounded-box w-52"
							>
								{#each menu as list}
									<li class:list-active={$page.url.pathname === list.path}>
										<a href={list.path}><iconify-icon icon={list.icon} />{list.title}</a>
									</li>
								{/each}
								<div class="divider text-sm">อื่น ๆ</div>
								{#each filesDownloader as file}
									<li>
										<a href={file.src} download><iconify-icon icon={file.icon} /> {file.title}</a>
									</li>
								{/each}

								<li>
									<button on:click={() => singOut()} class="bg-error">ออกจากระบบ</button>
								</li>
							</ul>
						</div>
						<div class="flex flex-auto justify-between">
							<div class="flex-1 px-2 mx-2">
								<h1>
									{userData?.info.name}
									<p class="text-xs text-base-content/50">{$authStore?.email}</p>
								</h1>
							</div>
							<div class="tooltip mr-4 tooltip-bottom" data-tip={statusDesc.join('\n')}>
								<span
									class:badge-warning={status === 'warning'}
									class:badge-success={status === 'success'}
									class:badge-info={status === 'pending'}
									class="badge cursor-pointer badge-sm">สถานะ {statusText}</span
								>
							</div>
						</div>
					</div>

					<div class="w-11/12 mx-4 mt-20 sm:mx-6 my-12">
						<slot />
					</div>
				</div>

				<div class="drawer-side h-screen">
					<label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay" />
					<ul
						class="menu p-4 w-80 gap-y-2 min-h-full backdrop-filter backdrop-blur-lg py-6 bg-base-200/30 text-base-content text-base"
					>
						<div class="profile-avatar flex flex-col items-center gap-4 my-8">
							<div class="avatar online placeholder">
								<div class="bg-neutral text-neutral-content rounded-full w-16">
									<span class="text-xl">{userData?.info.nickname[0]}</span>
								</div>
							</div>
							<h1>{userData?.info.name}</h1>
							<span class="badge badge-outline">{$authStore?.email}</span>
							<div class="tooltip" data-tip={statusDesc.join('\n')}>
								<span
									class:badge-warning={status === 'warning'}
									class:badge-success={status === 'success'}
									class:badge-info={status === 'pending'}
									class="badge cursor-pointer">สถานะ {statusText}</span
								>
							</div>
						</div>
						<div on:click={() => singOut()} class="btn btn-error btn-sm">ออกจากระบบ</div>
						<div class="divider" />
						{#each menu as list}
							<li class:list-active={$page.url.pathname === list.path}>
								<a href={list.path}><iconify-icon icon={list.icon} />{list.title}</a>
							</li>
						{/each}
						<div class="divider text-sm">อื่น ๆ</div>

						<li class="dropdown dropdown-start">
							<label>ดาวน์โหลดเอกสาร</label>
							<ul class=" dropdown-open z-20 menu p-2 shadow rounded-box w-52">
								{#each filesDownloader as file}
									<li>
										<a href={file.src} download><iconify-icon icon={file.icon} /> {file.title}</a>
									</li>
								{/each}
							</ul>
						</li>
					</ul>
				</div>
			</div>
		</section>
	{:catch errors}
		<Error550 {errors} />
	{/await}
{/if}

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
