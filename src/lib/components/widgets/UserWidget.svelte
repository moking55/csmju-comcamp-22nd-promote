<script lang="ts">
	import { userWidgetDrawerSettings } from './UserDrawer.svelte';
	import { getStatus, getStatusText } from '../../../routes/dashboard/+layout.svelte';
	import 'iconify-icon';
	import type { User } from '$lib/firebase/actions/userAction';
	import type { DrawerStore } from '@skeletonlabs/skeleton';

	export let user: User;
	export let drawerStore: DrawerStore;
</script>

<div class="z-10">
	<button
		on:click={() => drawerStore.open(userWidgetDrawerSettings)}
		class:btn-warning={getStatus(user.status, user) === 'warning'}
		class:btn-success={getStatus(user.status, user) === 'success'}
		class:btn-info={getStatus(user.status, user) === 'pending'}
		class="btn btn-sm text-xs p-1"
	>
		<span class="my-auto flex items-center gap-1">
			สถานะ {getStatusText(getStatus(user.status, user))}
			
			<iconify-icon icon="mdi:arrow-down-bold" />
		</span>
	</button>
</div>
