import { Toast } from '$lib/middleware/alertConfig';
import { FirebaseError } from 'firebase/app';
import FirebaseErrorHandle from './fbErrorHandle';

export default function handler(error: FirebaseError | Error, fallbackMsg?: string) {
	if (error instanceof FirebaseError) {
		return Toast.fire({
			icon: 'error',
			title: FirebaseErrorHandle(error)
		});
	}
	if (import.meta.env.VITE_DEV_MODE === 'true') {
		console.error(error);
	}
	if (fallbackMsg) {
		return Toast.fire({
			icon: 'error',
			title: fallbackMsg
		});
	}
}
