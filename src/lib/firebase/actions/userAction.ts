import {
	doc,
	setDoc,
	getDoc,
	Timestamp,
	orderBy,
	collection,
	query,
	getDocs,
	updateDoc
} from 'firebase/firestore';
import { initFirebase } from '$lib/firebase/config';
import { writable } from 'svelte/store';

const { db } = initFirebase();

export type User = {
	uId: string;
	email: string;
	info: UserInfo;
	assets: UserAssets;
	status: boolean;
	role: 'User' | 'Admin';
	created_at: Timestamp;
	update_at?: Timestamp;
};

export type UserInfo = {
	contractEmail: string;
	name: string;
	school: string;
	prefix: string;
	age: number;
	nickname: string;
	birthDate: Timestamp;
	phone: string;
	shirtSize: string;
	eduLevel: string;
	congenitalDisease: string;
	foodAllergy: string;
	drugAllergy: string;

	haveLaptop: boolean;
	reasonForJoining: string;
};

export type UserAssets = {
	paymentReceiptSrc: CloudinaryAssets;
	parentPermissionSrc: CloudinaryAssets;
};

export type CloudinaryAssets = {
	public_id: string;
	signature: string;
	timestamp: number;
};

export const userData = writable<User | null>(null);
export const userListStore = writable<User[]>([]);

export async function checkAndSetUserData(uId: string) {
	const userInfo = (await getDoc(doc(db, 'users', uId))).data() as User | undefined;
	if (!userInfo) return null;
	userData.set(userInfo);
	return userInfo;
}

export async function createUserData(uId: string, email: string, userInfo: UserInfo) {
	return await setDoc(doc(db, 'users', uId), {
		uId,
		email,
		info: userInfo,
		assets: {
			paymentReceiptSrc: null,
			parentPermissionSrc: null
		},
		created_at: Timestamp.now(),
		status: false,
		role: 'User'
	});
}

export async function getUserList() {
	const q = query(collection(db, 'users'), orderBy('created_at'));
	const snapshot = await getDocs(q);

	const users = <User[]>snapshot.docs
		.filter((doc) => {
			const user = doc.data() as User;
			return user.role === 'User';
		})
		.map((doc) => doc.data());
	return users;
}

export function markAsConfirm(uid: string) {
	const ref = doc(db, 'users', uid);
	updateDoc(ref, { status: true }).then(() => {
		const users = userListStore.update((list) => {
			return list.map((item) => {
				if (item.uId === uid) {
					return { ...item, status: true };
				}
				return item;
			});
		});
		return users;
	});
}

//- unused because the "derived" function can't be perform with synchronous function especially when store need to be set before it gets derived
// export function userDataDerived(callback: () => void) {
// 	return derived<typeof authStore, User | null>(
// 		authStore,
// 		($userStore, set) => () => {
// 			const { db } = initFirebase();
// 			Promise.resolve(callback()).then(async () => {
// 				const userInfo = (await getDoc(doc(db, 'users', $userStore!.uid))).data() as User | null;
// 				if (!userInfo) {
// 					set(null);
// 					return;
// 				} else {
// 					set(userInfo);
// 				}
// 			});
// 		},
// 		null
// 	);
// }
