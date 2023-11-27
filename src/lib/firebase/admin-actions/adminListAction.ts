import { Timestamp, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';
import type { CloudinaryAssets, User } from '../actions/userAction';
import { collection, addDoc } from 'firebase/firestore';
import { initFirebase } from '$lib/firebase/config';

const { db } = initFirebase();

type ListData = {
	userUid: string;
	userEmail: string;
	name: string;
	school: string;
	title: string;
	fileAttachmentSrc: string;
	date: Timestamp;
	read: boolean;
};

export type List = {
	uId: string;
	data: ListData;
};

export const listStore = writable<List[]>([]);

export async function addOnList(userData: User, fileAttachmentSrc: string, title: string) {
	const ListData: ListData = {
		userUid: userData.uId,
		userEmail: userData.email,
		name: userData.info.name,
		school: userData.info.school,
		title,
		fileAttachmentSrc,
		date: Timestamp.now(),
		read: false
	};

	await addDoc(collection(db, 'listRequest'), ListData);
}

export async function deleteListWhenFileHadRemove(asset: CloudinaryAssets) {
	try {
		const querySnapshot = (await getDocs(collection(db, 'listRequest'))).docs;
		const list: List[] = querySnapshot.map((doc) => {
			return { uId: doc.id, data: doc.data() as ListData };
		});
		const listToDelete = list.find((item) => item.data.fileAttachmentSrc === asset.public_id);
		if (!listToDelete) {
			if (import.meta.env.VITE_DEV_MODE === 'true') {
				console.error('ERROR: listToDelete expected to be not null, but got null');
			}
			return null;
		}
		const res = await deleteDoc(doc(db, 'listRequest', listToDelete.uId));
		return res;
	} catch (error) {
		throw new Error(error as string);
	}
}

export async function getList() {
	const querySnapshot = (await getDocs(collection(db, 'listRequest'))).docs;
	const list: List[] = querySnapshot.map((doc) => {
		return { uId: doc.id, data: doc.data() as ListData };
	});
	return list;
}
export function markAsRead(uid: string) {
	const ref = doc(db, 'listRequest', uid);
	updateDoc(ref, { read: true }).then(() => {
		const list = listStore.update((list) => {
			return list.map((item) => {
				if (item.uId === uid) {
					return { ...item, data: { ...item.data, read: true } };
				}
				return item;
			});
		});
		return list;
	});
}
