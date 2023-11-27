import parentPermissionFile from '$lib/assets/files/parent-permisson.pdf';
import scheduleImageFile from '$lib/assets/files/schedule-2.png';

const menu = [
	{
		title: 'ข้อมูล',
		path: '/dashboard',
		icon: 'mdi:account'
	},
	{
		title: 'ส่งหลักฐานการชำระ (Soon)',
		path: '/dashboard/payment-receipt-submission',
		icon: 'ion:receipt-outline'
	},
	{
		title: 'ส่งหลักฐานขออณุญาตผู้ปกครอง',
		path: '/dashboard/parent-permission-submission',
		icon: 'mdi:file-document-edit-outline'
	},
	{
		title: 'กล่องแจ้งเตือน',
		path: '/dashboard/notification',
		icon: 'material-symbols:notification-multiple-outline'
	}
];

const adminMenu = [
	{
		title: 'รายการ',
		path: import.meta.env.VITE_DASHBOARD_LISTS_ON_ADMIN_PATH,
		icon: 'line-md:list-3'
	},
	{
		title: 'รายการที่ตอบกลับแล้ว',
		path: import.meta.env.VITE_DASHBOARD_SENT_LISTS_ON_ADMIN_PATH,
		icon: 'line-md:check-list-3'
	},
	{
		title: 'รายชื่อผู้สมัคร',
		path: import.meta.env.VITE_DASHBOARD_USER_LISTS_ON_ADMIN_PATH,
		icon: 'line-md:check-list-3'
	}
];

const filesDownloader = [
	{
		title: 'ไฟล์ขออณุญาต ผปค.',
		src: scheduleImageFile,
		icon: 'ph:image-light'
	},
	{
		title: 'ไฟล์กำหนดการ',
		src: parentPermissionFile,
		icon: 'dashicons:pdf'
	}
];

export { menu, filesDownloader, adminMenu };
