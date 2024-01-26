<script context="module" lang="ts">
	export const filterType = {
		USER: {
			prefix: 'คำนำหน้า',
			name: 'ชื่อ',
			school: 'โรงเรียน',
			age: 'อายุ',
			nickname: 'ชื่อเล่น',
			birthDate: 'วันเกิด',
			phone: 'เบอร์โทรศัพท์',
			shirtSize: 'ขนาดเสื้อ',
			eduLevel: 'ระดับการศึกษา',
			congenitalDisease: 'โรคประจำตัว',
			foodAllergy: 'แพ้อาหาร',
			drugAllergy: 'แพ้ยา',
			haveLaptop: 'มีคอมพิวเตอร์ส่วนตัวหรือไม่',
			reasonForJoining: 'เหตุผลในการเข้าร่วม',
			contractEmail: 'อีเมล์ติดต่อ',
			facebookLink: 'ลิงค์ Facebook',
			lineId: 'ไลน์ไอดี',
			parentContact: 'เบอร์โทรศัพท์ผู้ปกครอง',
			otherContact: 'เส้นทางติดต่ออื่น ๆ'
		}
	};
</script>

<script lang="ts">
	import { DataToExcelExporter } from '$lib/services/micro-services/data-to-excel-service';
	import { Toast } from '$lib/middleware/alertConfig';
	const dataExportOpt = [
		{
			value: 'USER',
			label: 'ข้อมูลผู้ลงทะเบียน'
		}
	];

	const opts = {
		complete: 'ผ่านการคัดเลือก'
	};

	let valueBind: {
		dataType: keyof typeof filterType | null;
		optSelected: keyof typeof opts | null;
		fields: ReturnType<typeof getKeyAsArray> | [];
		optsFields: ReturnType<typeof getKeyAsArray> | [];
	} = {
		dataType: null,
		optSelected: null,
		fields: [],
		optsFields: []
	};

	let onLoading = false;

	function getKeyAsArray<T extends object>(obj: T): Array<keyof T> {
		return Object.keys(obj) as Array<keyof T>;
	}

	async function onExportData(dataType: keyof typeof filterType | null, opts?: object) {
		if (valueBind.dataType === null) return;
		onLoading = true;
		if (dataType === 'USER') {
			await exportDataWithService(valueBind.fields);
		} else {
			// TODO: dealing with unsupported data type with XLSX
			await exportDataAsXLSX(valueBind.fields);
		}

		onLoading = false;
		valueBind.fields = [];
	}

	async function exportDataWithService<T extends string[]>(fields: T) {
		const actualFields =
			fields.length === 0 ? getKeyAsArray(filterType[valueBind.dataType!]) : fields;

		const params = {
			arr: actualFields,
			opts: valueBind.optsFields.length > 0 ? valueBind.optsFields : undefined
		};

		await DataToExcelExporter(params.opts, params.arr).then(() => {
			Toast.fire({
				icon: 'success',
				title: 'ดาวน์โหลดข้อมูลสำเร็จ'
			});
		});

		return actualFields;
	}

	async function exportDataAsXLSX<T extends string[]>(fields: T) {
		// TODO: imp

		return fields;
	}
</script>

<section id="data-to-excel" class="">
	<article class="prose prose-sm">
		<h2 class="text-base md:text-2xl">ดาวโหลดข้อมูลเป็น Excel</h2>
	</article>
	<div class="flex w-full justify-between">
		<div class="flex w-full justify-between">
			<div class="space-y-2">
				<p>เลือกข้อมูลที่ต้องการ Export เป็น Excel</p>
			</div>
		</div>
	</div>
	<div class="divider" />
	<div class="grid grid-flow-row gap-4">
		<div class="flex flex-col md:flex-row items-end gap-4 flex-grow-1">
			<label class="grid w-full">
				<div class="label">
					<span class="label-text">เลือกประเภทข้อมูล</span>
				</div>
				<select bind:value={valueBind.dataType} class="select select-bordered">
					<option disabled selected>โปรดเลือก</option>
					{#each dataExportOpt as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</label>
			{#if valueBind.dataType !== undefined}
				<div on:click={() => onExportData(valueBind.dataType)} class="btn btn-accent">
					{#if onLoading}
						<span class="loading" />
					{/if}
					ดาวโหลดข้อมูล
				</div>
			{/if}
		</div>
		{#if valueBind.dataType !== null}
			<div class="divider">ตัวเลือกเสริม</div>
			<div id="options">
				<h1 class="text-base md:text-lg">ตัวกรอง</h1>
				<h2 class="text-sm md:text-base text-base-content/50">ถ้าไม่ต้องการกรองไม่ต้องเลือก</h2>
				<div class="flex flex-col space-y-2">
					<div class="form-control">
						{#each getKeyAsArray(opts) as f}
							<label class="label cursor-pointer">
								<span class="label-text">{opts[f]}</span>
								<input
									type="checkbox"
									value={f}
									bind:group={valueBind.optsFields}
									class="checkbox checkbox-accent"
								/>
							</label>
						{/each}
					</div>
				</div>
			</div>
			<div id="feilds">
				<h1 class="text-base md:text-lg">เลือกฟิลด์ที่ต้องการ</h1>
				<h2 class="text-sm md:text-base text-base-content/50">
					ถ้าต้องการแปลงข้อมูลในฟิลด์ทั้งหมดไม่ต้องเลือก
				</h2>
				<div class="flex flex-col space-y-2">
					<div class="form-control">
						{#each getKeyAsArray(filterType[valueBind.dataType]) as f}
							<label class="label cursor-pointer">
								<span class="label-text">{filterType[valueBind.dataType][f]}</span>
								<input
									type="checkbox"
									value={f}
									bind:group={valueBind.fields}
									class="checkbox checkbox-accent"
								/>
							</label>
						{/each}
					</div>
				</div>
			</div>
			<!-- content here -->
		{:else}
			<!-- else content here -->
		{/if}
	</div>
</section>
