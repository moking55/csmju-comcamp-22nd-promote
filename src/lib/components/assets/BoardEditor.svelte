<script lang="ts">
	import { onMount } from 'svelte';

	import Quill from 'quill';
	import { z } from 'zod';
	import { Toast } from '$lib/middleware/alertConfig';
	import { setMessage, superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { Timestamp } from 'firebase/firestore';
	import type Delta from 'quill-delta';
	import {
		addBoard,
		updateBoard,
		type Board,
		type BoardList
	} from '$lib/firebase/actions/boardAction';
	import handler from '$lib/firebase/errors/clientHandler';
	import { auth } from '$lib/firebase/actions/authAction';

	let editor: HTMLDivElement;
	let loadingWhileSubmit = false;
	let formConfig = {
		amountTag: 1
	};
	let quill: Quill;

	export let boardEditor: BoardList | null = null;

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

	const boardSchema = z.object({
		title: z.string().min(2, 'ห้ามว่าง'),
		tags: z.string().min(1, 'ต้องใส่อย่างน้อยหนึ่งอัน').array().optional()
	});

	const { form, errors, enhance, constraints } = superForm(superValidateSync(boardSchema), {
		SPA: true,
		validators: boardSchema,
		id: boardEditor?.uId ?? 'board-add-form',
		onSubmit() {
			loadingWhileSubmit = true;

			const data: Board = {
				userUid: $auth?.uid ?? '',
				useEmail: $auth?.email ?? '',
				title: $form.title,
				description: JSON.stringify(quill.getContents()),
				created: Timestamp.now(),
				lastDateEdit: Timestamp.now(),
				tags: $form.tags ?? ['COMCAMP-CSMJU']
			};

			if (data.tags.length === 0) {
				data.tags = ['COMCAMP-CSMJU'];
			}

			if (!boardEditor) {
				if (quill.getText() === '<p><br></p>') {
					return Toast.fire({
						icon: 'warning',
						title: 'กรุณาเขียนข้อความ'
					});
				}

				addBoard(data)
					.then(() => {
						Toast.fire({
							icon: 'success',
							title: 'เพิ่มข้อมูลสำเร็จ, รีหน้าเพื่อดูข้อมูลที่เพิ่ม'
						});
						loadingWhileSubmit = false;
					})
					.catch((err) => {
						handler(err, 'เพิ่มข้อมูลไม่สำเร็จ');
						loadingWhileSubmit = false;
					});
			} else {
				updateBoard({ ...data, uId: boardEditor.uId })
					.then(() => {
						Toast.fire({
							icon: 'success',
							title: 'แก้ไขข้อมูลสำเร็จ, รีหน้าเพื่อดูข้อมูลที่แก้ไข'
						});
						loadingWhileSubmit = false;
					})
					.catch((err) => {
						handler(err, 'แก้ไขข้อมูลไม่สำเร็จ');
						loadingWhileSubmit = false;
					});
			}
		}
	});

	function setBoardData() {
		if (boardEditor) {
			$form.title = boardEditor.title;
			$form.tags = boardEditor.tags;
			quill.setContents(boardEditor.description as Delta);
		}
	}

	onMount(async () => {
		quill = new Quill(editor, {
			modules: {
				toolbar: toolbarOptions
			},
			theme: 'snow',
			placeholder: 'เขียนถึงหมายเหตุในการตอบกลับ'
		});

		if (boardEditor) {
			setBoardData();
		}
	});
</script>

<svelte:window on:beforeunload|preventDefault />

<div class="grid place-content-center">
	<div class="w-full">
		<h1 class="text-xl">{boardEditor ? 'แก้ไขบอร์ด' : 'เพิ่มบอร์ด'}</h1>

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
					class="input input-ghost input-sm input-bordered"
				/>
				<span class="text-error">{$errors.title ?? ''}</span>
			</div>
			<div class="form-control gap-2">
				<label for="tags" class="label">
					<span> แท็ก </span>
					<div class="space-x-2">
						<button
							type="button"
							on:click={() => formConfig.amountTag--}
							class="btn btn-error btn-sm">-</button
						>
						<button
							type="button"
							on:click={() => ($form.tags = [...($form.tags ?? []), ''])}
							class=" btn btn-info btn-sm"
						>
							เพิ่มแท็ก
						</button>
					</div>
				</label>
				{#if $form.tags}
					{#if $errors.tags?._errors}
						<div class="invalid">{$errors.tags._errors}</div>
					{/if}
					{#each $form.tags as _, i}
						<div class="space-x-2">
							<input
								required
								type="text"
								class="input input-sm input-bordered"
								name="tags"
								bind:value={$form.tags[i]}
							/>
							<button
								type="button"
								on:click={() => ($form.tags = $form.tags?.filter((_, index) => index !== i))}
								class="btn btn-error btn-xs">-</button
							>
							{#if $errors.tags?.[i]}
								<span class="invalid">{$errors.tags[i]}</span>
							{/if}
						</div>
					{/each}
					{#if $errors.tags?._errors}
						<div class="invalid">{$errors.tags._errors}</div>
					{/if}
				{/if}
			</div>

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
