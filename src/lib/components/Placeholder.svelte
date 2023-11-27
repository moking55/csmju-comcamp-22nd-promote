<script lang="ts">
	export let showContext: boolean = false;
	export let placeholderText: string = 'ไม่พบข้อมูล';
</script>

{#if !showContext}
	<slot />
{:else}
	<div class="grid h-screen place-content-center gap-y-4">
		<h1 class="tracking-widest text-xl text-gray-500 uppercase">{placeholderText}</h1>
        <slot name="placeholder" />
	</div>
{/if}
