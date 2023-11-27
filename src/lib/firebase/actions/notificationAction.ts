import { writable } from 'svelte/store';
import { initFirebase } from '$lib/firebase/config';
import Delta from 'quill-delta';

import {
	Timestamp,
	addDoc,
	collection,
	orderBy,
	query,
	getDocs,
	doc,
	updateDoc,
	where
} from 'firebase/firestore';

const { db } = initFirebase();

export type Notification = { uId: string } & NotificationData;
export type NotificationData = {
	userUid: string;
	toUserName: string;
	toUserEmail: string;
	title: string;
	description: Delta | string;
	created: Timestamp;
	lastDateEdit?: Timestamp;
};

export const notificationStore = writable<Notification[]>([]);

export async function getNotification(userUid?: string) {
	try {
		const ref = collection(db, 'notification');
		let queryRef;
		if (!userUid) {
			queryRef = query(ref, orderBy('created'));
		} else {
			queryRef = query(ref, where('userUid', '==', userUid), orderBy('created'));
		}
		const data = await getDocs(queryRef);
		const notification = data.docs.map((doc) => ({
			...(doc.data() as Notification),
			description: new Delta(JSON.parse(doc.data().description)),
			uId: doc.id
		}));
		return notification;
	} catch (error) {
		throw new Error(error as string);
	}
}

export function sendNotificationToUser(notification: NotificationData) {
	// Add the notification to the "notification" collection
	return addDoc(collection(db, 'notification'), notification);
}

export function updateNotification(notification: Notification) {
	const ref = doc(db, 'notification', notification.uId);
	return updateDoc(ref, notification);
}
