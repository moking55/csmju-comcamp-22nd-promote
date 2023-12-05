<script lang="ts">
	import Error550 from '$lib/components/errors/Error550.svelte';
	import { onMount } from 'svelte';
	import BoardTemplate from './../../../lib/components/assets/BoardTemplate.svelte';
	import { boardStore, getBoardList } from '$lib/firebase/actions/boardAction';
	import DashboardLoadingSlot from '$lib/components/assets/DashboardLoadingSlot.svelte';
	import BoardEditor from '$lib/components/assets/BoardEditor.svelte';
	let onEditMode = false;

	let promise: Promise<null>;

	onMount(() => {
		promise = new Promise(async (resolve, reject) => {
			try {
				const boardList = await getBoardList();
				boardStore.set(boardList);
				resolve(null);
			} catch (err) {
				reject(err);
			}
		});
	});
</script>

{#await promise}
	<DashboardLoadingSlot loadSample={'LOADING_SLOT'} />
{:then}
	<section id="board-lists" class="">
		<article class="prose prose-sm">
			<h2 class="text-base md:text-2xl">บอร์ดประชาสัมพันธ์</h2>
		</article>
		<div class="flex w-full justify-between">
			<div class="flex w-full justify-between">
				<div class="space-y-2">
					<p>ตรวจสอบข่าวสารที่ถูกส่งมาได้ที่นี้</p>
					<label for={`hook_board_editor_model`} class="btn btn-sm btn-primary"> เพิ่มบอร์ด </label>

					<input type="checkbox" id={`hook_board_editor_model`} class="modal-toggle" />
					<div class="modal" role="dialog">
						<div class="modal-box">
							<BoardEditor />
						</div>
						<label class="modal-backdrop" for={`hook_board_editor_model`}>Close</label>
					</div>
				</div>

				<div class="flex flex-col text-end gap-2">
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
		</div>
		<div class="divider" />
		<BoardTemplate boardList={$boardStore} {onEditMode} />
	</section>
{:catch errors}
	<Error550 {errors} />
{/await}
