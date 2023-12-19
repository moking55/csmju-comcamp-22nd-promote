<script lang="ts" context="module">
	import BoardTemplate from './../assets/BoardTemplate.svelte';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	export const userWidgetDrawerSettings: DrawerSettings = {
		id: 'user-widget-drawer-modal',
		bgBackdrop: 'bg-base-100/50',
		width: 'w-full sm:w-3/4 md:w-3/6 lg:w-2/6',
		bgDrawer: 'z-[9999] bg-base-200/50 backdrop-blur-md',
		position: 'right'
	};
</script>

<script lang="ts">
	import Error550 from '$lib/components/errors/Error550.svelte';
	import {
		userData,
		type User,
		type CloudinaryAssets,
		type UserInfo
	} from '$lib/firebase/actions/userAction';
	import { getBoardList, type BoardList, boardStore } from '$lib/firebase/actions/boardAction';

	let userDetail: { key: string; icon: string; value: unknown }[] = [];
	let userPromise: Promise<typeof userDetail>;
	let evidence: { name: string; src: CloudinaryAssets | null }[] = [];
	let boardPromise: Promise<BoardList[]>;

	const opts = [
		{
			label: 'ข้อมูลโดยสรุป',
			value: 'user-data'
		},
		{
			label: 'สถานะส่งเอกสาร',
			value: 'evidence'
		},
		{
			label: 'เข้าสารประชาสัมพันธ์',
			value: 'board-news'
		}
	];
	let valueSelected = opts[0].value;

	userPromise = new Promise((res, rej) => {
		if ($userData) {
			evidence = [
				{
					name: 'หลักฐานการชำระเงิน',
					src: $userData.assets.paymentReceiptSrc ? $userData.assets.paymentReceiptSrc : null
				},
				{
					name: 'หลักฐานการอนุญาตจากผู้ปกครอง',
					src: $userData.assets.parentPermissionSrc ? $userData.assets.parentPermissionSrc : null
				}
			];

			let userInfo: UserInfo = $userData.info;
			const keyArray = [
				'name',
				'nickname',
				'school',
				'eduLevel',
				'phone',
				'contacts.contractEmail',
				'shirtSize'
			];

			const object = {
				name: 'ชื่อ',
				school: 'โรงเรียน',
				age: 'อายุ',
				nickname: 'ชื่อเล่น',
				birthDate: 'วันเกิด',
				phone: 'เบอร์โทรศัพท์',
				shirtSize: 'ขนาดเสื้อ',
				eduLevel: 'ระดับชั้น',
				congenitalDisease: 'โรคประจำตัว',
				foodAllergy: 'อาหารที่แพ้',
				drugAllergy: 'ยาที่แพ้',
				'contacts.contractEmail': 'อีเมล์ติดต่อ',
				'contacts.lineId': 'ไลน์ไอดี',
				'contacts.facebookLink': 'ลิงค์เฟสบุ๊ค',
				'contacts.parentContact': 'เบอร์โทรผู้ปกครอง',
				'contacts.otherContact': 'ทางติดต่ออื่น ๆ'
			};

			const iconArray = [
				'line-md:account',
				'line-md:emoji-grin',
				'mdi:school',
				'carbon:education',
				'mdi:phone',
				'line-md:email-twotone',
				'tabler:shirt',
				'line-md:account',
				'material-symbols:date-range',
				'material-symbols:rotate-90-degrees-cw',
				'material-symbols:no-food-outline',
				'mdi:drug',
				'medical-icon:i-infectious-diseases',
				'fluent-emoji-high-contrast:id-button',
				'line-md:facebook',
				'ri:parent-line'
			];

			userDetail = keyArray.map((key, i) => {
				return {
					key: object[key as keyof typeof object],
					icon: iconArray[i],
					value:
						key === 'birthDate'
							? userInfo.birthDate.toDate().toLocaleDateString()
							: key.startsWith('contacts.')
							? userInfo.contacts[key.split('.')[1] as keyof typeof userInfo.contacts]
							: userInfo[key as keyof UserInfo]
				};
			});
			res(userDetail);
		} else {
			rej(new Error('User data not available'));
		}
	});

	boardPromise = new Promise(async (resolve, reject) => {
		try {
			const boardList = await getBoardList();
			boardStore.set(boardList);
			resolve(boardList);
		} catch (err) {
			reject(err);
		}
	});
</script>

{#await userPromise}
	<span class="loading loading-ring loading-lg" />
{:then users}
	<!-- content here -->
	<div class="w-full h-screen -translate-x-1/2 left-1/2 absolute px-6">
		<div class="mt-16 py-4 pl-4 z-[9999] overflow-auto w-full">
			<div class="form-control -space-y-1 gap-1 gap-x-2">
				<div class="flex gap-2 items-center justify-between">
					<div class="space-y-2">
						<h1 class="text-lg">{opts.find((opt) => opt.value === valueSelected)?.label ?? ''}</h1>
						<a href="/dashboard" role="button" class="btn btn-accent btn-sm">
							เข้าสู่หน้าแดชบอร์ด</a
						>
					</div>
					<label class="form-control">
						<div class="label">
							<span />
							<span class="label-text">ตัวเลือก</span>
						</div>
						<select bind:value={valueSelected} class="select select-bordered">
							{#each opts as item}
								<option value={item.value}>{item.label}</option>
							{/each}
						</select>
					</label>
				</div>
				<div class="divider" />

				{#if valueSelected === 'user-data'}
					<ul role="list" class="divide-y divide-gray-100">
						{#each users as user, i}
							<li class="flex justify-between gap-x-6 py-3">
								<div class="flex min-w-0 gap-x-4">
									<div class="h-12 w-12 text-3xl grid place-items-center rounded-full">
										<iconify-icon icon={user.icon} />
									</div>
									<div class="min-w-0 flex-auto">
										<p class="text-sm font-semibold leading-6">{user.value}</p>
										<p class="mt-1 truncate text-xs leading-5">{user.key}</p>
									</div>
								</div>
								<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
									<!-- <p class="text-sm leading-6">Co-Founder / CEO</p>
                                    <p class="mt-1 text-xs leading-5">
                                        Last seen <time datetime="2023-01-23T13:23Z">3h ago</time>
                                    </p> -->
								</div>
							</li>
						{/each}
					</ul>
				{:else if valueSelected === 'evidence'}
					<div class="form-control gap-4">
						<h1 class="text-lg">สถานะส่งเอกสาร</h1>
						<ul class="flex flex-col gap-4 p-2">
							{#each evidence as item}
								{#if item.src}
									<li class="badge badge-success">ส่ง {item.name} เรียบร้อยแล้ว</li>
								{:else}
									<li class="badge badge-error">ยังไม่ได้ส่ง {item.name}</li>
								{/if}
							{/each}
						</ul>
					</div>
				{:else if valueSelected === 'board-news'}
					{#await boardPromise}
						<span class="loading loading-ring loading-lg" />
					{:then boardList}
						<div class="grid place-items-center">
							<div class="z-50">
								<BoardTemplate showFilter={false} {boardList} />
							</div>
						</div>
						<!-- promise was fulfilled -->
					{:catch errors}
						<Error550 {errors} />
						<!-- promise was rejected -->
					{/await}
				{/if}
			</div>
		</div>
	</div>
{:catch errors}
	<Error550 {errors} />
{/await}
