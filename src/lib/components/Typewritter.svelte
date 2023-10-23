<script lang="ts">
	let visible = false;
	export let isDone = false;

	function typewriter(node: Node): { duration: number; tick: (t: number) => void } {
		const speed = 1;
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent;
		const duration = text!.length / (speed * 0.01);

		return {
			duration,
			tick: (t: number) => {
				const i = Math.trunc(text!.length * t);
				node.textContent = text!.slice(0, i);
			}
		};
	}

	export let text: string;
	export let textDuration: number;

	setTimeout(() => {
		visible = true;
	}, textDuration);
</script>

{#if visible}
	<span transition:typewriter>{text}</span>
	<!-- content here -->
{/if}
