<!-- <script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import type { User } from '$lib/firebase/actions/userAction';
	// import { getStatus } from '../../dashboard/+layout.svelte';
	export let user: User;

	const evidence = [
		{
			name: 'หลักฐานการชำระเงิน',
			src: user.assets.paymentReceiptSrc ? user.assets.paymentReceiptSrc : null
		},
		{
			name: 'หลักฐานการได้รับอนุญาตจากผู้ปกครอง',
			src: user.assets.parentPermissionSrc ? user.assets.parentPermissionSrc : null
		}
	];

	let statusText: string;
	let status: ReturnType<typeof getStatus>;
</script>

<Accordion>
	<AccordionItem open>
		<svelte:fragment slot="lead" />
		<svelte:fragment slot="summary">
			<div class="flex justify-between">
				{user.info.prefix}
				{user.info.name}
			</div>
			<div class="">
				<span
					class:badge-warning={status === 'warning'}
					class:badge-success={status === 'success'}
					class:badge-info={status === 'pending'}
					class="badge cursor-pointer">สถานะ {statusText}</span
				>
			</div></svelte:fragment
		>
		<svelte:fragment slot="content">
			<div class="">
				<p>หลักฐานที่เคยส่งมาทั้งหมด</p>

				<ol class="list-decimal list-inside">
					{#each evidence as proof}
						{#if proof.src}
							<li>{proof.name}</li>
						{/if}
					{/each}
				</ol>
			</div>
		</svelte:fragment>
	</AccordionItem>
</Accordion> -->
