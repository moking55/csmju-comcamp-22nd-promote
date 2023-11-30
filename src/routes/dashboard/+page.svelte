<script lang="ts">
	import { goto } from '$app/navigation';
	import { userData, type UserInfo } from '$lib/firebase/actions/userAction';
	import { onMount } from 'svelte';

	let userDetail: { key: string; icon: string; value: unknown }[] = [];

	function onEditUserData() {
		localStorage.setItem('edit', 'true');
		goto('/authentication/info-register');
	}

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
				'shirtSize',
				'contacts.contractEmail',
				'contacts.lineId',
				'contacts.facebookLink',
				'contacts.parentContact',
				'contacts.otherContact'
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
				'line-md:account',
				'material-symbols:date-range',
				'mdi:phone',
				'mdi:school',
				'material-symbols:rotate-90-degrees-cw',
				'material-symbols:no-food-outline',
				'mdi:drug',
				'medical-icon:i-infectious-diseases',
				'tabler:shirt',
				'line-md:email-twotone',
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
		}
	});
</script>

<section id="user-detail" class="space-y-4">
	<div class="flex justify-between">
		<h2 class="text-base md:text-2xl">ข้อมูลส่วนตัว</h2>
		<button on:click={onEditUserData} class="btn btn-outline btn-sm"> แก้ไขข้อมูล </button>
	</div>
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
