import parentPermissionFile from '$lib/assets/files/parent-permison-image-2.png';
import scheduleImageFile from '$lib/assets/files/schedule.pdf';

const menu = [
	{
		title: 'ข้อมูล',
		path: '/dashboard',
		icon: 'mdi:account'
	},
	{
		title: 'บอร์ดประชาสัมพันธ์',
		path: '/dashboard/public-relations-board',
		icon: 'mdi:account'
	},
	{
		title: 'ส่งหลักฐานการชำระ',
		path: '/dashboard/payment-receipt-submission',
		icon: 'ion:receipt-outline'
	},
	{
		title: 'ส่งหนังสือขออณุญาตผู้ปกครอง',
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
		title: 'แก้ไขรายการประชาสัมพันธ์',
		path: import.meta.env.VITE_DASHBOARD_BOARD_LISTS_ON_ADMIN_PATH,
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
		title: 'หนังสือขออณุญาตผู้ปกครอง.',
		src: parentPermissionFile,
		icon: 'ph:image-light'
	},
	{
		title: 'กำหนดการ',
		src: scheduleImageFile,
		icon: 'dashicons:pdf'
	}
];

export { menu, filesDownloader, adminMenu };
