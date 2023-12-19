import { Timestamp, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';
import type { CloudinaryAssets, User } from '../actions/userAction';
import { collection, addDoc } from 'firebase/firestore';
import { initFirebase } from '$lib/firebase/config';
import { sendNotificationToUser, type NotificationData } from '../actions/notificationAction';
import Delta from 'quill-delta';
import { mailSender, type MailData } from '$lib/services/micro-services/mail-service';
import { FirebaseError } from 'firebase/app';

const { db } = initFirebase();

export type ListData = {
	userUid: string;
	userEmail: string;
	name: string;
	school: string;
	title: 'หลักฐานการชำระ' | 'ผู้ปกครอง';
	fileAttachmentSrc: string;
	date: Timestamp;
	read: boolean;
};

export type List = {
	uId: string;
	data: ListData;
};

export const listStore = writable<List[]>([]);

export async function addOnList(
	userData: User,
	fileAttachmentSrc: string,
	title: 'หลักฐานการชำระ' | 'ผู้ปกครอง'
) {
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
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

export async function getList() {
	try {
		const querySnapshot = (await getDocs(collection(db, 'listRequest'))).docs;
		const list: List[] = querySnapshot.map((doc) => {
			return { uId: doc.id, data: doc.data() as ListData };
		});
		return list;
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}
export function markAsRead(uid: string) {
	try {
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
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

export async function sendNotificationAndMarkAsReads(
	lists: List[],
	sendOpt: 'RECEIPT' | 'PARENT' | 'ALL'
) {
	const filterLists = lists.filter((list) => {
		if (sendOpt === 'ALL') {
			return true;
		} else if (sendOpt === 'RECEIPT') {
			return list.data.title === 'หลักฐานการชำระ';
		} else if (sendOpt === 'PARENT') {
			return list.data.title === 'ผู้ปกครอง';
		}
	});

	const promises = filterLists.map(async (list) => {
		const msg = {
			title: `หลักฐานยืนยัน ${list.data.title} ถูกยืนยันเป็นที่เรียบร้อยแล้ว 🟢`,
			description: `สวัสดีครับน้อง ${
				list.data.name
			} ข้อความนี้มาจากพวกพี่ "โครงการค่ายยุวชนคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้" นะครับ 

พี่จะมาแจ้งข่าวดีว่า หลักฐานยืนยัน ${
				list.data.title
			} ของน้องผ่านการตรวจสอบจากพวกพี่เป็นที่เรียบร้อยแล้ว ตอนนี้รอขั้นตอนต่อไปได้เลยนะ พี่จะแจ้งให้ทราบเร็วๆ นี้ มีอะไรสงสัย อยากถามอะไร ทักมาคุยกับพี่ได้เสมอ รอติดตามข่าวดีอยู่นะ 🫰🏻

ขอบคุณที่ให้ความร่วมมือนะครับ  แล้วอย่าลืมติดตามข่าวสารของค่ายได้ที่เพจ facebook.com/CCCSMJU และสถานะของตัวเองได้ที่เว็บไซต์ ${'comcamp.csmju.com'} แล้วเจอกันในค่ายน๊าาา  💚🤍💛`
		};

		const notification: NotificationData = {
			userUid: list.data.userUid,
			toUserName: list.data.name,
			toUserEmail: list.data.userEmail,
			title: msg.title,
			description: JSON.stringify(new Delta().insert(msg.description)),
			created: Timestamp.now()
		};

		const emailData: MailData = {
			to: list.data.userEmail,
			from: 'comcamp.22nd@gmail.com',
			subject: msg.title,
			text: msg.description
		};

		await sendNotificationToUser(notification);
		await mailSender(emailData);
		markAsRead(list.uId);

		return list;
	});

	return await Promise.all(promises);
}
