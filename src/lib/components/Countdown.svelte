<script lang="ts">
	let days = 0;
	let hours = 0;
	let minutes = 0;
	let seconds = 0;
	let isExpired = false;

	export let countdownDate: Date;
	// Update the count down every 1 second
	const x = setInterval(function () {
		// Get today's date and time
		var now = new Date().getTime();

		// Find the distance between now and the count down date
		var distance = countdownDate.getTime() - now;

		// Time calculations for days, hours, minutes and seconds
		days = Math.floor(distance / (1000 * 60 * 60 * 24));
		hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((distance % (1000 * 60)) / 1000);

		// If the count down is over, write some text
		if (distance < 0) {
			clearInterval(x);
			isExpired = true;
		}
	}, 1000);
</script>

{#if !isExpired}
	<div class="grid grid-flow-col gap-5 text-center auto-cols-max">
		<div class="flex flex-col p-3 bg-neutral/50 rounded-box text-neutral-content">
			<span class="countdown font-mono text-5xl">
				<span style="--value:{days};" />
			</span>
			วัน
		</div>
		<div class="flex flex-col p-3 bg-neutral/50 rounded-box text-neutral-content">
			<span class="countdown font-mono text-5xl">
				<span style="--value:{hours};" />
			</span>
			ชั่วโมง
		</div>
		<div class="flex flex-col p-3 bg-neutral/50 rounded-box text-neutral-content">
			<span class="countdown font-mono text-5xl">
				<span style="--value:{minutes};" />
			</span>
			นาที
		</div>
		<div class="flex flex-col p-3 bg-neutral/50 rounded-box text-neutral-content">
			<span class="countdown font-mono text-5xl">
				<span style="--value:{seconds};" />
			</span>
			วินาที
		</div>
	</div>
{/if}
