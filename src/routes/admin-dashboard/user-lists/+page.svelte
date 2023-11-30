<script lang="ts">
	import UserFilter from '../../../lib/components/assets/UserFilter.svelte';
	import Error550 from '$lib/components/errors/Error550.svelte';
	import DashboardLoadingSlot from '../../../lib/components/assets/DashboardLoadingSlot.svelte';
	import SendNotificationForm from '$lib/components/SendNotificationForm.svelte';
	import { CldImage } from 'svelte-cloudinary';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import { getStatus, getStatusText } from '../../dashboard/+layout.svelte';
	import {
		deleteUserDataAndAssociatedStuff,
		getUserList,
		markAsConfirm,
		type User
	} from '$lib/firebase/actions/userAction';
	import { onMount } from 'svelte';
	import { userListStore as userList } from '$lib/firebase/actions/userAction';
	import Swal from 'sweetalert2';
	import { Toast } from '$lib/middleware/alertConfig';

	let promise: Promise<unknown>;

	let fullInfo = false;

	let paginationSettings = {
		page: 0,
		limit: 5,
		size: $userList.length,
		amounts: [1, 2, 5, 8]
	} satisfies PaginationSettings;

	function onSortBy(sortBy: 'school' | 'age' | 'date' | 'shirtSize') {
		if (sortBy === 'school') {
			paginatedSource = $userList.sort((a, b) => {
				const schoolComparison = a.info.school.localeCompare(b.info.school);
				return sortOpt.school ? schoolComparison : -schoolComparison;
			});
		} else if (sortBy === 'age') {
			paginatedSource = $userList.sort((a, b) => {
				const ageComparison = a.info.age - b.info.age;
				return sortOpt.age ? ageComparison : -ageComparison;
			});
		} else if (sortBy === 'date') {
			paginatedSource = $userList.sort((a, b) => {
				const dateComparison = a.created_at.seconds - b.created_at.seconds;
				return sortOpt.date ? dateComparison : -dateComparison;
			});
		} else if (sortBy === 'shirtSize') {
			paginatedSource = $userList.sort((a, b) => {
				const shirtSizeComparison = a.info.shirtSize.localeCompare(b.info.shirtSize);
				return sortOpt.shirtSize ? shirtSizeComparison : -shirtSizeComparison;
			});
		}
	}

	function onDeleteUser(user: User) {
		Swal.fire({
			title: 'คอมเฟิร์มการลบข้อมูล',
			html: `<div class="collapse bg-base-200">
	<input type="radio" name="my-accordion-1" checked="checked" /> 
	<div class="collapse-title text-base font-medium">
	<div class="flex justify-between">
		<div>
			ผู้ใช้: ${user.info.name} (${user.info.nickname})
			
			</div>
			<div>
				<span
					class="btn-outline btn-accent btn-sm cursor-pointer">สถานะ ${getStatusText(
						getStatus(user.status, user)
					)}</span
				>
				</div>
		</div>
		
	</div>
	
	<div class="collapse-content space-y-4"> 
		<hr/>
		<p>การลบในครั้งนี้จะส่งผลกระทบไปยังถึง</p>
		<hr/>
		<ol class="list-decimal list-inside">
	<li>ข้อมูลของผู้เข้าร่วมนี้</li>
	<li>รายการตอบกลับของผู้เข้าร่วมนี้</li>
	<li>รายการหลักฐานของผู้เข้าร่วมนี้</li>
</ol>
  </div>

  </div>`,
			icon: 'warning',
			showCancelButton: true,
			background: '#1a202c',
			color: '#fff',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'ลบข้อมูล'
		}).then((result) => {
			if (result.isConfirmed) {
				deleteUserDataAndAssociatedStuff(user).then(() => {
					Toast.fire({
						icon: 'success',
						title: 'ลบข้อมูลผู้ใช้เรียบร้อยแล้ว'
					});
				});
			}
		});
	}

	onMount(() => {
		promise = new Promise((resolve, reject) => {
			getUserList().then((res) => {
				userList.set(res);
				resolve(res);
			});
		});
	});

	let sortOpt = {
		school: false,
		age: false,
		date: false,
		shirtSize: false
	};

	$: paginatedSource = $userList.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);
	$: paginationSettings.size = $userList.length;
</script>

