<script lang="ts">
	import Error550 from '$lib/components/errors/Error550.svelte';
	import SendNotificationForm from '$lib/components/SendNotificationForm.svelte';
	import {
		listStore,
		type List,
		markAsRead,
		getList,
		sendNotificationAndMarkAsReads
	} from '$lib/firebase/admin-actions/adminListAction';
	import { CldImage } from 'svelte-cloudinary';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import DashboardLoadingSlot from '$lib/components/assets/DashboardLoadingSlot.svelte';
	import { Toast } from '$lib/middleware/alertConfig';
	import handler from '$lib/firebase/errors/clientHandler';
	import { FirebaseError } from 'firebase/app';

	let promise: Promise<unknown>;
	let whileActionSubmit = false;

	onMount(() => {
		promise = new Promise((resolve, reject) => {
			try {
				getList().then((res) => {
					listStore.set(res);
					resolve(res);
				});
			} catch (err) {
				reject(err);
			}
		});
	});

	let paginationSettings = {
		page: 0,
		limit: 5,
		size: $listStore.length,
		amounts: [1, 2, 5, 10]
	} satisfies PaginationSettings;

	let filter = 'unread';
	let sortOpt = {
		date: false,
		title: false
	};

	function onSortBy(sortBy: 'date' | 'title') {
		if (sortBy === 'date') {
			paginatedSource = paginatedSource.sort((a, b) => {
				const dateComparison = a.data.date.seconds - b.data.date.seconds;
				return sortOpt.date ? dateComparison : -dateComparison;
			});
		} else if (sortBy === 'title') {
			paginatedSource = paginatedSource.sort((a, b) => {
				const titleComparison = a.data.title.localeCompare(b.data.title);
				return sortOpt.date ? titleComparison : -titleComparison;
			});
		}
	}

	function onSendBackConfirmationAndMarkAsReadToAllUsers() {
		if (filter === 'unread') {
			sendNotificationAndMarkAsReads(paginatedSource)
				.then(() => {
					Toast.fire({
						icon: 'success',
						title: 'ส่งการแจ้งเตือนเรียบร้อยแล้ว'
					});
				})
				.catch((error) => {
					if (error instanceof FirebaseError) {
						whileActionSubmit = false;
						return handler(error, 'ไม่สามารถส่งการแจ้งเตือนได้');
					}
					Toast.fire({
						icon: 'error',
						title: 'ไม่สามารถส่งการแจ้งเตือนได้'
					});
					whileActionSubmit = false;
				});
		}
	}

	$: filterRule = () => {
		return filter === 'read';
	};

	$: paginatedSource = $listStore
		.filter((ls) => ls.data.read === filterRule())
		.slice(
			paginationSettings.page * paginationSettings.limit,
			paginationSettings.page * paginationSettings.limit + paginationSettings.limit
		);
	$: paginationSettings.size = $listStore.length;
</script>

