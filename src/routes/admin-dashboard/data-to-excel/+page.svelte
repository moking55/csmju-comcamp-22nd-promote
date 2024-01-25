<script lang="ts">
	import Error550 from '$lib/components/errors/Error550.svelte';
	import { onMount } from 'svelte';
	import BoardTemplate from './../../../lib/components/assets/BoardTemplate.svelte';
	import { boardStore, getBoardList } from '$lib/firebase/actions/boardAction';
	import DashboardLoadingSlot from '$lib/components/assets/DashboardLoadingSlot.svelte';
	import BoardEditor from '$lib/components/assets/BoardEditor.svelte';

	const dataExportOpt = [
		{
			value: 'USER',
			label: 'ข้อมูลผู้ลงทะเบียน'
		}
	];
</script>

<section id="data-to-excel" class="">
	<article class="prose prose-sm">
		<h2 class="text-base md:text-2xl">ดาวโหลดข้อมูลเป็น Excel</h2>
	</article>
	<div class="flex w-full justify-between">
		<div class="flex w-full justify-between">
			<div class="space-y-2">
				<p>เลือกข้อมูลที่ต้องการ Export เป็น Excel</p>
			</div>
		</div>
	</div>
	<div class="divider" />
	<div class="grid grid-flow-row gap-4">
		<label class="form-control w-full">
			<div class="label">
				<span class="label-text">เลือกประเภทข้อมูล</span>
			</div>
			<select class="select select-bordered">
				<option disabled selected>โปรดเลือก</option>
				{#each dataExportOpt as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</label>
	</div>
</section>
