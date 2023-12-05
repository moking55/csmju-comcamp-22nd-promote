<script lang="ts">
	import { deleteBoard, type BoardList } from '$lib/firebase/actions/boardAction';
	import DeltaToHTML from '$lib/components/DeltaToHTML.svelte';
	import { initializeStores, type DrawerSettings, Drawer, AppShell } from '@skeletonlabs/skeleton';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import BoardEditor from './BoardEditor.svelte';
	import { Toast } from '$lib/middleware/alertConfig';
	import handler from '$lib/firebase/errors/clientHandler';
	import type { FirebaseError } from 'firebase/app';
	import Swal from 'sweetalert2';

	initializeStores();
	const drawerStore = getDrawerStore();
	const drawerSettings: DrawerSettings = {
		id: 'example-2',
		bgBackdrop: 'bg-base-100/30 ',
		width: 'w-3/4 sm:w-2/4 md:w-2/6',
		bgDrawer: 'bg-base-200/50 backdrop-blur-sm'
	};

	export let onEditMode: boolean = false;
	export let boardList: BoardList[];

	const filterOpts = {
		tags: boardList.reduce((acc: string[], board) => {
			board.tags.forEach((tag) => {
				if (!acc.includes(tag)) {
					acc.push(tag);
				}
			});
			return acc;
		}, []),
		dateSorted: true
	};

	let tagsSelected = filterOpts.tags;

	function onDelete(board: BoardList) {
		Swal.fire({
			title: 'คุณแน่ใจหรือไม่?',
			text: 'คุณจะไม่สามารถกู้คืนข้อมูลได้!',
			icon: 'warning',
			background: '#1a202c',
			color: '#fff',
			showCancelButton: true,
			confirmButtonText: 'ใช่, ลบเลย!',
			cancelButtonText: 'ยกเลิก'
		}).then((result) => {
			if (result.isConfirmed) {
				deleteBoard(board)
					.then(() => {
						Toast.fire({
							title: 'ลบบอร์ดสำเร็จ',
							icon: 'success'
						});
					})
					.catch((err: FirebaseError) => {
						handler(err, 'ไม่สามารถลบข้อมูลได้');
					});
			}
		});
	}

	$: filteredBoard = boardList
		.filter((board) => tagsSelected.some((tag) => board.tags.includes(tag)))
		.sort((a, b) => {
			const dateA = a.created.toDate().getTime();
			const dateB = b.created.toDate().getTime();
			return filterOpts.dateSorted ? dateA - dateB : dateB - dateA;
		});
</script>

<div class="mockup-window border bg-base-300">
	<div class="relative">
		<button
			on:click={() => drawerStore.open(drawerSettings)}
			class="absolute right-6 -top-10 btn btn-sm float-right btn-outline">ฟิวเตอร์</button
		>
	</div>
	<AppShell>
		<div class="max-h-[30rem] overflow-auto py-6 bg-base-200">
			<div class="h-auto flex flex-col">
				<!-- content here -->
				{#each filteredBoard as board, i (i)}
					<!-- content here -->
					<div class="min-h-[5rem] text-xs md:text-sm lg:text-base flex">
						<div class="bg-base-100 w-24 grid items-center border-y border-base-content/20">
							<div
								style="vertical-align: middle;"
								class="break-words px-3 text-center text-base-content/80 rounded-full"
							>
								{board.created.toDate().toDateString()}
							</div>
						</div>
						<div
							class="col-span-9 flex flex-grow justify-between bg-base-100 items-center p-4 border-y border-l border-base-content/20"
						>
							<div class="flex gap-4">
								<div class="flex justify-center items-center">
									<div class="avatar placeholder">
										<div class="bg-secondary text-secondary-content rounded-full w-12">
											<span>A</span>
										</div>
									</div>
								</div>
								<div class="flex gap-1 flex-col">
									<h1 class="text-base-content">
										{board.title}
									</h1>
									<p class="text-base-content/50">จาก: Admin</p>
									<div class="flex flex-wrap gap-2">
										{#each board.tags as tag}
											<span class="badge badge-sm lg:badge-md badge-outline">
												{tag}
											</span>
										{/each}
									</div>
								</div>
							</div>
							{#if onEditMode}
								<div class="flex flex-col gap-2">
									<label
										for={`hook_board_editor_model_${i}`}
										class="btn btn-block float-right me-2 btn-sm btn-warning"
									>
										แก้ไข
									</label>

									<input type="checkbox" id={`hook_board_editor_model_${i}`} class="modal-toggle" />
									<div class="modal" role="dialog">
										<div class="modal-box">
											<BoardEditor boardEditor={board} />
										</div>
										<label class="modal-backdrop" for={`hook_board_editor_model_${i}`}>Close</label>
									</div>
									<button
										type="button"
										on:click={() => onDelete(board)}
										class="btn-sm btn btn-error">ลบ</button
									>
								</div>
							{/if}
						</div>
					</div>
					<div class="border bg-base-100/50 border-base-content/20">
						<article class="py-6 text-lg gird p-center items-center">
							<DeltaToHTML deltaContext={board.description} />
						</article>
					</div>
				{:else}
					<div class="grid h-[28rem] space-y-4 text-center px-4 place-content-center">
						<div class="text-6xl text-gray-500">
							<iconify-icon icon="line-md:coffee-half-empty-twotone-loop" />
						</div>
						<h1 class="tracking-widest text-2xl text-gray-500 uppercase">
							ไม่มีหรือไม่เจอข้อมูลที่กล่าวถึง
						</h1>
						<p class="text-gray-500">อย่าลืมติดตามข่าวสารของทางโครงการเรื่อย ๆ น๊าา</p>
					</div>
				{/each}
			</div>
		</div>
		<svelte:fragment slot="sidebarRight">
			<Drawer position={'right'}>
				<article class="prose my-2 w-full m-8">
					<h3>ตัวเลือกฟิวเตอร์</h3>
					<div class="divider" />
					<div class="">
						<h3>วันที่สร้าง</h3>
						<div class="divider" />

						<div class="flex flex-col">
							<!-- <label class="label cursor-pointer">
								<span class="label-text">เรียงจากเก่าสุดไปใหม่สุด</span>
								<input
									bind:group={filterOpts.dateSorted}
									type="radio"
									name="oldest"
									class="radio"
									value={false}
								/>
							</label> -->
							<label class="label cursor-pointer">
								<span class="label-text">เรียงจากล่าสุดไปเก่าสุด</span>
								<input
									bind:group={filterOpts.dateSorted}
									type="radio"
									name="newest"
									class="radio"
									value={true}
								/>
							</label>
						</div>
					</div>
					<div class="">
						<h3>Tags</h3>
						<div class="divider" />

						<div class="form-control">
							{#each filterOpts.tags as tag}
								<label for={tag} class="label cursor-pointer">
									<span class="label-text">{tag}</span>
									<input
										value={tag}
										bind:group={tagsSelected}
										class="checkbox checkbox-xs"
										type="checkbox"
									/>
								</label>
							{/each}
						</div>
					</div>
				</article>
			</Drawer>
		</svelte:fragment>
	</AppShell>
</div>

<style class="postcss">
</style>
