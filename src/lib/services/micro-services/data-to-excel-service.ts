import type { User } from '$lib/firebase/actions/userAction';

export type UserDataFilterArray = (keyof User)[];

type Options = {
	paidOnly: boolean;
};

export function DataToExcelExporter<T extends UserDataFilterArray | string[]>(
	opt?: Options,
	filterArray?: T,
) {
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

		if (opt?.paidOnly && UserDataTypeChecker(filterArray)) {
			service += `&paidOnly=${opt.paidOnly}`;
		}
	}

	return fetch(service, {
		method: 'GET'
	}).catch((error) => {
		throw new Error(error as string);
	});
}

function UserDataTypeChecker(data: string[]): data is UserDataFilterArray {
	if (data && Array.isArray(data)) {
		const userKeys = Object.keys(UserDataTypeChecker);
		return data.every((value) => userKeys.includes(value));
	}
	return false;
}
