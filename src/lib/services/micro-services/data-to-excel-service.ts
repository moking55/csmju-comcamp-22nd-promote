import { filterType } from '../../../routes/admin-dashboard/data-to-excel/+page.svelte';

type Options = ['complete'];

export function DataToExcelExporter<T extends string[]>(opt?: Options, filterArray?: T) {
	let service = import.meta.env.VITE_EXCEL_DATA_EXPORTER_API_SERVICE as string;
	if (service === undefined) {
		throw new Error('API Service is not defined');
	}
	if (service.endsWith('/')) {
		service = service.slice(0, -1);
	}

	if (filterArray) {
		const filter = filterArray.join(',');
		service += `?filter=${filter}`;

		if (opt?.includes('complete') && UserDataTypeChecker(filterArray)) {
			service += `&paidOnly=$true`;
		}
	}

	return fetch(service, {
		method: 'GET'
	}).catch((error) => {
		throw new Error(error as string);
	});
}

function UserDataTypeChecker(data: typeof filterType | string[]): data is typeof filterType {
	if (data && Array.isArray(data)) {
		const userKeys = Object.keys(filterType);
		return data.every((value) => userKeys.includes(value));
	}
	return false;
}

// TODO: Implement data to excel exporter with XLSX
// export function DataToExcelExporterWithXLSX<T>(data:  ) {
// 	const ws = XLSX.utils.json_to_sheet(data);
// 	const wb = XLSX.utils.book_new();
// 	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
// 	XLSX.writeFile(wb, `data-${valueBind.dataType}-${new Date().getTime()}.xlsx`);
// }