{#await promise}
	<DashboardLoadingSlot loadSample={'LOADING_SLOT'} />
{:then}
	<section id="lists" class="h-screen lg:h-full space-y-4">
		<div class="flex justify-between">
			<div class="">
				<article class="float-left prose prose-sm">
					<h2 class="text-base md:text-2xl">ผู้เข้าร่วมสมัคร</h2>
					<p class="text-sm">ตรวจสอบรายชื่อที่ถูกส่งมาได้ที่นี้</p>
				</article>
			</div>
			<div class="flex justify-between">
				<div class="flex items-end flex-col gap-2">
					<div class="">
						<label class="label gap-2 cursor-pointer">
							<span class="label-text">ดูข้อมูลเต็ม</span>
							<input type="checkbox" bind:checked={fullInfo} class="checkbox" />
						</label>
					</div>
					<div class="">
						<label for="user_filter_model" class="btn btn-sm">กรองตาม</label>

						<!-- Put this part before </body> tag -->
						<input type="checkbox" id="user_filter_model" class="modal-toggle" />
						<div class="modal" role="dialog">
							<div class="modal-box">
								<UserFilter bind:userList={$userList} />
							</div>
							<label class="modal-backdrop" for="user_filter_model">Close</label>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="divider" />
		{#if $userList.length > 0}
			<div class="overflow-x-auto w-full">
				<table class="table w-full text-xs">
					<!-- head -->
					<thead>
						<tr>
							<th
								class="tooltip tooltip-right bg-opacity-0 text-xs"
								data-tip="ช่องเครื่องหมายนี้มีเพื่อเช็ค เพื่อยืนยันว่าผู้สมัครได้ผ่านการเข้าร่วมแล้ว โปรดตรวจสอบให้แน่ใจว่าผู้สมัครผ่านคุณสมบัติครบถ้วน"
							>
								ยืนยัน <iconify-icon icon="ph:question-light" />
							</th>
							<th>ชื่อ</th>
							<th>ชื่อเล่น</th>
							<th
								class="cursor-pointer hover:bg-base-300/50 rounded-md"
								on:click={() => ((sortOpt.age = !sortOpt.age), onSortBy('age'))}
								>อายุ <iconify-icon icon={sortOpt.age ? 'mdi:arrow-up' : 'mdi:arrow-down'} /></th
							>
							<th>อีเมล์ติดต่อ</th>
							<th>เบอรโทร</th>
							<th>ไลน์ไอดี</th>
							<th>Facebook</th>
							<th>เบอร์โทรผู้ปกครอง</th>
							<th>ช่องทางติดต่ออื่น</th>
							<th
								class="cursor-pointer hover:bg-base-300/50 rounded-md"
								on:click={() => ((sortOpt.school = !sortOpt.school), onSortBy('school'))}
								>โรงเรียน <iconify-icon
									icon={sortOpt.school ? 'mdi:arrow-up' : 'mdi:arrow-down'}
								/></th
							>
							<th
								class="cursor-pointer hover:bg-base-300/50 rounded-md"
								on:click={() => ((sortOpt.shirtSize = !sortOpt.shirtSize), onSortBy('shirtSize'))}
								>ขนาดเสื้อ <iconify-icon
									icon={sortOpt.shirtSize ? 'mdi:arrow-up' : 'mdi:arrow-down'}
								/></th
							>
							{#if fullInfo}
								<th>ระดับชั้น</th>
								<th>โรคประจำตัว</th>
								<th>แพ้ยา</th>
								<th>แพ้อาหาร</th>
								<th>สาเหตุที่เข้าร่วม</th>
							{/if}
							<th>เอกสาร</th>
							<th>แล็บท็อป</th>
							<th
								class="cursor-pointer hover:bg-base-300/50 rounded-md"
								on:click={() => ((sortOpt.date = !sortOpt.date), onSortBy('date'))}
								>เข้าร่วมเมื่อ <iconify-icon
									icon={sortOpt.date ? 'mdi:arrow-up' : 'mdi:arrow-down'}
								/></th
							>
							<th>ตอบกลับ</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{#each paginatedSource as user, i (user.uId)}
							<tr>
								<td>
									<input
										on:change={() => markAsConfirm(user.uId)}
										disabled={user.status}
										checked={user.status}
										type="checkbox"
										class="checkbox border-white"
									/>
								</td>
								<td>{user.info.prefix} {user.info.name}</td>
								<td>{user.info.nickname}</td>
								<td>{user.info.age}</td>
								<td>{user.info.contacts.contractEmail}</td>
								<td>{user.info.phone}</td>
								<td>{user.info.contacts.lineId}</td>
								<td class="text-center"
									><a
										target="_blank"
										class="badge badge-info"
										href={user.info.contacts.facebookLink}>ลิ้ง</a
									></td
								>
								<td>{user.info.contacts.parentContact}</td>
								<td>{user.info.contacts.otherContact ?? '-'}</td>
								<td>{user.info.school}</td>
								<td>{user.info.shirtSize}</td>
								{#if fullInfo}
									<td>{user.info.eduLevel}</td>
									<td>{user.info.congenitalDisease !== '' ? user.info.congenitalDisease : '-'}</td>
									<td>{user.info.drugAllergy !== '' ? user.info.drugAllergy : '-'}</td>
									<td>{user.info.foodAllergy !== '' ? user.info.foodAllergy : '-'}</td>
									<td class="grid w-full place-self-center">
										<div class="tooltip" data-tip={user.info.reasonForJoining}>
											<span class="btn btn-sm">ดู</span>
										</div>
									</td>
								{/if}
								<td>
									<div class="dropdown">
										<label tabindex="0" class="btn m-1 btn-sm">ไฟล์</label>
										<ul
											tabindex="0"
											class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32"
										>
											{#if user.assets.parentPermissionSrc !== null}
												<li>
													<label for={`asset_model_${i}_${i}`}>ผู้ปกครอง</label>
												</li>
											{/if}

											<!-- content here -->
											{#if user.assets.paymentReceiptSrc !== null}
												<li>
													<label for={`asset_model_${i}_${i + 1}`}>ชำระ</label>
												</li>
											{/if}

											{#if !user.assets.parentPermissionSrc && !user.assets.paymentReceiptSrc}
												<li>ยังไม่ได้ส่งหลักฐาน</li>
											{/if}
										</ul>
									</div>
								</td>
								<td>{user.info.haveLaptop ? 'มี' : 'ไม่มี'}</td>
								<td>{user.created_at.toDate().toLocaleString()}</td>

								{#if user.assets.parentPermissionSrc != null}
									<input type="checkbox" id={`asset_model_${i}_${i}`} class="modal-toggle" />
									<div class="modal" role="dialog">
										<div class="modal-box">
											<CldImage
												width="1200"
												height="1200"
												style="width: auto; height: auto;"
												src={user.assets.parentPermissionSrc.public_id}
												alt="request-image"
											/>
										</div>
										<label class="modal-backdrop" for={`asset_model_${i}_${i}`}>Close</label>
									</div>
								{/if}

								{#if user.assets.paymentReceiptSrc != null}
									<input type="checkbox" id={`asset_model_${i}_${i + 1}`} class="modal-toggle" />
									<div class="modal" role="dialog">
										<div class="modal-box">
											<CldImage
												width="1200"
												height="1200"
												style="width: auto; height: auto;"
												src={user.assets.paymentReceiptSrc.public_id}
												alt="request-image"
											/>
										</div>
										<label class="modal-backdrop" for={`asset_model_${i}_${i + 1}`}>Close</label>
									</div>
								{/if}
								<td class="grid place-content-center h-full">
									<label for={`sendback_model_${i}`} class=" btn btn-sm">ตอบกลับ</label>
								</td>
								<td class="">
									<button on:click={() => onDeleteUser(user)} class=" btn btn-error btn-sm"
										>ลบ</button
									>
								</td>

								<input type="checkbox" id={`sendback_model_${i}`} class="modal-toggle" />
								<div class="modal" role="dialog">
									<div class="modal-box">
										<SendNotificationForm action="CREATE" userEditor={user} />
									</div>
									<label class="modal-backdrop" for={`sendback_model_${i}`}>Close</label>
								</div>
							</tr>
						{/each}
					</tbody>
				</table>
				<div class="">
					<Paginator
						active="text-white bg-white"
						bind:settings={paginationSettings}
						buttonClasses="btn btn-ghost btn-sm rounded-btn"
						showFirstLastButtons={false}
						showPreviousNextButtons={true}
					/>
				</div>
			</div>
		{:else}
			<!-- else content here -->
			<div class="grid h-screen px-4 place-content-center">
				<h1 class="tracking-widest text-xl text-gray-500 uppercase">ยังไม่มีข้อมูลในขณะนี้</h1>
			</div>
		{/if}
	</section>
{:catch errors}
	<Error550 {errors} />
{/await}
