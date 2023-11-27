<script lang="ts">
	import Placeholder from '$lib/components/Placeholder.svelte';
	import { fileUploader, deleteFile } from '$lib/config/cloundinary';
	import { setError, superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { z } from 'zod';
	import { Toast } from '$lib/middleware/alertConfig';
	import { userData } from '$lib/firebase/actions/userAction';
	import {
		addOnList,
		deleteListWhenFileHadRemove
	} from '$lib/firebase/admin-actions/adminListAction';
	import Swal from 'sweetalert2';

	let loadingWhileSubmit = false;

	const fileSchema = z.object({
		file: z.any().refine((files) => files?.length == 1)
	});

	const { form, errors, enhance, constraints } = superForm(superValidateSync(fileSchema), {
		SPA: true,
		validators: fileSchema,
		onSubmit({ formData, form }) {
			loadingWhileSubmit = true;
			const { fileUpload } = Object.fromEntries(formData) as { fileUpload: File };
			// i want to validate file size to maximum on 1 mb
			const maxSize = 1 * 1024 * 1024; // 1 MB in bytes
			if (!fileUpload || fileUpload.size > maxSize) {
				loadingWhileSubmit = false;
				return Toast.fire({
					icon: 'warning',
					title: 'ไม่ตรวจพบไฟล์ หรือไฟล์ของคุณมีขนาดใหญ่เกิน 1 MB'
				});
			}
			fileUploader(fileUpload, $userData!.uId, 'RECEIPT').then((res) => {
				Toast.fire({
					icon: 'success',
					title: 'อัปโหลดสำเร็จ'
				});
				addOnList($userData!, res.publicId, 'หลักฐานการชำระ');
				loadingWhileSubmit = false;
			});
		}
	});

	function onResubmit() {
		Swal.fire({
			title: 'ยืนยันการส่งใหม่',
			text: 'ไฟล์อันเก่าที่คุณถูกส่งจะถูกลบออกจากระบบ',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'ยืนยัน',
			cancelButtonText: 'ไม่',
			background: '#1a202c',
			color: '#fff'
		}).then((result) => {
			if (result.isConfirmed) {
				loadingWhileSubmit = true;
				let asset = $userData!.assets.paymentReceiptSrc;
				deleteFile(asset, $userData!.uId, 'RECEIPT').then(async () => {
					await deleteListWhenFileHadRemove(asset);
					Toast.fire({
						icon: 'success',
						title: 'ลบหลักฐานการชำระเรียบร้อย'
					});
					loadingWhileSubmit = false;
				});
			}
		});
	}

	$: isAlreadySubmit = $userData?.assets.paymentReceiptSrc !== null;
</script>

<section id="user-detail" class="space-y-4">
	<article class="prose prose-sm">
		<h2 class="text-base md:text-2xl">ส่งหลักฐานการชำระ</h2>
		<span
			class:badge-warning={!isAlreadySubmit}
			class:badge-success={isAlreadySubmit}
			class="badge"
		>
			{isAlreadySubmit ? 'หลักฐานการชำระถูกส่งเรียบร้อย' : 'คุณยังไม่ได้ส่งหลักฐานการชำระ'}
		</span>
		<p>เนื่องจากการส่งหลักฐานการชำระ เป็นการยืนยันว่าคุณจะเข้าร่วมโครงการนี้ โปรดส่งก่อน xxx</p>
	</article>
	<div class="divider" />

	<Placeholder showContext={isAlreadySubmit} placeholderText={'หลักฐานการชำระถูกส่งเรียบร้อย'}>
		<div class=" max-w-2xl mx-auto">
			<form enctype="multipart/form-data" method="POST" use:enhance>
				<div class="flex h-screen flex-col gap-6 items-center justify-center w-full">
					<label
						for="fileUpload"
						class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-bray-800 bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600"
					>
						<div class="flex flex-col items-center justify-center pt-5 pb-6">
							<svg
								class="w-10 h-10 mb-3 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/></svg
							>
							<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
								<span class="font-semibold">กดที่นี้เพื่ออัปโหลด</span> หรือลากไฟล์ของคุณมาวาง
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								รับเฉพาะ PNG, JPG หรือ JPEG (MAX. 1MB)
							</p>
						</div>
						<input
							{...$constraints.file}
							aria-invalid={$errors.file ? 'true' : undefined}
							bind:value={$form.file}
							name="fileUpload"
							accept="image/png, image/jpeg, image/jpg"
							id="fileUpload"
							type="file"
							class="opacity-50"
						/>
					</label>
					<button type="submit" class="btn">
						{#if loadingWhileSubmit}
							<span class="loading text-base-content text-sm loading-spinner" />
						{/if}

						Submit</button
					>
				</div>
			</form>
		</div>
		<div class="grid" slot="placeholder">
			<button on:click={() => onResubmit()} class="btn"
				>{#if loadingWhileSubmit}
					<span class="loading text-base-content text-sm loading-spinner" />
				{/if} ฉันต้องการยืนยันการส่งใหม่</button
			>
		</div>
	</Placeholder>
</section>
