import { filterType } from '../../../routes/admin-dashboard/data-to-excel/+page.svelte';
import { writeFileXLSX, set_fs, set_cptable, utils } from 'xlsx';
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import * as fs from 'fs';

type Options = ['complete'];

export async function DataToExcelExporter<T extends string[]>(filterArray: T, opts?: Options) {
	let service = import.meta.env.VITE_EXCEL_DATA_EXPORTER_API_SERVICE as string;
	let filter = '';

	if (service === undefined) {
		throw new Error('API Service is not defined');
	}
	if (service.endsWith('/')) {
		service = service.slice(0, -1);
	}

	if (filterArray) {
		filter = filterArray.join(',');
		service += `?filter=${filter}`;

		if (opts?.includes('complete') && UserDataTypeChecker(filterArray)) {
			service += `&paidOnly=true`;
		}
	}

	try {
		return await fetch(service, {
			method: 'GET'
		});
	} catch (error) {
		throw new Error(error as string);
	}
}

function UserDataTypeChecker(
	data: string[] | keyof typeof filterType['USER']
): data is keyof typeof filterType['USER'] {
	if (data && Array.isArray(data)) {
		const userKeys = Object.keys(filterType['USER']);
		return data.every((value) => userKeys.includes(value));
	}
	return false;
}

// TODO: Implement data to excel exporter with XLSX
export async function DataToExcelExporterWithXLSX<T extends object[]>(
	filtersArray: T,
	dataType: string
) {
	return new Promise((resolve) => {
		console.log(filtersArray, dataType);
		set_fs(fs);
		set_cptable(cpexcel);

		const ws = utils.json_to_sheet(filtersArray);
		const wb = utils.book_new();

		utils.book_append_sheet(wb, ws, 'Sheet1');
		writeFileXLSX(wb, `data-${dataType}-${new Date().getTime()}.xlsx`);
		resolve(null);
	}).catch((error) => {
		throw new Error(error as string);
	});
}
