<script lang="ts">
	import Error550 from '$lib/components/errors/Error550.svelte';
	import { onMount } from 'svelte';
	import BoardTemplate from './../../../lib/components/assets/BoardTemplate.svelte';
	import { boardStore, getBoardList } from '$lib/firebase/actions/boardAction';
	import DashboardLoadingSlot from '$lib/components/assets/DashboardLoadingSlot.svelte';

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
	<section id="board-lists">
		<article class="prose prose-sm">
			<h2 class="text-base md:text-2xl">บอร์ดประชาสัมพันธ์</h2>
		</article>
		<div class="flex w-full justify-between">
			<div class="flex w-full justify-between">
				<div class="space-y-2">
					<p>ตรวจสอบข่าวสารที่ถูกส่งมาได้ที่นี้</p>
				</div>
			</div>
		</div>
		<div class="divider" />
		<BoardTemplate boardList={$boardStore} />
	</section>
{:catch errors}
	<Error550 {errors} />
{/await}
