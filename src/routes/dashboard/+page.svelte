<script lang="ts">
	import { userData, type UserInfo } from '$lib/firebase/actions/userAction';
	import type { Timestamp } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let userDetail: { key: string; icon: string; value: string | number | boolean | Timestamp }[] =
		[];

	onMount(() => {
		if ($userData) {
			const userInfo: UserInfo = $userData.info;

			const keyArray = [
				'name',
				'nickname',
				'age',
				'birthDate',
				'phone',
				'school',
				'eduLevel',
				'congenitalDisease',
				'foodAllergy',
				'drugAllergy',
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
				drugAllergy: 'ยาที่แพ้'
			};

			const iconArray = [
				'line-md:account',
				'line-md:emoji-grin',
				'line-md:account',
				'material-symbols:date-range',
				'mdi:phone',
				'mdi:school',
				'material-symbols:rotate-90-degrees-cw',
				'material-symbols:no-food-outline',
				'mdi:drug',
				'medical-icon:i-infectious-diseases',
				'tabler:shirt'
			];

			userDetail = keyArray.map((key, i) => {
				return {
					key: object[key as keyof object],
					icon: iconArray[i],
					value:
						key === 'birthDate'
							? userInfo.birthDate.toDate().toLocaleDateString()
							: userInfo[key as keyof UserInfo]
				};
			});
		}
	});
</script>

<section id="user-detail" class="space-y-4">
	<h2 class="text-base md:text-2xl">ข้อมูลส่วนตัว</h2>
	<div class="divider" />
	{#if userDetail.length > 0}
		<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
			{#each userDetail as data}
				<div class="stats shadow">
					<div class="stat">
						<div class="">
							<div class="stat-title float-left">{data.key}</div>
							<div class="stat-title float-right"><iconify-icon icon={data.icon} /></div>
						</div>
						<div class="stat-value text-base">{data.value ? data.value : 'ไม่มี'}</div>
						<div class="stat-desc"><hr class="my-2 border-white/40" /></div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="grid h-screen px-4 place-content-center">
			<h1 class="tracking-widest text-xl text-gray-500 uppercase">
				ไม่พบข้อมูลผู้ลงทะเบียน, โปรดมั่นใจว่าอีเมล์ตรงกับที่สมัคร
			</h1>
		</div>
	{/if}
</section>
