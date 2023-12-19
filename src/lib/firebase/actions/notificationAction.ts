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
	where,
	deleteDoc
} from 'firebase/firestore';
import type Quill from 'quill';
import { mailSender, type MailData } from '$lib/services/micro-services/mail-service';
import { FirebaseError } from 'firebase/app';

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
			queryRef = query(ref, orderBy('created', 'desc'));
		} else {
			queryRef = query(ref, where('userUid', '==', userUid), orderBy('created', 'desc'));
		}
		const data = await getDocs(queryRef);
		const notification = data.docs.map((doc) => ({
			...(doc.data() as Notification),
			description: new Delta(JSON.parse(doc.data().description)),
			uId: doc.id
		})) as Notification[];
		return notification;
	} catch (error) {
		throw new Error(error as string);
	}
}

export async function sendNotificationToUser(notification: NotificationData, quill?: Quill) {
	try {
		await addDoc(collection(db, 'notification'), notification);
		if (quill) {
			const emailData: MailData = {
				to: notification.toUserEmail,
				from: 'comcamp.22nd@gmail.com',
				subject: notification.title,
				text: quill.getText()
			};
			await mailSender(emailData);
		}
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

export function deleteNotification(notification: Notification) {
	const ref = doc(db, 'notification', notification.uId);
	return deleteDoc(ref);
}

export function updateNotification(notification: Notification) {
	const ref = doc(db, 'notification', notification.uId);
	return updateDoc(ref, notification);
}
