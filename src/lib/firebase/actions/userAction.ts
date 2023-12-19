import {
	doc,
	setDoc,
	getDoc,
	Timestamp,
	orderBy,
	collection,
	query,
	getDocs,
	updateDoc,
	deleteDoc,
	DocumentReference,
	type DocumentData
} from 'firebase/firestore';
import { initFirebase } from '$lib/firebase/config';
import { writable } from 'svelte/store';

import { FirebaseError } from 'firebase/app';
import type { List, ListData } from '../admin-actions/adminListAction';
import {
	deleteNotification,
	getNotification,
	sendNotificationToUser,
	type NotificationData
} from './notificationAction';
import { deleteFile } from '$lib/config/cloundinary';
import { mailSender, type MailData } from '$lib/services/micro-services/mail-service';
import Delta from 'quill-delta';

const { db } = initFirebase();

export type User = {
	uId: string;
	email: string;
	info: UserInfo;
	assets: UserAssets;
	status: boolean;
	role: 'User' | 'Admin';
	config: {
		lateEvidenceSubmitted: {
			timestampAfterChecked: Timestamp | null;
		};
	};
	created_at: Timestamp;
	update_at?: Timestamp;
};

export type UserInfo = {
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
	contacts: {
		contractEmail: string;
		facebookLink: string;
		lineId: string;
		parentContact: string;
		otherContact?: string;
	};
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
		config: {
			lateEvidenceSubmitted: {
				timestampAfterChecked: null
			}
		},
		created_at: Timestamp.now(),
		status: false,
		role: 'User'
	});
}

