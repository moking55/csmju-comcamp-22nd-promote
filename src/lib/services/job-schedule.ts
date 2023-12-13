import {
	sendNotificationToUser,
	type NotificationData
} from '$lib/firebase/actions/notificationAction';

import { getUserList } from '$lib/firebase/actions/userAction';
import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import Delta from 'quill-delta';
import { mailSender, type MailData } from './micro-services/mail-service';
import { FirebaseError } from 'firebase/app';
import { initFirebase } from '$lib/firebase/config';

export async function evidenceLateSender() {
	try {
		const users = await getUserList();

		const lateSubmitter = users.filter((user) => {
			const lateSubmittedOn = {
				payment: user.assets.paymentReceiptSrc === null,
				parent: user.assets.parentPermissionSrc === null
			};

			if (lateSubmittedOn.payment || lateSubmittedOn.parent) {
				const now = Timestamp.now();
				const diffTime = Math.abs(now.seconds - user.created_at.seconds);
				const diffDays = Math.ceil(diffTime / (60 * 60 * 24));
				return diffDays >= 5;
			}
		});

		await Promise.all(
			lateSubmitter.map(async (user) => {
				const { config } = user;

				if (
					config.lateEvidenceSubmitted.timestampAfterChecked === null ||
					config.lateEvidenceSubmitted.timestampAfterChecked.seconds < Timestamp.now().seconds
				) {
					const now = Timestamp.now();
					const threeDaysInSeconds = 3 * 24 * 60 * 60; // 3 days in seconds
					const timestampAfterChecked = new Timestamp(
						now.seconds + threeDaysInSeconds,
						now.nanoseconds
					);

					const { db } = initFirebase();

					const userRef = doc(db, 'users', user.uId);
					await updateDoc(userRef, {
						config: {
							lateEvidenceSubmitted: {
								timestampAfterChecked
							}
						}
					});

					const lateSubmittedOn = {
						payment: user.assets.paymentReceiptSrc === null,
						parent: user.assets.parentPermissionSrc === null
					};

					const message = (topic: 'payment' | 'parent') => {
						return {
							title: `แจ้งเตือน: ส่ง${
								topic === 'parent' ? 'หลักฐานยืนยันจากผู้ปกครอง' : 'หลักฐานการชำระ'
							} ช้าเกินกว่าที่กำหนด (5 วันหลังจากการลงทะเบียน)`,
							description: `สวัสดีครับน้อง ${
								user.info.name
							} ข้อความนี้มาจากพวกพี่ "โครงการค่ายยุวชนคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้" นะครับ

		พอดีพี่ ๆ ได้ทำการตรวจสอบพบว่า ${
			topic === 'parent' ? 'หลักฐานยืนยันจากผู้ปกครอง' : 'หลักฐานการชำระ'
		} ของน้องยังไม่ได้ถูกส่งมาให้พวกพี่ได้ตรวจสอบ จึงขอแจ้งเตือนว่าน้องช่วยส่งหลักฐานมาให้พวกพี่ ๆ เพื่อจะได้ตรวจสอบและดำเนินการตามขั้นตอนต่อไป ดังนั้นพี่จะขอเลื่อนการส่งหลักฐานสำหรับน้องให้ภายในวันที่ ${timestampAfterChecked
								.toDate()
								.toLocaleDateString()} นะครับ

		ซึ่งสามารถส่งหลักฐานได้ที่เว็บ โครงการค่ายยุวชนคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้ ${'https://comcamp.csmju.com'} ในบัญชีที่น้องได้สมัครไว้ได้เลย

		หากมีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม สามารถติดต่อ พี่โอม ได้ที่ 095-658-5160

		ขอขอบคุณสำหรับความร่วมมือครับ ^^`
						};
					};

					if (lateSubmittedOn.parent) {
						const notificationData: NotificationData = {
							userUid: user.uId,
							toUserName: user.info.name,
							toUserEmail: user.info.contacts.contractEmail,
							title: message('parent').title,
							description: JSON.stringify(new Delta().insert(message('parent').description)),
							created: Timestamp.now()
						};

						const emailSender: MailData = {
							to: user.info.contacts.contractEmail,
							from: 'comcamp.22nd@gmail.com',
							subject: message('parent').title,
							text: message('parent').description
						};

						await sendNotificationToUser(notificationData);
						await mailSender(emailSender);
					}

					if (lateSubmittedOn.payment) {
						const notificationData: NotificationData = {
							userUid: user.uId,
							toUserName: user.info.name,
							toUserEmail: user.info.contacts.contractEmail,
							title: message('payment').title,
							description: JSON.stringify(new Delta().insert(message('parent').description)),
							created: Timestamp.now()
						};
						const emailSender: MailData = {
							to: user.info.contacts.contractEmail,
							from: 'comcamp.22nd@gmail.com',
							subject: message('payment').title,
							text: message('payment').description
						};

						await sendNotificationToUser(notificationData);
						await mailSender(emailSender);
					}
				}
			})
		);
	} catch (error) {
		if (import.meta.env.VITE_DEV_MODE === 'true') console.error(error);
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}