{#await promise}
	<!-- promise is pending -->
	<DashboardLoadingSlot loadSample={'LOADING_SLOT'} />
{:then}
	<section id="lists" class="h-screen lg:h-full space-y-4">
		<article class="prose prose-sm">
			<h2 class="text-base md:text-2xl">รายการ</h2>
		</article>
		<div class="flex items-center justify-between">
			<p class="text-sm">ตรวจสอบรายการที่ถูกส่งมาได้ที่นี้</p>
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<label for="filter" class="text-sm">กรองตาม</label>
					<select
						bind:value={filter}
						name="filter"
						id="filter"
						class="select select-bordered select-sm w-32"
					>
						<option value="read">อ่านแล้ว</option>
						<option selected value="unread">ยังไม่ได้อ่าน</option>
					</select>
				</div>
				{#if filter === 'unread'}
					<div
						class="tooltip"
						data-tip="ส่งการแจ้งเตือนในกล่องข้อความและอีเมล์ที่ติดต่อ เพื่อยืนยันการตรวจสอบหลักฐาน ให้กับผู้ใช้ที่ส่งหลักฐานมาจากรายการ 'ยังไม่ได้อ่าน' ทั้งหมดจากนั้นมาร์ครายการเป็น 'อ่านแล้ว'"
					>
						<button
							on:click={() => onSendBackConfirmationAndMarkAsReadToAllUsers()}
							class="btn btn-sm btn-accent"
							><iconify-icon icon="ph-question" /> ตอบกลับการยืนยันทั้งหมด
							{#if whileActionSubmit}
								<span class="loading loading-spinner loading-xs" />
							{/if}
						</button>
					</div>
				{/if}
			</div>
		</div>
		<div class="divider" />
		{#if $listStore.length > 0}
			<div class="overflow-x-auto">
				<table class="table text-xs">
					<!-- head -->
					<thead>
						<tr>
							<th />
							<th>ชื่อ</th>
							{#each Array(6) as item}
								<th />
							{/each}

							<th>อีเมล์</th>
							<th>โรงเรียน</th>
							{#each Array(4) as item}
								<th />
							{/each}

							<th>ไฟล์ที่แนบมา</th>
							<th
								class="cursor-pointer hover:bg-base-300/50 rounded-md"
								on:click={() => ((sortOpt.title = !sortOpt.title), onSortBy('title'))}
								>หัวข้อ <iconify-icon
									icon={sortOpt.title ? 'mdi:arrow-up' : 'mdi:arrow-down'}
								/></th
							>
							<th
								class="cursor-pointer hover:bg-base-300/50 rounded-md"
								on:click={() => ((sortOpt.date = !sortOpt.date), onSortBy('date'))}
								>ส่งเมื่อ <iconify-icon
									icon={sortOpt.date ? 'mdi:arrow-up' : 'mdi:arrow-down'}
								/></th
							>
						</tr>
					</thead>
					<tbody>
						{#each paginatedSource as list, i (list.uId)}
							<tr>
								<th>{i}</th>
								<td colspan="7">{list.data.name}</td>
								<td>{list.data.userEmail}</td>
								<td colspan="5">{list.data.school}</td>
								<td class="grid place-content-center">
									<label for={`model_${i}`} class=" btn btn-sm">ดูไฟล์</label>
								</td>
								<td>{list.data.title ?? '-'}</td>
								<td>{list.data.date.toDate().toLocaleString()}</td>
								<input type="checkbox" id={`model_${i}`} class="modal-toggle" />
								<div id={`model_${i}`} class="modal" role="dialog">
									<div class="modal-box">
										<CldImage
											width="1200"
											height="1200"
											style="width: auto; height: auto;"
											src={list.data.fileAttachmentSrc}
											alt="request-image"
										/>
									</div>
									<label class="modal-backdrop" for={`model_${i}`}>Close</label>
								</div>
								<td>
									<label for={`sendback_model_${i}`} class="btn btn-sm">ตอบกลับ</label>
								</td>

								<input type="checkbox" id={`sendback_model_${i}`} class="modal-toggle" />
								<div class="modal" role="dialog">
									<div class="modal-box">
										<SendNotificationForm action="CREATE" listEditor={list} />
									</div>
									<label class="modal-backdrop" for={`sendback_model_${i}`}>Close</label>
								</div>

								<td>
									<input
										on:change={() => markAsRead(list.uId)}
										disabled={list.data.read}
										checked={list.data.read}
										type="checkbox"
										class="checkbox border-white"
									/>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div class="">
					<Paginator
						active="text-white bg-white"
						bind:settings={paginationSettings}
						buttonClasses="btn btn-ghost btn-sm rounded-btn"
						showFirstLastButtons={false}
						showPreviousNextButtons={true}
					/>
				</div>
			</div>
		{:else}
			<!-- else content here -->
			<div class="grid h-screen px-4 place-content-center">
				<h1 class="tracking-widest text-xl text-gray-500 uppercase">
					ยังไม่มีการแจ้งเตือนในขณะนี้
				</h1>
			</div>
		{/if}
	</section>{:catch errors}
	<Error550 {errors} />
{/await}
