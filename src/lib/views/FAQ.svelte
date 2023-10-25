<script lang="ts">
	import HologramCard from './../components/HologramCard.svelte';
	import { benefits, faq } from '../../data';
</script>

<section id="benefit-section" class="container mx-auto flex flex-col gap-16">
	<div id="topic" class="flex mx-4 md:mx-0 justify-between">
		<img
			class="w-52 slide-in -z-10 visible md:invisible"
			src="src/lib/assets/group_of_question.png"
			alt=""
		/>
		<article class="prose-lg lg:prose-2xl text-end mx-3">
			<h1
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="gradient-heading uppercase bg-gradient-to-t font-bold from-primary-focus via-primary to-secondary-focus"
			>
				FAQ
			</h1>
			<h3
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class=" text-secondary-focus font-bold"
			>
				คำถามที่ถูกพบบ่อย
			</h3>
		</article>
	</div>
	<div class="grid mx-4 md:mx-0 place-items-center gap-y-24 grid-cols-3">
		<div class="hidden md:block w-[32rem] relative">
			<img src="src/lib/assets/person_thinking_2.png" alt="" />
			<img
				class="w-52 slide-in absolute top-0 -z-10 left-1/2"
				src="src/lib/assets/group_of_question.png"
				alt=""
			/>
		</div>
		<div class="col-span-full md:col-span-2">
			{#each faq.slice(0, 6) as data}
				<div
					tabindex="0"
					class="bg-secondary-focus bg-opacity-40 collapse collapse-arrow border border-base-300 bg-base-200"
				>
					<div class="collapse-title text-xl font-medium">{data.question}</div>
					<div class="collapse-content">
						<p class="indent-4">{data.answer}</p>
					</div>
				</div>
			{/each}
			<button
				class="text-xl flex w-full border-accent-focus border-b-2 m-2 p-2 text-accent"
				onclick="my_modal_2.showModal()"
				>ดูเพิ่มเติม
			</button>
		</div>
		<!-- Open the modal using ID.showModal() method -->
	</div>
	<dialog id="my_modal_2" class="modal">
		<div class="modal-box w-auto md:w-[60rem]">
			<div class="flex justify-between items-center my-2">
				<div class="">
					<h3 class="font-bold text-2xl">FAQ</h3>
					<p>คำถามที่ถูกพบบ่อย</p>
				</div>
				<form method="dialog">
					<button class="btn btn-md btn-circle btn-ghost">✕</button>
				</form>
			</div>
			{#each faq as data}
				<div
					tabindex="0"
					class="bg-secondary-focus bg-opacity-40 collapse collapse-arrow border rounded-none border-base-300 bg-base-200"
				>
					<div class="collapse-title text-lg font-medium">{data.question}</div>
					<div class="collapse-content">
						<p class="indent-4">{data.answer}</p>
					</div>
				</div>
			{/each}
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</section>

<style lang="postcss">
	@keyframes slide-in {
		from {
			transform: translateY(-25%);
		}
		to {
			transform: translateY(0%);
		}
	}

	.slide-in {
		animation: slide-in 1s ease-in-out infinite alternate-reverse;
	}
	/* your styles go here */
</style>
