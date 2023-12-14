<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import Quill from 'quill';
	import type { List } from '$lib/firebase/admin-actions/adminListAction';
	import { z } from 'zod';
	import { Toast } from '$lib/middleware/alertConfig';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import {
		sendNotificationToUser,
		type Notification,
		type NotificationData,
		updateNotification,
		getNotification,
		notificationStore
	} from '$lib/firebase/actions/notificationAction';
	import { Timestamp } from 'firebase/firestore';
	import type Delta from 'quill-delta';
	import type { User } from '$lib/firebase/actions/userAction';

	export let listEditor: List | null = null;
	export let userEditor: User | null = null;
	export let notificationEditor: Notification | null = null;
	export let action: 'CREATE' | 'UPDATE';

	let editor: HTMLDivElement;
	let loadingWhileSubmit = false;
	let quill: Quill;

	const formDetail = listEditor
		? {
				uId: listEditor.data.userUid,
				email: listEditor.data.userEmail,
				name: listEditor.data.name
		  }
		: userEditor
		? {
				uId: userEditor.uId,
				email: userEditor.email,
				name: userEditor.info.name
		  }
		: notificationEditor
		? {
				uId: notificationEditor.userUid,
				email: notificationEditor.toUserEmail,
				name: notificationEditor.toUserName
		  }
		: null;
	const autoFilledOpts: { context: string; value: 'FAILED' | 'SUCCESS' | 'NONE' }[] = [
		{
			context: 'หลักฐานการยืนยันผิดพลาด',
			value: 'FAILED'
		},
		{
			context: 'หลักฐานการยืนยันถูกต้อง',
			value: 'SUCCESS'
		}
	];

	export let toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'], // toggled buttons
		['blockquote', 'code-block'],

		[{ header: 1 }, { header: 2 }], // custom button values
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
		[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
		[{ direction: 'rtl' }], // text direction

		[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
		[{ header: [1, 2, 3, 4, 5, 6, false] }],

		[{ color: [] }, { background: [] }], // dropdown with defaults from theme
		[{ align: [] }],
		['link', 'image', 'video'],
		['clean'] // remove formatting button
	];
	const notificationSchema = z.object({
		title: z.string().min(2, 'ห้ามว่าง')
	});

	const { form, errors, enhance, constraints } = superForm(superValidateSync(notificationSchema), {
		SPA: true,
		validators: notificationSchema,
		id: formDetail?.uId ?? '',
		onSubmit({ formData }) {
			loadingWhileSubmit = true;
			const { title } = Object.fromEntries(formData) as {
				title: string;
			};
			if ((action === 'CREATE' && listEditor) || userEditor) {
				if (quill.getText() === '<p><br></p>') {
					return Toast.fire({
						icon: 'warning',
						title: 'กรุณาเขียนข้อความ'
					});
				}

				const notification: NotificationData = {
					userUid: listEditor ? listEditor!.data.userUid : userEditor!.uId,
					toUserEmail: listEditor ? listEditor!.data.userEmail : userEditor!.email,
					toUserName: listEditor ? listEditor!.data.name : userEditor!.info.name,
					description: JSON.stringify(quill.getContents()),
					created: Timestamp.now(),
					title
				};

				sendNotificationToUser(notification, quill).then(async () => {
					Toast.fire({
						icon: 'success',
						title: 'ส่งข้อความสำเร็จ'
					});
					getNotification().then((res) => {
						notificationStore.set(res);
					});
					loadingWhileSubmit = false;
				});
			} else if (action === 'UPDATE' && notificationEditor) {
				const notification: Notification = {
					...notificationEditor!,
					title,
					description: JSON.stringify(quill.getContents()),
					lastDateEdit: Timestamp.now()
				};

				updateNotification(notification).then(() => {
					Toast.fire({
						icon: 'success',
						title: 'แก้ไขข้อความสำเร็จ'
					});
					getNotification().then((res) => {
						notificationStore.set(res);
					});
					loadingWhileSubmit = false;
				});
			}
		}
	});

	onMount(async () => {
		quill = new Quill(editor, {
			modules: {
				toolbar: toolbarOptions
			},
			theme: 'snow',
			placeholder: 'เขียนถึงหมายเหตุในการตอบกลับ'
		});

		if (action === 'UPDATE') {
			if (notificationEditor) {
				quill.setContents(notificationEditor.description as Delta);
				$form.title = notificationEditor.title;
			}
		}
	});

	function autoFilledContext(context: 'FAILED' | 'SUCCESS' | 'NONE') {
		if (context === 'FAILED') {
			$form.title = `หลักฐานการยืนยันผิดพลาด: หลักฐาน <หัวข้อหลักฐาน> ไม่ถูกต้อง`;
			quill.setText(
				`สวัสดีครับน้อง ${formDetail?.name ?? '<ชื่อผู้ใช้>'} 
ข้อความนี้มาจากพวกพี่ "โครงการค่ายยุวชนคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้" นะครับ พี่เช็คหลักฐานยืนยันจากผู้ปกครองของน้องแล้ว แต่ยังมีบางจุดที่อาจต้องปรับนิดหน่อยนะ โดย <เหตุผล>

โดยสามารถส่งหลักฐานใหม่ได้ตรงช่องทางที่น้องส่งหลักฐานครั้งแรกจากเว็บไซต์ ${'comcamp.csmju.com'} ได้เลย

เพื่อให้ทุกอย่างผ่านฉลุย! พี่ขอให้กรุณาส่งหลักฐานใหม่ภายในวันที่ <ระบุวันที่> น๊าา

ไม่ต้องกังวลนะ! พี่พร้อมช่วยเหลือเสมอ ถ้ามีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม สามารถติดต่อพี่ๆ ได้ที่ <เบอร์โทรศัพท์> หรือ <อีเมล์> นะครับ

ขอบคุณที่ให้ความร่วมมือนะครับ  แล้วอย่าลืมติดตามข่าวสารของค่ายได้ที่เพจ facebook.com/CCCSMJU และสถานะของตัวเองได้ที่เว็บไซต์ ${'comcamp.csmju.com'} แล้วเจอกันในค่ายน๊าาา  💚🤍💛`
			);
		} else if (context === 'SUCCESS') {
			$form.title = `หลักฐานการยืนยันถูกต้อง: ตรวจสอบหลักฐาน <หัวข้อหลักฐาน> ถูกต้อง`;
			quill.setText(
				`สวัสดีครับน้อง ${formDetail?.name ?? '<ชื่อผู้ใช้>'} 
ข้อความนี้มาจากพวกพี่ "โครงการค่ายยุวชนคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้" นะครับ

พี่จะมาแจ้งข่าวดีว่า หลักฐานยืนยัน <หัวข้อหลักฐาน> ของน้องผ่านการตรวจสอบจากพวกพี่เป็นที่เรียบร้อยแล้ว ตอนนี้รอขั้นตอนต่อไปได้เลยนะ พี่จะแจ้งให้ทราบเร็วๆ นี้ มีอะไรสงสัย อยากถามอะไร ทักมาคุยกับพี่ได้เสมอ รอติดตามข่าวดีอยู่นะ 🫰🏻

ขอบคุณที่ให้ความร่วมมือนะครับ  แล้วอย่าลืมติดตามข่าวสารของค่ายได้ที่เพจ facebook.com/CCCSMJU และสถานะของตัวเองได้ที่เว็บไซต์ ${'comcamp.csmju.com'} แล้วเจอกันในค่ายน๊าาา  💚🤍💛`
			);
		}
	}

	function beforeUnload(e: BeforeUnloadEvent) {
		// Cancel the event
		e.preventDefault();
		// Chrome requires returnValue to be set
		e.returnValue = '';
	}

	onMount(() => {
		window.addEventListener('beforeunload', beforeUnload);
	});

	onDestroy(() => {
		window.removeEventListener('beforeunload', beforeUnload);
	});
</script>

<svelte:window on:beforeunload|preventDefault />

<div class="grid place-content-center">
	<div class="w-full">
		<div class="flex items-center justify-between">
			{#if formDetail}
				<div id="form-header">
					<span class="font-semibold">ส่งถึง: </span> <span>{formDetail.name}</span><br />
					<span class="font-semibold">อีเมล์: </span> <span>{formDetail.email}</span>
				</div>
			{/if}
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-accent btn-sm m-1">เทมเพล็ต</div>
				<ul tabindex="0" class="dropdown-content z-[1] menu p-0 shadow bg-accent/50 w-52">
					{#each autoFilledOpts as opt}
						<li>
							<button  on:click={() => autoFilledContext(opt.value)}
								>{opt.context}</button
							>
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="divider" />
		<form use:enhance method="POST" class="flex flex-col gap-4">
			<div class="form-control">
				<label for="title" class="label"> หัวข้อ </label>
				<input
					{...$constraints.title}
					aria-invalid={$errors.title ? 'true' : undefined}
					bind:value={$form.title}
					name="title"
					type="text"
					id="title"
					class="input input-ghost input-bordered"
				/>
			</div>
			<span class="text-error">{$errors.title ?? ''}</span>

			<div>
				<label for="detal" class="label">ข้อความ</label>
				<div class="editor-wrapper bg-white">
					<div class="h-full pb-80 text-black" id="detail" bind:this={editor} />
				</div>
			</div>
			<div class="form-control">
				<button type="submit" class="btn btn-accent">
					{#if loadingWhileSubmit}
						<span class="loading text-base-content loading-spinner loading-sm" />
					{/if} ส่ง</button
				>
			</div>
		</form>
	</div>
</div>

<style>
	@import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
</style>
