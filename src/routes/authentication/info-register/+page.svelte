<script lang="ts">
	import Error550 from '$lib/components/errors/Error550.svelte';
	import 'iconify-icon';
	import type { UserInfo } from '$lib/firebase/actions/userAction';
	import { z } from 'zod';
	import {
		checkAndSetUserData,
		createUserData,
		updateUserData
	} from '$lib/firebase/actions/userAction';
	import { Toast } from '$lib/middleware/alertConfig';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { Timestamp } from 'firebase/firestore';
	import { auth as authStore } from '$lib/firebase/actions/authAction';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { initFirebase } from '$lib/firebase/config';
	import Swal from 'sweetalert2';

	// write regex to filter only digits

	const digitOnlyReg = /^\d+$/;
	let loadingWhileSubmit = false;
	let promise: Promise<unknown>;
	let onWriteReasonForJoining = false;
	let onEdit = false;

	const userInfoSchema = z.object({
		contractEmail: z.string().email(),
		prefix: z.string().min(1, 'กรุณากรอกคำนำหน้า'),
		name: z.string().min(1, 'กรุณากรอก'),
		nickname: z.string().min(1, 'กรุณากรอก'),
		age: z.number().min(1, 'กรุณากรอก'),
		birthDate: z.string().min(1, 'กรุณากรอก'),
		phone: z
			.string()
			.regex(digitOnlyReg, 'ต้องเป็นตัวเลขเท่านั้น')
			.min(10, 'กรอก 10 ตัวเลข')
			.max(10, 'กรอก 10 ตัวเลข'),
		school: z.string().min(1, 'กรุณากรอก'),
		eduLevel: z.string().min(1, 'กรุณากรอก'),
		shirtSize: z.string().min(1, 'กรุณากรอก'),
		congenitalDisease: z.string().min(1, 'กรุณากรอก'),
		drugAllergy: z.string().optional(),
		foodAllergy: z.string().optional(),
		reasonForJoining: z.string().optional(),
		haveLaptop: z.boolean().optional(),
		lineId: z.string(),
		facebookLink: z.string().url('กรุณากรอกลิ้ง URL ให้ถูกต้อง'),
		parentContact: z.string(),
		otherContact: z.string().optional()
	});

	const info = {
		educationLevel: ['มัธยมศึกษาปีที่ 4', 'มัธยมศึกษาปีที่ 5', 'มัธยมศึกษาปีที่ 6', 'ปวช.'],
		shirtSizes: [
			{
				label: 'XS (รอบอบ = 34 นิ้ว ความยาว = 25 นิ้ว)',
				value: 'XS'
			},
			{
				label: 'S (รอบอบ = 36 นิ้ว ความยาว = 26 นิ้ว)',
				value: 'S'
			},
			{
				label: 'M (รอบอบ = 38 นิ้ว ความยาว = 27 นิ้ว)',
				value: 'M'
			},
			{
				label: 'L (รอบอบ = 40 นิ้ว ความยาว = 28 นิ้ว)',
				value: 'L'
			},
			{
				label: 'XL (รอบอบ = 42 นิ้ว ความยาว = 29 นิ้ว)',
				value: 'XL'
			},
			{
				label: '2XL (รอบอบ = 44 นิ้ว ความยาว = 30 นิ้ว)',
				value: '2XL'
			},
			{
				label: '3XL (รอบอบ = 46  นิ้ว ความยาว = 32 นิ้ว)',
				value: '3XL'
			},
			{
				label: '4XL (รอบอบ = 48 นิ้ว ความยาว = 33 นิ้ว)',
				value: '4XL'
			},
			{
				label: '5XL (รอบอบ = 50 นิ้ว ความยาว = 34 นิ้ว)',
				value: '5XL'
			}
		]
	};

	const { form, errors, enhance, constraints } = superForm(superValidateSync(userInfoSchema), {
		SPA: true,
		validators: userInfoSchema,
		onSubmit({ formData }) {
			// extract properties from formData type of UserData with Object.fromEntries
			Swal.fire({
				title: 'ต้องการบันทึกข้อมูลหรือไม่',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				background: '#303b51',
				color: '#fff',
				confirmButtonText: 'บันทึกข้อมูล'
			}).then((result) => {
				if (result.isConfirmed) {
					loadingWhileSubmit = true;
					const {
						contractEmail,
						name,
						nickname,
						prefix,
						age,
						birthDate,
						phone,
						school,
						congenitalDisease,
						drugAllergy,
						eduLevel,
						foodAllergy,
						shirtSize,
						reasonForJoining,
						haveLaptop,
						lineId,
						facebookLink,
						parentContact,
						otherContact
					} = Object.fromEntries(formData) as unknown as {
						contractEmail: string;
						prefix: string;
						name: string;
						nickname: string;
						birthDate: string;
						phone: string;
						school: string;
						age: string;
						eduLevel: string;
						congenitalDisease: string;
						drugAllergy: string;
						foodAllergy: string;
						shirtSize: string;
						reasonForJoining: string;
						haveLaptop: 'on' | 'off';
						lineId: string;
						facebookLink: string;
						parentContact: string;
						otherContact: string | undefined;
					};

					const userData: UserInfo = {
						contacts: {
							contractEmail,
							parentContact,
							lineId,
							otherContact,
							facebookLink
						},
						prefix,
						name,
						nickname,
						birthDate: Timestamp.fromMillis(new Date(birthDate).getTime()),
						phone,
						school,
						age: +age,
						eduLevel,
						shirtSize,
						congenitalDisease,
						drugAllergy,
						foodAllergy,
						reasonForJoining: reasonForJoining,
						haveLaptop: haveLaptop === 'on'
					};

					if ($authStore) {
						if (!onEdit) {
							createUserData($authStore.uid, $authStore.email!, userData).then(() => {
								checkAndSetUserData($authStore!.uid).then((userData) => {
									if (!userData) {
										loadingWhileSubmit = false;
										return Toast.fire({
											icon: 'error',
											title: 'มีบางอย่างผิดผลาดขณะบันทึกข้อมูล, โปรดลองใหม่'
										});
									}
									loadingWhileSubmit = false;
									Toast.fire({
										icon: 'success',
										title: 'บันทึกข้อมูลสำเร็จ'
									}).then(() => {
										window.addEventListener('beforeunload', (event) => {
											event.preventDefault();
											event.returnValue = ''; // This is required for Chrome
										});
										goto('/dashboard');
									});
								});
							});
						} else {
							updateUserData($authStore.uid, userData).then(() => {
								checkAndSetUserData($authStore!.uid).then((userData) => {
									if (!userData) {
										loadingWhileSubmit = false;
										return Toast.fire({
											icon: 'error',
											title: 'มีบางอย่างผิดผลาดขณะบันทึกข้อมูล, โปรดลองใหม่'
										});
									}
									loadingWhileSubmit = false;
									Toast.fire({
										icon: 'success',
										title: 'บันทึกข้อมูลสำเร็จ'
									}).then(() => {
										window.addEventListener('beforeunload', (event) => {
											event.preventDefault();
											event.returnValue = ''; // This is required for Chrome
										});
										goto('/dashboard');
									});
								});
							});
						}
					}
				}
			});
		}
	});
	function setFormData(userInfo: UserInfo) {
		try {
			onEdit = true;
			onWriteReasonForJoining = true;

			const {
				contacts: { contractEmail, parentContact, lineId, otherContact, facebookLink },
				prefix,
				name,
				nickname,
				birthDate,
				phone,
				school,
				age,
				eduLevel,
				shirtSize,
				congenitalDisease,
				drugAllergy,
				foodAllergy,
				reasonForJoining,
				haveLaptop
			} = userInfo;

			form.set({
				contractEmail,
				parentContact,
				lineId,
				otherContact,
				facebookLink,
				prefix,
				name,
				nickname,
				birthDate: new Date(birthDate.toMillis()).toISOString().split('T')[0],
				phone,
				school,
				age: age,
				eduLevel,
				shirtSize,
				congenitalDisease,
				drugAllergy,
				foodAllergy,
				reasonForJoining,
				haveLaptop: haveLaptop
			});
		} catch (error) {
			Toast.fire({
				icon: 'error',
				title: 'มีบางอย่างผิดผลาดขณะบันทึกข้อมูล, โปรดตรวจสอบข้มูลแล้วลองใหม่อีกครั้ง'
			});
			onWriteReasonForJoining = false;
		}
	}

	onMount(() => {
		const { auth } = initFirebase();
		promise = new Promise((resolve, reject) => {
			try {
				onAuthStateChanged(auth, async (data) => {
					authStore.set(data);
					if (!data) resolve(goto('/authentication'));

					const userData = await checkAndSetUserData(data!.uid);
					const edit = localStorage.getItem('edit');
					if (edit && edit === 'true') {
						setFormData(userData!.info);
						resolve(localStorage.removeItem('edit'));
						return;
					}
					if (userData) resolve(goto('/dashboard'));
					resolve(data);
				});
			} catch (err) {
				reject(err);
			}
		});
	});

	// your script goes here