export async function updateUserData(uId: string, userInfo: UserInfo) {
	try {
		const ref = doc(db, 'users', uId);
		return await updateDoc(ref, { info: userInfo });
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

export async function getUserList() {
	try {
		const q = query(collection(db, 'users'), orderBy('created_at', 'desc'));
		const snapshot = await getDocs(q);

		const users = <User[]>snapshot.docs
			.filter((doc) => {
				const user = doc.data() as User;
				return user.role === 'User';
			})
			.map((doc) => doc.data());
		return users;
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

export async function deleteUserDataAndAssociatedStuff(user: User) {
	try {
		const { db } = initFirebase();
		// delete cloudinary image
		const { paymentReceiptSrc, parentPermissionSrc } = user.assets;

		if (paymentReceiptSrc) {
			await deleteFile(paymentReceiptSrc, user.uId, 'RECEIPT');
		}

		if (parentPermissionSrc) {
			await deleteFile(parentPermissionSrc, user.uId, 'PARENT');
		}

		deleteDoc(doc(db, 'users', user.uId))
			.then(async () => {
				// delete thier notification and list

				const querySnapshot = (await getDocs(collection(db, 'listRequest'))).docs;
				const list: List[] = querySnapshot.map((doc) => {
					return { uId: doc.id, data: doc.data() as ListData };
				});
				const listToDelete = list.filter((item) => item.uId === user.uId);
				for (const item of listToDelete) {
					await deleteDoc(doc(db, 'listRequest', item.uId));
				}
				const notification = await getNotification(user.uId);

				for (const item of notification) {
					await deleteNotification(item);
				}

				const users = await getUserList();
				userListStore.set(users);
				return;

				//- for deleting user auth credential
				// const { auth } = initFirebase();
				// const user = auth.currentUser;
				// if (user) {
				// 	await deleteUser(user);
				// 	userListStore.set(users);
				// 	return;
				// }
				// throw new Error('User credential not found');
			})
			.catch((error: FirebaseError) => {
				throw error;
			});
	} catch (error) {
		throw new Error(error as string);
	}
}
export async function markAsConfirm(uid: string) {
	try {
		const ref = doc(db, 'users', uid);

		return await Promise.all([
			updateDoc(ref, { status: true }),
			sendNotificationAndEmailForConfirmation(ref),
			userListStore.update((list) => {
				return list.map((item) => {
					if (item.uId === uid) {
						return { ...item, status: true };
					}
					return item;
				});
			})
		]);
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

async function sendNotificationAndEmailForConfirmation(
	ref: DocumentReference<DocumentData, DocumentData>
) {
	try {
		const user = (await getDoc(ref)).data() as User;
		if (!user) throw new Error('User not found');

		const msg = {
			title: `ผ่านการเข้าร่วม Comcamp CSMJU: ยินดีต้อนรับสู่ครอบครัว Comcamp CSMJU คนใหม่!! ✨🟢`,
			description: `สวัสดีครับน้อง ${
				user.info.name
			} ข้อความนี้มาจากพวกพี่ "โครงการค่ายยุวชนคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้" นะครับ 

พี่จะมีข่าวดีมาฝากว่า ตอนนี้น้องได้ติดค่าย Comcamp CSMJU เป็นที่เรียบร้อยแล้ว

โดยยหลักฐานยืนยันต่าง ๆ และ ข้อมูลของน้องผ่านการตรวจสอบจากพวกพี่เป็นที่เรียบร้อยแล้ว ซึ่งผ่านเกณฑ์การเข้าร่วมที่ระบุไว้อย่างครบถ้วน 🟢

ขอขอบคุณน้อง ๆ ที่ให้ความร่วมกับพวกพี่ ๆ และยินดีด้วยนะ! ✨✨ เพราะน้องคือหนึ่งในผู้โชคดีที่จะได้เข้ามาสัมผัสประสบการณ์สุดเข้มข้น เรียนรู้ทักษะใหม่ๆ ร่วมกับเพื่อนๆ ที่มี Passion เดียวกัน  เตรียมตัวก้าวสู่เส้นทางสายคอมพิวเตอร์ที่สดใสไปด้วยกันเลย 💻 😄

เพื่อไม่พลาดโอกาสที่จะได้รับข่าวสารต่างๆ ของค่ายและกำหนดการเปิดค่าย พี่มีภารกิจสำคัญมาฝากน้องๆ ก่อนนะ โดย

1. บุกเข้ากรุ๊ป Facebook ของค่าย facebook.com/CCCSMJU เพื่ออัพเดทข่าวสาร พูดคุยกับเพื่อนใหม่ สนุกสนานกันล่วงหน้า
2. อย่าลืมโหลดกำหนดการของทางค่ายเพื่อติดตามตารางกิจกรรม และเตรียมตัวก่อนเข้าค่ายให้พร้อม โดยดาวน์โหลดได้ที่เว็บ ${'comcamp.csmju.com'} บนหน้าแดชบอร์ดของบัญชีน้อง ๆ แล้วกดดาวโหลดตรง "กำหนดการ" ได้เลยนะครับ

พี่ๆ Staff Comcamp CSMJU รอต้อนรับน้องๆ สู่ครอบครัวคอมพิวเตอร์สุดเจ๋งอยู่นะ! 🤩🤩

ขอบคุณที่ให้ความร่วมมือนะครับ แล้วอย่าลืมติดตามข่าวสารของค่ายได้ที่เพจ facebook.com/CCCSMJU และสถานะของตัวเองได้ที่เว็บไซต์ ${'comcamp.csmju.com'} แล้วเจอกันในค่ายน๊าาา  💚🤍💛`
		};

		const notification: NotificationData = {
			userUid: user.uId,
			toUserName: user.info.name,
			toUserEmail: user.info.contacts.contractEmail,
			title: msg.title,
			description: JSON.stringify(new Delta().insert(msg.description)),
			created: Timestamp.now()
		};

		const emailData: MailData = {
			to: user.info.contacts.contractEmail,
			from: 'comcamp.22nd@gmail.com',
			subject: msg.title,
			text: msg.description
		};

		return await Promise.all([sendNotificationToUser(notification), mailSender(emailData)]);
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
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
