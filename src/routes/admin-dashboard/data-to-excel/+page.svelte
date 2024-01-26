<script context="module" lang="ts">
	import { timeline } from '$lib/data';
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
		},
		LISTS: {
			name: 'ชื่อ',
			userEmail: 'อีเมล์ติดต่อ',
			school: 'โรงเรียน',
			title: 'หัวข้อการชำระ',
			fileAttachmentSrc: 'ลึ้งรูปภาพหลักฐานการชำระ',
			date: 'วันที่ส่ง'
		}
	};
</script>

<script lang="ts">
	import {
		DataToExcelExporter,
		DataToExcelExporterWithXLSX
	} from '$lib/services/micro-services/data-to-excel-service';
	import { Toast } from '$lib/middleware/alertConfig';
	import { type List, getList, type ListData } from '$lib/firebase/admin-actions/adminListAction';
	import { cld, cloudinaryConfig } from '$lib/config/cloundinary';
	import { Timestamp } from 'firebase/firestore';

	const dataExportOpt = [
		{
			value: 'USER',
			label: 'ข้อมูลผู้ลงทะเบียน'
		},
		{
			value: 'LISTS',
			label: 'ข้อมูลรายการชำระเงิน'
		}
	];

	const opts = {
		USER: {
			complete: 'ผ่านการคัดเลือก'
		},
		LISTS: {
			หลักฐานการชำระ: 'หลักฐานการชำระ',
			ผู้ปกครอง: 'หลักฐานยินยอมจากผู้ปกครอง'
		}
	};

	let valueBind: {
		dataType: keyof typeof filterType | null;
		fields: ReturnType<typeof getKeyAsArray> | string[];
		optsFields: ReturnType<typeof getKeyAsArray> | string[];
	} = {
		dataType: null,
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
			await exportDataAsXLSX(
				valueBind.fields,
				valueBind.dataType as Exclude<keyof typeof filterType, 'USER'>
			);
		}

		onLoading = false;
		clearInput();
	}

	async function exportDataWithService<T extends string[]>(fields: T) {
		const actualFields =
			fields.length === 0 ? getKeyAsArray(filterType[valueBind.dataType!]) : fields;

		const params = {
			arr: actualFields,
			opts: valueBind.optsFields.length > 0 ? valueBind.optsFields : undefined
		};

		await DataToExcelExporter(params.arr, params.opts).then(() => {
			Toast.fire({
				icon: 'success',
				title: 'ดาวน์โหลดข้อมูลสำเร็จ'
			});
		});

		return actualFields;
	}

	async function exportDataAsXLSX<T extends string[]>(
		fields: T,
		dataType: Exclude<keyof typeof filterType, 'USER'>
	) {
		let data: any[] = [];
		if (dataType === 'LISTS') {
			data = await getList();
			if (valueBind.optsFields.length > 0) {
				data = (data as List[]).filter((d) => valueBind.optsFields.includes(d.data.title));
			}
		}

		//! filter rules

		const keys = <Array<keyof typeof filterType[typeof dataType]>>(
			(fields.length < 1
				? Object.keys(filterType[dataType])
				: Object.keys(filterType[dataType]).filter((key) => fields?.includes(key)))
		);

		//  An array of keys
		let actualFields = data.map((d) => {
			let obj = {} as typeof filterType[typeof dataType];
			keys.forEach((key) => {
				obj[filterType[dataType][key] as keyof typeof filterType[typeof dataType]] =
					d.data[key] instanceof Timestamp
						? (d.data[key] as Timestamp).toDate().toLocaleDateString()
						: String(d.data[key]);
			});

			if (dataType === 'LISTS') {
				// TODO: it can work, but it just conflict with type definition
				if (obj['ลึ้งรูปภาพหลักฐานการชำระ']) {
					cloudinaryConfig();
					obj['ลึ้งรูปภาพหลักฐานการชำระ'] = $cld?.image(d.data['fileAttachmentSrc']).toURL() ?? '';
				}
			}
			return obj;
		});

		await DataToExcelExporterWithXLSX(actualFields, dataType).then(() => {
			Toast.fire({
				icon: 'success',
				title: 'ดาวน์โหลดข้อมูลสำเร็จ'
			});
		});

		return fields;
	}

	function clearInput() {
		valueBind.fields = [];
		valueBind.optsFields = [];
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
						{#each getKeyAsArray(opts[valueBind.dataType]) as f}
							<label class="label cursor-pointer">
								<span class="label-text">{opts[valueBind.dataType][f]}</span>
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