</script>

{#await promise}
	<div
		class="bg-gradient-to-r h-screen w-full grid place-content-center from-secondary-content to-primary-content"
	>
		<div class="loading loading-lg loading-dots" />
	</div>{:then}
	<div class="bg-gradient-to-r h-full w-full from-secondary-content to-primary-content">
		<div class="flex">
			<div class="mx-auto my-6">
				<form method="POST" use:enhance>
					<div class="mt-5 bg-white rounded-lg shadow">
						<div class="text-base-100 text-center pt-4">
							<div class="badge tracking-wider">เขียนเป็นภาษาไทยทั้งหมด</div>
						</div>
						<div class="flex">
							<div class="flex-1 py-5 pl-5 overflow-hidden">
								<h1 class="inline text-2xl text-base-100 font-semibold leading-none">
									<iconify-icon icon="line-md:account" /> Personal Data
								</h1>
							</div>
						</div>
						<div class="px-5 pb-5">
							<div class="flex">
								<div class="flex-grow w-1/12 pr-2">
									<select
										aria-invalid={$errors.prefix ? 'true' : undefined}
										name="prefix"
										id="prefix"
										required={true}
										{...$constraints.prefix}
										bind:value={$form.prefix}
										placeholder="คำนำหน้า"
										class="select text-base-200 placeholder-black select-bordered w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
									>
										<option class="text-base-200" selected disabled>เลือก</option>
										<option class="text-base-200" value="นาย">นาย</option>
										<option class="text-base-200" value="นาง">นางสาว</option>
									</select>
									<p class="text-sm text-error">{$errors.prefix ?? ''}</p>
								</div>
								<div class="flex-grow">
									<input
										aria-invalid={$errors.name ? 'true' : undefined}
										bind:value={$form.name}
										{...$constraints.name}
										type="text"
										name="name"
										id="name"
										placeholder="ชื่อ นามสกุล"
										class=" text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
									/>
									<p class="text-sm text-error">{$errors.name ?? ''}</p>
								</div>
							</div>

							<div class="flex">
								<div class="flex-grow w-1/5 pr-2">
									<input
										aria-invalid={$errors.nickname ? 'true' : undefined}
										bind:value={$form.nickname}
										{...$constraints.nickname}
										name="nickname"
										id="nickname"
										type="text"
										placeholder="ชื่อเล่น"
										class=" text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
									/>
									<p class="text-sm text-error">{$errors.nickname ?? ''}</p>
								</div>

								<div class="flex-grow">
									<input
										aria-invalid={$errors.birthDate ? 'true' : undefined}
										bind:value={$form.birthDate}
										{...$constraints.birthDate}
										name="birthDate"
										id="birthDate"
										type="text"
										onfocus="(this.type='date')"
										onblur="(this.type='text')"
										placeholder="วันเดือนปีเกิด"
										class=" text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
									/>
									<p class="text-sm text-error">{$errors.birthDate ?? ''}</p>
								</div>
							</div>
							<div class="flex gap-2">
								<div class="flex-grow w-1/4">
									<input
										aria-invalid={$errors.age ? 'true' : undefined}
										name="age"
										id="age"
										required={true}
										type="number"
										value={$form.age === 0 ? 'อายุ' : $form.age}
										placeholder="อายุ"
										class="  text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
									/>
								</div>
								<div class="flex-grow">
									<input
										aria-invalid={$errors.phone ? 'true' : undefined}
										bind:value={$form.phone}
										{...$constraints.phone}
										name="phone"
										id="phone"
										type="tel"
										placeholder="เบอร์โทรศัพท์"
										class=" text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
									/>
									<p class="text-sm text-error">{$errors.phone ?? ''}</p>
								</div>
							</div>
							<input
								aria-invalid={$errors.contractEmail ? 'true' : undefined}
								bind:value={$form.contractEmail}
								{...$constraints.contractEmail}
								type="text"
								name="contractEmail"
								id="contractEmail"
								placeholder="อีเมล์ที่ใช้ในการติดต่อ"
								class=" text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
							/>
							<p class="text-sm text-error">{$errors.contractEmail ?? ''}</p>
						</div>
						<div class="flex">
							<div class="flex-1 py-5 pl-5 overflow-hidden">
								<h1 class="inline text-2xl text-black font-semibold leading-none">
									<iconify-icon icon="ph:phone" /> Contact Channels
								</h1>
							</div>
							<div class="flex-none pt-2.5 pr-2.5 pl-1" />
						</div>
						<div class="px-5 pb-5">
							<input
								aria-invalid={$errors.lineId ? 'true' : undefined}
								bind:value={$form.lineId}
								{...$constraints.lineId}
								name="lineId"
								id="lineId"
								placeholder="Line ID"
								class="  text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
							/>
							<p class="text-sm text-error">{$errors.lineId ?? ''}</p>
							<input
								aria-invalid={$errors.facebookLink ? 'true' : undefined}
								bind:value={$form.facebookLink}
								{...$constraints.facebookLink}
								name="facebookLink"
								id="facebookLink"
								placeholder="Facebook Link"
								class="  text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
							/>
							<p class="text-sm text-error">{$errors.facebookLink ?? ''}</p>
							<input
								aria-invalid={$errors.parentContact ? 'true' : undefined}
								bind:value={$form.parentContact}
								{...$constraints.parentContact}
								name="parentContact"
								id="parentContact"
								placeholder="เบอร์ติดต่อผู้ปกครอง"
								class="  text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
							/>
							<p class="text-sm text-error">{$errors.parentContact ?? ''}</p>
							<input
								aria-invalid={$errors.otherContact ? 'true' : undefined}
								bind:value={$form.otherContact}
								{...$constraints.otherContact}
								name="otherContact"
								id="otherContact"
								placeholder="ช่องทางติดต่ออื่น ๆ (ถ้ามีให้เขียนในลักษณะแบบ ช่องทางติดต่อ: ข้อมูลติดต่อ)"
								class="  text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
							/>
							<p class="text-sm text-error">{$errors.otherContact ?? ''}</p>
						</div>

						<div class="flex">
							<div class="flex-1 py-5 pl-5 overflow-hidden">
								<h1 class="inline text-2xl text-black font-semibold leading-none">
									<iconify-icon icon="material-symbols:school-outline" /> Education
								</h1>
							</div>
							<div class="flex-none pt-2.5 pr-2.5 pl-1" />
						</div>

						<div class="px-5 pb-5">
							<input
								aria-invalid={$errors.school ? 'true' : undefined}
								bind:value={$form.school}
								{...$constraints.school}
								name="school"
								id="school"
								placeholder="ชื่อโรงเรียน"
								class="  text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
							/>
							<p class="text-sm text-error">{$errors.school ?? ''}</p>
							<select
								aria-invalid={$errors.eduLevel ? 'true' : undefined}
								required
								name="eduLevel"
								id="eduLevel"
								value={$form.eduLevel === '' ? 'ระดับการศึกษา' : $form.eduLevel}
								placeholder="ระดับการศึกษา"
								class="select text-base-200 placeholder-gray-600 select-bordered w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
							>
								<option disabled selected class="text-base-200">ระดับการศึกษา</option>
								{#each info.educationLevel as level}
									<option class="text-base-200" value={level}>{level}</option>
								{/each}
							</select>
							<!-- {#if !info.educationLevel.includes($form.eduLevel)}
								<input
									class="text-base-200 placeholder-gray-600 select-bordered w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
									type="text"
									placeholder="กรอก"
									bind:value={$form.eduLevel}
									{...$constraints.eduLevel}
									aria-invalid={$errors.eduLevel ? 'true' : undefined}
								/>
							{/if} -->
						</div>
						<div class="flex">
							<div class="flex-1 py-5 pl-5 overflow-hidden">
								<h1 class="inline text-2xl text-black font-semibold leading-none">
									<iconify-icon icon="fa6-solid:disease" /> Diseases
								</h1>
								<p class="text-sm text-base-100/50">ถ้าช่องไหนไม่มีไม่ต้องเขียน*</p>
							</div>
							<div class="flex-none pt-2.5 pr-2.5 pl-1" />
						</div>

						<div class="px-5 pb-5">
							<input
								aria-invalid={$errors.congenitalDisease ? 'true' : undefined}
								bind:value={$form.congenitalDisease}
								{...$constraints.congenitalDisease}
								name="congenitalDisease"
								id="congenitalDisease"
								placeholder="โรคประจำตัว"
								class="  text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
							/>
							<input
								aria-invalid={$errors.drugAllergy ? 'true' : undefined}
								bind:value={$form.drugAllergy}
								{...$constraints.drugAllergy}
								name="drugAllergy"
								id="drugAllergy"
								placeholder="แพ้ยา"
								class="  text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
							/>
							<input
								aria-invalid={$errors.foodAllergy ? 'true' : undefined}
								bind:value={$form.foodAllergy}
								{...$constraints.foodAllergy}
								name="foodAllergy"
								id="foodAllergy"
								placeholder="แพ้อาหารหรือรับประทานอาหารอะไรไม่ได้บ้าง"
								class="  text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
							/>
						</div>
						<div class="flex">
							<div class="flex-1 py-5 pl-5 overflow-hidden">
								<h1 class="inline text-2xl text-black font-semibold leading-none">
									<iconify-icon icon="mdi:account-file-text-outline" /> Survey
								</h1>
							</div>
							<div class="flex-none pt-2.5 pr-2.5 pl-1" />
						</div>
						<div class="px-5 pb-5">
							<ol class="list-decimal list-inside">
								<li class="text-base-100 space-x-6">
									<label for="haveLaptop" class="label-text cursor-pointer text-base-100">
										สามารถพกแล็บท็อปแบบพกพามาได้หรือไม่
									</label>
									<input
										bind:checked={$form.haveLaptop}
										{...$constraints.haveLaptop}
										name="haveLaptop"
										id="haveLaptop"
										type="checkbox"
									/>
								</li>
								<li class="text-base-100 space-x-6">
									<label for="shirtSize" class="label-text cursor-pointer text-base-100">
										ขนาดเสื้อค่าย
									</label>
									<span class="text-sm text-error">{$errors.shirtSize ?? ''}</span>
								</li>
								<select
									aria-invalid={$errors.shirtSize ? 'true' : undefined}
									bind:value={$form.shirtSize}
									{...$constraints.shirtSize}
									placeholder="ขนาดเสื้อค่าย"
									name="shirtSize"
									id="shirtSize"
									class="select text-base-200 placeholder-black select-bordered w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
								>
									<option disabled selected class="text-base-200">เลือก</option>
									{#each info.shirtSizes as size}
										<option class="text-base-200" value={size.value}>{size.label}</option>
									{/each}
								</select>

								<li class="text-base-100 space-x-6">
									<label for="reasonForJoining" class="label-text cursor-pointer text-base-100">
										เขียนเหตุผลในการเข้าร่วม (เขียนหรือไม่เขียนก็ได้)
									</label>
									<input bind:checked={onWriteReasonForJoining} type="checkbox" />
									<span class="text-sm text-error">{$errors.reasonForJoining ?? ''}</span>
								</li>
								<!-- content here -->
								<textarea
									class:hidden={!onWriteReasonForJoining}
									aria-invalid={$errors.reasonForJoining ? 'true' : undefined}
									bind:value={$form.reasonForJoining}
									{...$constraints.reasonForJoining}
									rows="4"
									class=" text-base-200 placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
									name="reasonForJoining"
									id="reasonForJoining"
								/>
							</ol>
						</div>
						<div class="flex">
							<div class="flex-1 py-5 pl-5 overflow-hidden">
								<h1 class="inline text-2xl text-black font-semibold leading-none">
									<iconify-icon icon="icon-park-solid:agreement" /> Agreement
								</h1>
								<p class="text-sm text-base-100">
									การที่คุณกดยอมรับเป็นการยืนยันว่าคุณได้ยอมรับข้อตกลง และยอมรับกฏจากทางโครงการ*
								</p>
							</div>
							<div class="flex-none pt-2.5 pr-2.5 pl-1" />
						</div>
						<div class="px-5 pb-5">
							<div class="flex">
								<div class="">
									<input required name="permission" id="permission" type="checkbox" class="mr-4" />
								</div>
								<div class="font-semibold">
									<span class="  label-text text-base-100">
										หากนักเรียนนำสิ่งของมีค่า อาทิเช่น โทรศัพท์มือถือ โน๊ตบุ๊ค แท๊บเล็ต
										มาใช้ในค่ายหากเกิดการสูญหายทาง ชมรม จะไม่รับผิดชอบใด ๆ ทั้งสิ้น
									</span>
									<p class="label-text text-base-100">
										ยกเว้นแต่ว่าจะยินยอมให้ทำการเก็บและจะคืนให้ในวันปิดกิจกรรม
									</p>
									<p class="  label-text text-base-100">
										ถ้านักเรียนมีความ
										จำเป็นที่ต้องการติดต่อกับผู้ปกครองทางค่ายจะมีพี่เลี้ยงจะประสานงานติดต่อให้เรียนมาเพื่อทราบ
									</p>
								</div>
							</div>
						</div>
						<hr class="mt-4" />
						<div class="flex flex-row-reverse p-3">
							<div class="flex-initial pl-3">
								<button
									type="submit"
									class="flex items-center px-5 py-2.5 font-medium tracking-wide text-white capitalize bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-900 transition duration-300 transform active:scale-95 ease-in-out"
								>
									{#if loadingWhileSubmit}
										<span class="loading text-base-content loading-spinner loading-sm" />
									{/if}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										height="24px"
										viewBox="0 0 24 24"
										width="24px"
										fill="#FFFFFF"
									>
										<path d="M0 0h24v24H0V0z" fill="none" />
										<path
											d="M5 5v14h14V7.83L16.17 5H5zm7 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-8H6V6h9v4z"
											opacity=".3"
										/>
										<path
											d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"
										/>
									</svg>
									<span class="pl-2 mx-1">Save</span>
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
{:catch errors}
	<Error550 {errors} />
{/await}

<style lang="postcss">
	input[type='date']::-webkit-calendar-picker-indicator {
		color: rgba(0, 0, 0, 0);
		opacity: 1;
		display: block;
		background: url(https://mywildalberta.ca/images/GFX-MWA-Parks-Reservations.png) no-repeat;
		width: 20px;
		height: 20px;
		border-width: thin;
	}
</style>
