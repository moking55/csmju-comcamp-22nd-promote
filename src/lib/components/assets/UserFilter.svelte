<script lang="ts">
	import type { User } from '$lib/firebase/actions/userAction';

	let opts = {
		filters: [
			{
				label: 'ขนาดเสื้อ',
				value: 'size'
			},
			{
				label: 'แล็ปท็อป',
				value: 'laptop'
			},
			{
				label: 'หลักฐาน',
				value: 'assets'
			}
		],
		size: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
		assets: [
			{
				label: 'ไม่กรอง',
				value: 'NO_FILTER'
			},
			{
				label: 'หลักฐานการชำระเงิน',
				value: 'PAYMENT'
			},

			{
				label: 'หลักฐานผู้ปกครอง',
				value: 'PARENT'
			},
			{
				label: 'หลักฐานทั้งหมด',
				value: 'ALL'
			},
			{
				label: 'ผ่านการยืนยัน',
				value: 'CONFIRMED'
			},

			{
				label: 'ไม่มีหลักฐาน',
				value: 'NONE'
			}
		],
		laptop: [
			{
				label: 'มี',
				value: 'HAVE'
			},
			{
				label: 'ไม่มี',
				value: 'NONE'
			},
			{
				label: 'ทั้งหมด',
				value: 'ALL'
			}
		]
	};

	let selected = '';

	let size: string[] = [];
	let laptop: 'HAVE' | 'NONE' | 'ALL';
	let assets: 'PAYMENT' | 'PARENT' | 'ALL' | 'NONE' | 'CONFIRMED' | 'NO_FILTER';

	export let userList: User[];
	let originalList = userList;

	function onFilterChanged() {
		userList = originalList;
		if (selected === 'size') {
			userList = userList.filter((user) => size.includes(user.info.shirtSize));
		} else if (selected === 'laptop') {
			userList = userList.filter((user) => {
				if (laptop === 'ALL') return true;
				return laptop === 'HAVE' ? user.info.haveLaptop : !user.info.haveLaptop;
			});
		} else if (selected === 'assets') {
			userList = userList.filter((user) => {
				if (assets === 'ALL')
					return user.assets.paymentReceiptSrc && user.assets.parentPermissionSrc;
				if (assets === 'NO_FILTER') return true;
				if (assets === 'NONE')
					return !user.assets.paymentReceiptSrc && !user.assets.parentPermissionSrc;
				if (assets === 'PAYMENT') return user.assets.paymentReceiptSrc;
				if (assets === 'PARENT') return user.assets.parentPermissionSrc;
				if (assets === 'CONFIRMED') return user.status;
			});
		}
	}
</script>

<div class="">
	<div class="flex justify-between">
		<div class="form-control w-full max-w-xs">
			<label class="label">
				<span class="label-text">เลือก Field ที่ต้องการกรอง</span>
			</label>
			<select name="filterSelected" bind:value={selected} class="select select-bordered">
				<option disabled selected>เลือก</option>
				{#each opts.filters as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>
		<div on:click={() => onFilterChanged()} class="btn btn-sm">กรอง</div>
	</div>
	<div class="divider" />
	{#if selected === 'size'}
		<div class="form-control">
			<select name="sizeSelected" multiple bind:value={size} class="select select-bordered">
				<option disabled selected>เลือก</option>
				{#each opts.size as size}
					<option value={size}>{size}</option>
				{/each}
			</select>
		</div>
	{:else if selected === 'laptop'}
		{#each opts.laptop as item}
			<!-- content here -->
			<div class="form-control">
				<label class="label cursor-pointer">
					<span class="label-text">{item.label}</span>
					<input
						type="radio"
						bind:group={laptop}
						class="radio checked:bg-red-500"
						value={item.value}
					/>
				</label>
			</div>
		{/each}
	{:else if selected === 'assets'}
		<div class="form-control">
			<select name="sizeSelected" bind:value={assets} class="select select-bordered">
				<option disabled>เลือก</option>
				{#each opts.assets as asset}
					<option value={asset.value}>{asset.label}</option>
				{/each}
			</select>
		</div>
	{/if}
</div>
