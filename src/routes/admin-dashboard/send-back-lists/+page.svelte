<script lang="ts">
	import Error550 from './../../../lib/components/errors/Error550.svelte';
	import DashboardLoadingSlot from './../../../lib/components/assets/DashboardLoadingSlot.svelte';
	import DeltaToHTML from './../../../lib/components/DeltaToHTML.svelte';
	import { getNotification, notificationStore } from '$lib/firebase/actions/notificationAction';

	import { onMount } from 'svelte';
	import SendNotificationForm from '$lib/components/SendNotificationForm.svelte';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';

	let promise: Promise<unknown>;

	let onEditMode: false;

	onMount(() => {
		promise = new Promise((resolve, reject) => {
			getNotification().then((res) => {
				try {
					notificationStore.set(res);
					resolve(res);
				} catch (error) {
					reject(error);
				}
			});
		});
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
	<!-- promise is pending -->
	<DashboardLoadingSlot loadSample="LOADING_SLOT" />
{:then}
	<section id="sendback-lists" class="h-screen lg:h-full space-y-4">
		<article class="prose prose-sm">
			<h2 class="text-base md:text-2xl">รายการ</h2>
		</article>
		<div class="flex w-full items-center justify-between">
			<p class="text-xs md;text-base">ตรวจสอบรายการที่ถูกส่งมาได้ที่นี้</p>
			<div class="flex flex-col text-xs md:text-base text-end gap-2">
				<label class="label gap-2 cursor-pointer">
					<span class="label-text">เข้าสู่โหมดแก้ไข</span>
					<input type="checkbox" bind:checked={onEditMode} class="checkbox" />
				</label>
				<p class="text-base-content/50 text-xs">
					กดติ๊กถูกออกเมื่อแก้ไขเสร็จเรียบร้อย หรือจะไปยังหน้าอื่น
				</p>
				<!-- <p class="text-base-content/50 text-xs">เพื่อกันการสแปมการแจ้งเตือน</p> -->
			</div>
		</div>
		<div class="divider" />
		{#if paginatedSource.length > 0}
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

						{#if onEditMode}
							<label for={`update_notification_model_${i}`} class="btn btn-outline grid">
								แก้ไข
							</label>

							<input type="checkbox" id={`update_notification_model_${i}`} class="modal-toggle" />
							<div class="modal" role="dialog">
								<div class="modal-box">
									<SendNotificationForm action="UPDATE" notificationEditor={list} />
								</div>
								<label class="modal-backdrop" for={`update_notification_model_${i}`}>Close</label>
							</div>
						{/if}
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
