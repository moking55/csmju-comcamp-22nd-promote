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

	let editor: HTMLDivElement;
	let loadingWhileSubmit = false;
	let quill: Quill;

	export let listEditor: List | null = null;
	export let userEditor: User | null = null;
	export let notificationEditor: Notification | null = null;

	export let action: 'CREATE' | 'UPDATE';

	export let toolbarOptions = [
		[{ header: 1 }, { header: 2 }, 'blockquote', 'link', 'image', 'video'],
		['bold', 'italic', 'underline', 'strike'],
		[{ list: 'ordered' }, { list: 'ordered' }],
		[{ align: [] }],
		['clean']
	];

	const notificationSchema = z.object({
		title: z.string().min(2, 'ห้ามว่าง')
	});

	const { form, errors, enhance, constraints } = superForm(superValidateSync(notificationSchema), {
		SPA: true,
		validators: notificationSchema,
		id: listEditor
			? listEditor.uId
			: userEditor
			? userEditor.uId
			: notificationEditor
			? notificationEditor.uId
			: '',
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

				sendNotificationToUser(notification).then(async () => {
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
		{#if listEditor}
			<div id="form-header">
				<span class="font-semibold">ส่งถึง: </span> <span>{listEditor.data.name}</span><br />
				<span class="font-semibold">อีเมล์: </span> <span>{listEditor.data.userEmail}</span>
			</div>
		{:else if userEditor}
			<div id="form-header">
				<span class="font-semibold">ส่งถึง: </span> <span>{userEditor.info.name}</span><br />
				<span class="font-semibold">อีเมล์: </span> <span>{userEditor.email}</span>
			</div>
		{:else}
			<div id="form-header">
				<span class="font-semibold">ส่งถึง: </span> <span>{notificationEditor?.toUserName}</span><br
				/>
				<span class="font-semibold">อีเมล์: </span> <span>{notificationEditor?.toUserEmail}</span>
			</div>
		{/if}
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
