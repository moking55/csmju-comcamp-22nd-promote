<script lang="ts">
	import comcampLogo from '$lib/assets/comcamp-22nd-logo.png';
	import { superForm, setMessage, setError, superValidateSync } from 'sveltekit-superforms/client';
	import * as authAction from '$lib/firebase/actions/authAction';
	import z from 'zod';
	import { goto } from '$app/navigation';
	import { Toast } from '$lib/middleware/alertConfig';
	import { checkAndSetUserData } from '$lib/firebase/actions/userAction';
	import { FirebaseError } from 'firebase/app';
	import FirebaseErrorHandle from '$lib/firebase/errors/fbErrorHandle';
	import Swal from 'sweetalert2';

	export let action: 'SIGN_IN' | 'SIGN_UP' = 'SIGN_IN';
	export let disableRegistration: boolean;

	const authSchema = z.object({
		email: z.string().email('รูปแบบอีเมล์ที่กรอกไม่ถูกต้อง'),
		password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
	});

	let loadingWhileSubmit = false;

	async function sendResetPassword() {
		const { value: email } = await Swal.fire({
			title: 'กรอกอีเมล์',
			input: 'email',
			inputLabel: 'อีเมล์',
			inputPlaceholder: 'กรอกอีเมล์ที่ต้องการรีเซ็ตรหัสผ่าน',
			inputAttributes: {
				'aria-label': 'กรอกอีเมล์ที่ต้องการรีเซ็ตรหัสผ่าน'
			},
			validationMessage: 'รูปแบบอีเมล์ที่กรอกไม่ถูกต้อง',
			background: '#1a202c',
			color: '#fff',
			showCancelButton: true,
			confirmButtonText: 'ส่ง',
			showLoaderOnConfirm: true,
			preConfirm: async (email: string) => {
				return authAction.onSendPasswordResetEmail(email).catch((error) => {
					if (error instanceof FirebaseError) {
						return Toast.fire({
							icon: 'error',
							title: FirebaseErrorHandle(error)
						});
					}
					Toast.fire({
						icon: 'error',
						title: 'มีบางอย่างผิดผลาดขณะส่งอีเมล์รีเซ็ตรหัสผ่าน'
					});
				});
			},
			allowOutsideClick: () => !Swal.isLoading()
		});

		if (email) {
			return Toast.fire({
				icon: 'success',
				title: 'ส่งอีเมล์รีเซ็ตรหัสผ่านสำเร็จ'
			});
		}
	}

	const { form, errors, enhance, constraints } = superForm(superValidateSync(authSchema), {
		SPA: true,
		validators: authSchema,
		onSubmit({ formData, form }) {
			loadingWhileSubmit = true;
			const { email, password } = Object.fromEntries(formData) as {
				email: string;
				password: string;
			};

			if (action === 'SIGN_IN') {
				console.log('signIn', action, disableRegistration);
				authAction
					.signInUserWithEmail(email, password)
					.then((auth) => {
						return checkAndSetUserData(auth.uid);
					})
					.then((userData) => {
						if (!userData) {
							return goto('/authentication/info-register');
						}
						goto('/dashboard');
						loadingWhileSubmit = false;
					})
					.catch((error) => {
						if (error instanceof FirebaseError) {
							Toast.fire({
								icon: 'error',
								title: FirebaseErrorHandle(error)
							});
							loadingWhileSubmit = false;
						} else {
							Toast.fire({
								icon: 'error',
								title: 'มีบางอย่างผิดผลาดขณะล็อกอิน'
							});
							loadingWhileSubmit = false;
						}
					});
			} else if (action === 'SIGN_UP') {
				console.log('signUp', action, disableRegistration);
				authAction
					.signUpUserWithEmail(email, password)
					.then((auth) => {
						loadingWhileSubmit = false;
						return goto('/authentication/info-register');
					})
					.catch((error) => {
						if (error instanceof FirebaseError) {
							Toast.fire({
								icon: 'error',
								title: FirebaseErrorHandle(error)
							});
							loadingWhileSubmit = false;
						} else {
							Toast.fire({
								icon: 'error',
								title: 'มีบางอย่างผิดผลาดขณะล็อกอิน'
							});
							loadingWhileSubmit = false;
						}
					});
			}
		}
	});
</script>

<div class="w-full flex justify-center items-center h-screen">
	<div class="block w-10/12 rounded-lg">
		<div class="">
			<!-- Left column container-->
			<div class="px-4 md:px-0">
				<div class="md:mx-6 space-y-4 md:p-12">
					<!--Logo-->
					<div class="text-center">
						<img class="mx-auto w-52" src={comcampLogo} alt="logo" />
						<h4 class="mb-6 mt-1 pb-1 text-xl font-semibold">Comcamp CSMJU</h4>
						<div class="divider">
							<h2
								class:badge-success={action === 'SIGN_IN'}
								class:badge-info={action === 'SIGN_UP'}
								class="badge badge-lg p-4 shadow-white/50 shadow-lg"
							>
								{action === 'SIGN_IN' ? 'เข้าสู่ระบบ' : 'สมัครบัญชี'}
							</h2>
						</div>
					</div>

					<form method="POST" use:enhance>
						<p class="mb-4">กรอกข้อมูล</p>
						<!--Username input-->
						<div class="relative form-control items-center mb-4" data-te-input-wrapper-init>
							<input
								aria-invalid={$errors.email ? 'true' : undefined}
								bind:value={$form.email}
								{...$constraints.email}
								id="email"
								name="email"
								type="text"
								placeholder="Email"
								class="input input-bordered w-full"
							/>

							{#if $errors.email}<span class="text-error mt-2 text-sm">{$errors.email}</span>{/if}
						</div>

						<!--Password input-->
						<div class="relative form-control items-center mb-4" data-te-input-wrapper-init>
							<input
								aria-invalid={$errors.password ? 'true' : undefined}
								bind:value={$form.password}
								{...$constraints.password}
								id="password"
								name="password"
								type="password"
								placeholder="Password"
								class="input input-bordered w-full"
							/>
							{#if $errors.password}<span class="text-error mt-2 text-sm">{$errors.password}</span
								>{/if}
						</div>

						<!--Submit button-->
						<div class="mb-12 pb-1 pt-1 text-center">
							<button
								class="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)]"
								type="submit"
								data-te-ripple-init
								data-te-ripple-color="light"
								style="
                    background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);
                  "
							>
								{#if loadingWhileSubmit}
									<span class="loading text-base-content loading-spinner loading-sm" />
								{/if}
								{action === 'SIGN_IN' ? 'เข้าสู่ระบบ' : 'สมัครบัญชี'}
							</button>

							{#if action === 'SIGN_IN'}
								<button on:click={() => sendResetPassword()}>ลืมรหัสผ่าน?</button>
							{/if}
						</div>

						<!--Register button-->
						{#if !disableRegistration}
							<div class="flex items-center justify-between pb-6">
								<p class="mb-0 mr-2">{action === 'SIGN_IN' ? 'ยังไม่มีบัญชี' : 'มีบัญชีแล้ว'}</p>
								<button
									on:click={() => (action = action === 'SIGN_IN' ? 'SIGN_UP' : 'SIGN_IN')}
									type="button"
									class="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
									data-te-ripple-init
									data-te-ripple-color="light"
								>
									{action === 'SIGN_IN' ? 'สมัครเลย' : 'ลงชื่อเข้าใช้'}
								</button>
							</div>
						{/if}
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
