<script lang="ts">
	import Error550 from '$lib/components/errors/Error550.svelte';
	import DashboardLoadingSlot from '$lib/components/assets/DashboardLoadingSlot.svelte';
	import DeltaToHTML from '../../../lib/components/DeltaToHTML.svelte';
	import { getNotification, notificationStore } from '$lib/firebase/actions/notificationAction';
	import Quill from 'quill';
	import type Delta from 'quill-delta';
	import { onMount } from 'svelte';
	import SendNotificationForm from '$lib/components/SendNotificationForm.svelte';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import { userData } from '$lib/firebase/actions/userAction';

	let promise: Promise<unknown>;

	onMount(() => {
		if ($userData) {
			promise = new Promise((resolve, reject) => {
				try {
					getNotification($userData!.uId).then((res) => {
						notificationStore.set(res);
						resolve(res);
					});
				} catch (err) {
					reject(err);
				}
			});
		}
	});

	let paginationSettings = {
		page: 0,
		limit: 5,
		size: $notificationStore.length,
		amounts: [1, 2, 5, 10]
	} satisfies PaginationSettings;

	$: paginatedSource = $notificationStore.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);
	$: paginationSettings.size = $notificationStore.length;
</script>

{#await promise}
	<DashboardLoadingSlot loadSample="LOADING_SLOT" />
{:then}
	<section id="sendback-lists" class="h-screen lg:h-full space-y-4">
		<article class="prose prose-sm">
			<h2 class="text-base md:text-2xl">การแจ้งเตือน</h2>
			<p>คุณจะได้รับการแจ้งเตือนต่าง ๆ จากผู้จัดโครงการ สามารถตรวจสอบได้ทุกเมื่อ</p>
		</article>
		<div class="divider" />
		{#if paginatedSource.length > 0}
			<!-- content here -->
			{#each paginatedSource as list, i (list.uId)}
				<!-- content here -->
				<div class="collapse bg-base-200">
					<input type="radio" name="accordion" />
					<div class="collapse-title font-medium">
						<div class="flex items-center justify-between">
							<div class=" md:text-xl gap-4 flex-1">
								<p>
									หัวข้อ: {list.title}
								</p>
								<p class="text-sm">
									<span class="font-semibold">ส่งเมื่อวันที:</span>
									{list.created.toDate().toLocaleDateString()}
								</p>
							</div>
							<div class="font-light text-xs text-end">
								<p>ส่งถึง: {list.toUserName}</p>
								<p>{list.toUserEmail}</p>
							</div>
						</div>
					</div>
					<div class="collapse-content space-y-6">
						{#if list.lastDateEdit}
							<div class="text-sm text-center">
								<span class="text-semibold">แก้ไขล่าสุด: </span>
								{list.lastDateEdit.toDate().toLocaleDateString()}
							</div>
						{/if}
						<div class="divider" />
						<article class="porse">
							<DeltaToHTML deltaContext={list.description} />
						</article>
					</div>
				</div>
			{/each}
			<Paginator
				active="text-white bg-white"
				bind:settings={paginationSettings}
				buttonClasses="btn btn-ghost btn-sm rounded-btn"
				showFirstLastButtons={false}
				showPreviousNextButtons={true}
			/>
		{:else}
			<div class="grid h-screen px-4 place-content-center">
				<h1 class="tracking-widest text-xl text-gray-500 uppercase">
					ยังไม่มีการแจ้งเตือนในขณะนี้
				</h1>
			</div>
		{/if}
	</section>{:catch errors}
	<Error550 {errors} />
{/await}
