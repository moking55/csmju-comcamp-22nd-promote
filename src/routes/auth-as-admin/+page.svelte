<script lang="ts">
	import { signInUserWithEmail } from '$lib/firebase/actions/authAction';
	import Swal from 'sweetalert2';
	import { onMount } from 'svelte';
	import { z } from 'zod';
	import { goto } from '$app/navigation';
	import { Toast } from '$lib/middleware/alertConfig';
	import { initFirebase } from '$lib/firebase/config';

	const authSchema = z.object({
		email: z.string().email(),
		password: z.string()
	});

	async function form() {
		const { value: formValues } = (await Swal.fire({
			title: 'กรอกข้อมูล',
			html: `
            <div class="text-sm grid grid-flow-row">
	<input
		id="swal-input1"
		name="email"
		type="email"
		placeholder="Enter Email"
		required
		class="swal2-input"
	/>
	<input
		id="swal-input2"
		name="password"
		type="password"
		required
		placeholder="Enter Password"
		class="swal2-input"
	/>
</div>
      `,
			focusConfirm: false,
			preConfirm: () => {
				return [
					document.getElementById('swal-input1')!.value,
					document.getElementById('swal-input2')!.value
				];
			}
		})) as { value: [string, string] };
		if (formValues) {
			const { success } = authSchema.safeParse({
				email: formValues[0],
				password: formValues[1]
			});
			if (!success) {
				return Swal.fire('Error', 'รหัสผ่านหรืออีเมล์ไม่ถูกต้อง รีเฟรชแล้วลองอีกครั้ง', 'error');
			} else {
				signInUserWithEmail(formValues[0], formValues[1]).then((auth) => {
					if (!auth)
						return Toast.fire({
							icon: 'warning',
							title: 'รหัสผ่านหรืออีเมล์ไม่ถูกต้อง รีเฟรชแล้วลองอีกครั้ง'
						});

					if (auth.email !== import.meta.env.VITE_ADMIN_EMAIL) {
						return Toast.fire({
							icon: 'warning',
							title: 'รหัสผ่านหรืออีเมล์ไม่ถูกต้อง รีเฟรชแล้วลองอีกครั้ง'
						});
					}
					goto(import.meta.env.VITE_DASHBOARD_LISTS_ON_ADMIN_PATH);
				});
			}
		}
	}

	onMount(async () => {
		initFirebase();
		await form();
	});
</script>
