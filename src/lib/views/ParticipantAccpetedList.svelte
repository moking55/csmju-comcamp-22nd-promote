<script lang="ts">
	import { getUserList, type User } from '$lib/firebase/actions/userAction';

	let resolveParticipantAcceptable: Promise<User[]> = new Promise((resolve, reject) => {
		try {
			getUserList().then((ppl) => {
				const excluded = ['ไตรภาค', 'ศิริชัย'];
				const pplAcceptable = ppl.filter(
					(user) => user.status && !excluded.includes(user.info.name.split(' ')[0])
				);
				resolve(pplAcceptable);
			});
		} catch (err) {
			reject(err);
		}
	});
</script>

{#await resolveParticipantAcceptable}
    <div class="h-screen grid place-items-center">
        <span class="loading loading-lg" />
    </div>
	<!-- promise is pending -->
{:then participants}
	<section id="participant-accpeted-list" class=" mx-auto space-y-12">
		<div id="text-grid" class="grid grid-flow-row place-items-center text-center">
			<h1
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="text-2xl sm:text-4xl md:text-6xl py-4 gradient-heading uppercase bg-gradient-to-b to-80% font-bold from-primary-focus via-primary to-accent-focus"
			>
				ยินดีต้อนรับ<br /> สู่ค่ายคอมแคมป์ครั้งที่ 22
			</h1>
			<h2
				data-aos-anchor-placement="up-center"
				data-aos="fade-up"
				class="text-lg sm:text-2xl md:text-3xl py-4 uppercase font-bold text-secondary-focus"
			>
				ผลประกาศรายชื่อผู้มีสิทธ์เข้าร่วมโครงการ
			</h2>
		</div>

		<div class="mx-auto">
			<div
				class="relative rounded-xl shadow-2xl shadow-primary bg-opacity-40 p-[8px] text-white bg-animation"
			>
				<div class="relative">
					<div
						class="bg-primary-focus left-1/2 -translate-x-1/2 -top-12 z-30 pointer-events-none absolute aspect-square w-full h-40 opacity-30 blur-3xl"
					/>
				</div>
				<div class="mockup-window border z-20  bg-base-300">
					<div class="flex justify-center overflow-auto  max-h-[60svh] px-4 md:px-20 py-2 bg-base-200">
						<div class="overflow-x-auto">
							<table class="table">
								<!-- head -->
								<thead>
									<tr>
										<th />
										<th>ชื่อ</th>
										<th>ชื่อเล่น</th>
										<th>โรงเรียน</th>
									</tr>
								</thead>
								<tbody>
									<!-- row 1 -->

									{#each participants as ppl, i (i)}
										<tr>
											<th>{i + 1}</th>
											<td>{ppl.info.prefix.concat(ppl.info.name)}</td>
											<td>น้อง{ppl.info.nickname}</td>
											<td>{ppl.info.school}</td>
										</tr>
										<!-- content here -->
									{:else}
										<!-- empty list -->
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="relative">
					<div
						class="bg-secondary-focus left-1/2 -translate-x-1/2 -bottom-4 z-30 pointer-events-none absolute aspect-square w-full h-24 opacity-30 blur-xl"
					/>
				</div>
			</div>
		</div>
	</section>
	<!-- promise was fulfilled -->
{/await}

<style lang="postcss" scope>
	.bg-animation:after {
		content: '';
		--angle: 0deg;
		border-radius: 0.6rem;
		@apply absolute inset-0 z-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500;
	}

	@property --angle {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}

	@keyframes rotate-animation {
		to {
			--angle: 360deg;
		}
	}

	@supports (background: paint(houdini)) {
		.bg-animation:after {
			animation: rotate-animation 10s linear infinite;
			background: linear-gradient(var(--angle), #ec4899, #407cff, #ec4899, #6366f1);
		}
	}
</style>
