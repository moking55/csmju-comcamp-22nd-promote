<script lang="ts">
	import SponsorEditor from './../../../lib/components/assets/SponsorEditor.svelte';
	import { getSponsorList, sponsorStore, deleteSponsor } from '$lib/firebase/actions/sponsorAction';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	import DashboardLoadingSlot from '$lib/components/assets/DashboardLoadingSlot.svelte';
	import { FirebaseError } from 'firebase/app';
	import { Toast } from '$lib/middleware/alertConfig';
	import handler from '$lib/firebase/errors/clientHandler';
	import Swal from 'sweetalert2';

	let onEditMode = false;
	let promise: Promise<null>;

	onMount(() => {
		promise = new Promise(async (resolve, reject) => {
			try {
				const boardList = await getSponsorList();
				sponsorStore.set(boardList);
				resolve(null);
			} catch (err) {
				reject(err);
			}
		});
	});

	function onDeleteSponsor(uId: string) {
		Swal.fire({
			icon: 'info',
			title: 'ยืนยันการลบข้อมูล',
			showCancelButton: true,
			confirmButtonText: 'ลบ'
		}).then((result) => {
			if (result.isConfirmed) {
				deleteSponsor(uId)
					.then(() => {
						Toast.fire({
							title: 'ลบข้อมูลสำเร็จ',
							icon: 'success'
						});
					})
					.catch((error) => {
						if (error instanceof FirebaseError) {
							handler(error, 'ไม่สามารถลบข้อมูลได้');
						}
					});
			}
		});
	}

	let paginationSettings = {
		page: 0,
		limit: 5,
		size: $sponsorStore.length,
		amounts: [1, 2, 5, 10]
	} satisfies PaginationSettings;

	$: paginatedSource = $sponsorStore.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);
	$: paginationSettings.size = $sponsorStore.length;
</script>

{#await promise}
	<DashboardLoadingSlot loadSample={'LOADING_SLOT'} />
{:then}
	<section id="lists" class="flex items-center justify-between space-y-4">
		<article class="prose prose-sm">
			<h2 class="text-base md:text-2xl">รายการผู้บริจาค</h2>
			<p class="text-sm">ตรวจสอบรายการที่ถูกส่งมาได้ที่นี้</p>
		</article>
		<div class="flex gap-4 items-center justify-between">
			<div class="flex flex-col text-end gap-2">
				<label class="label gap-2 cursor-pointer">
					<span class="label-text">เข้าสู่โหมดแก้ไข</span>
					<input type="checkbox" bind:checked={onEditMode} class="checkbox" />
				</label>
				<p class="text-base-content/50 text-xs">
					กดติ๊กถูกออกเมื่อแก้ไขเสร็จเรียบร้อย หรือจะไปยังหน้าอื่น
				</p>
				<div>
					<label for={`add_sponsor_action`} class="btn btn-sm btn-primary">
						เพิ่มรายชื่อผู้บริจาค
					</label>
					<input type="checkbox" id={`add_sponsor_action`} class="modal-toggle" />
					<div class="modal" role="dialog">
						<div class="modal-box">
							<SponsorEditor />
						</div>
						<label class="modal-backdrop" for={`add_sponsor_action`}>Close</label>
					</div>
				</div>
			</div>
		</div>
	</section>
	<div class="divider" />
	{#if $sponsorStore.length > 0}
		<div class="overflow-x-auto">
			<table class="table text-xs">
				<!-- head -->
				<thead>
					<tr>
						<th>ชื่อ</th>
						{#each Array(5) as item}
							<th />
						{/each}

						<th>บริจาคในฐานะ</th>
						{#each Array(6) as item}
							<th />
						{/each}
						<th>บริษัท/มาจาก</th>
						{#each Array(3) as item}
							<th />
						{/each}
						<th>จำนวนเงิน (บาท)</th>
						<th>วันที่บริจาค</th>
						<th>สร้างเมื่อ</th>
						<th />
						<th />
					</tr>
				</thead>
				<tbody>
					{#each paginatedSource as list, i (list.uId)}
						<tr>
							<td colspan="6">{list.name}</td>
							<td colspan="7">{list.position ?? '-'}</td>
							<td colspan="4">{list.from ?? '-'}</td>
							<td>{list.donateAmount ?? '-'}</td>
							<td>{list.donateDate?.toDate().toLocaleDateString() ?? '-'}</td>
							<td>{list.created_at.toDate().toLocaleString()}</td>
							<td>
								<div class="grid grid-flow-row gap-2">
									{#if onEditMode}
										<div>
											<label for={`update_sponsor_id-${i}_action`} class="btn btn-sm btn-info">
												แก้ไข
											</label>

											<input
												type="checkbox"
												id={`update_sponsor_id-${i}_action`}
												class="modal-toggle"
											/>
											<div class="modal" role="dialog">
												<div class="modal-box">
													<SponsorEditor sponsorEditor={{ index: i, sponsor: list }} />
												</div>
												<label class="modal-backdrop" for={`update_sponsor_id-${i}_action`}
													>Close</label
												>
											</div>
										</div>
									{/if}
									<button on:click={() => onDeleteSponsor(list.uId)} class="btn-sm btn btn-error">
										ลบ
									</button>
								</div>
							</td>
							<td />
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
			<h1 class="tracking-widest text-xl text-gray-500 uppercase">ยังไม่มีรายการในขณะนี้</h1>
		</div>
	{/if}
{:catch error}
	<!-- promise was rejected -->
{/await}
