<script lang="ts">
	import {
		addSponsor,
		updateSponsor,
		type Sponsor,
		type SponsorData
	} from '$lib/firebase/actions/sponsorAction';
	import handler from '$lib/firebase/errors/clientHandler';
	import { Toast } from '$lib/middleware/alertConfig';
	import type { FirebaseError } from 'firebase/app';
	import { Timestamp } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { superForm, superValidateSync } from 'sveltekit-superforms/client';
	import { z } from 'zod';

	export let sponsorEditor: {
		index: number;
		sponsor: Sponsor;
	} | null = null;
	let loadingWhileSubmit = false;

	const sponsorSchema = z.object({
		name: z.string().min(2, 'ห้ามว่าง'),
		position: z.string().nullable(),
		from: z.string().nullable(),
		donateAmount: z.coerce.number().min(0).nullable(),
		donateDate: z.string().nullable()
	});

	const { form, errors, enhance, constraints } = superForm(superValidateSync(sponsorSchema), {
		SPA: true,
		validators: sponsorSchema,
		id: sponsorEditor ? `sponsor-editor-${sponsorEditor?.index.toString()}` : 'sponsor-add-form',
		onSubmit() {
			if (!$form.name) return Toast.fire({ title: 'กรุณากรอกชื่อผู้บริจาค', icon: 'error' });

			loadingWhileSubmit = true;

			// convert date to timestamp

			const sponsorData: SponsorData = {
				name: $form.name,
				position: $form.position ?? null,
				from: $form.from ?? null,
				donateAmount: $form.donateAmount ? +$form.donateAmount : null,
				donateDate: $form.donateDate
					? new Timestamp(new Date($form.donateDate).getTime() / 1000, 0)
					: null,
				created_at: Timestamp.now()
			};

			if (sponsorEditor) {
				updateSponsor(sponsorEditor.sponsor.uId, sponsorData)
					.then(() => {
						Toast.fire({
							title: 'แก้ไขข้อมูลสำเร็จ',
							icon: 'success'
						});
					})
					.catch((err: FirebaseError) => {
						handler(err, 'ไม่สามารถแก้ไขข้อมูลได้');
					})
					.finally(() => {
						loadingWhileSubmit = false;
					});
			} else {
				addSponsor(sponsorData)
					.then(() => {
						Toast.fire({
							title: 'เพิ่มข้อมูลสำเร็จ',
							icon: 'success'
						});
					})
					.catch((err: FirebaseError) => {
						handler(err, 'ไม่สามารถเพิ่มข้อมูลได้');
					})
					.finally(() => {
						loadingWhileSubmit = false;
					});
			}
		}
	});

	function setSponsorData() {
		if (sponsorEditor) {
			const { sponsor } = sponsorEditor;
			$form.name = sponsor.name;
			$form.position = sponsor.position;
			$form.from = sponsor.from;
			$form.donateAmount = sponsor.donateAmount;
			$form.donateDate = sponsor.donateDate
				? sponsor.donateDate.toDate().toISOString().split('T')[0]
				: null;
		}
	}

	onMount(() => {
		if (sponsorEditor) {
			setSponsorData();
		}
	});
</script>

<div class="flex flex-col">
	<div class="w-full">
		<h1 class="text-xl">{sponsorEditor ? 'แก้ไขรายชื่อผู้บริจาค' : 'เพิ่มรายชื่อผู้บริจาค'}</h1>

		<div class="divider" />
		<form use:enhance method="POST" class="flex flex-col gap-4">
			<div class="form-control">
				<label for="name" class="label"> ชื่อผู้บริจาค </label>
				<input
					{...$constraints.name}
					aria-invalid={$errors.name ? 'true' : undefined}
					bind:value={$form.name}
					name="name"
					type="text"
					id="name"
					class="input input-ghost input-sm input-bordered"
				/>
				<span class="text-sm mt-2 text-error">{$errors.name ?? ''}</span>
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">บริจาคในฐานะ</span>
					<span class="label-text-alt">ถ้าไม่เขียนให้เว้นไว้</span>
				</div>
				<input
					{...$constraints.position}
					aria-invalid={$errors.position ? 'true' : undefined}
					bind:value={$form.position}
					name="position"
					type="text"
					id="position"
					class="input input-ghost input-sm input-bordered"
				/>

				<span class="text-error">{$errors.position ?? ''}</span>
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">จากบริษัท/กลุ่ม</span>
					<span class="label-text-alt">ถ้าไม่เขียนให้เว้นไว้</span>
				</div>
				<input
					{...$constraints.from}
					aria-invalid={$errors.from ? 'true' : undefined}
					bind:value={$form.from}
					name="from"
					type="text"
					id="from"
					class="input input-ghost input-sm input-bordered"
				/>
				<span class="text-error">{$errors.from ?? ''}</span>
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">จำนวนเงินที่บริจาค (บาท)</span>
					<span class="label-text-alt">ถ้าไม่เขียนให้เว้นไว้</span>
				</div>
				<input
					{...$constraints.donateAmount}
					aria-invalid={$errors.donateAmount ? 'true' : undefined}
					bind:value={$form.donateAmount}
					name="donateAmount"
					type="number"
					id="donateAmount"
					class="input input-ghost input-sm input-bordered"
				/>
				<span class="text-error">{$errors.donateAmount ?? ''}</span>
			</div>
			<div class="form-control">
				<div class="label">
					<span class="label-text">บริจาคเมื่อวันที่</span>
					<span class="label-text-alt">ถ้าไม่เขียนให้เว้นไว้</span>
				</div>
				<input
					{...$constraints.donateDate}
					aria-invalid={$errors.donateDate ? 'true' : undefined}
					bind:value={$form.donateDate}
					name="donateData"
					type="date"
					id="donateData"
					class="input input-ghost input-sm input-bordered"
				/>
				<span class="text-error">{$errors.donateDate ?? ''}</span>
			</div>

			<div class="form-control">
				<button type="submit" class="btn btn-accent">
					{#if loadingWhileSubmit}
						<span class="loading text-base-content loading-spinner loading-sm" />
					{/if} ยืนยัน</button
				>
			</div>
		</form>
	</div>
</div>
