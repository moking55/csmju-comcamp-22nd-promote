import type { FirebaseError } from 'firebase/app';

export default function FirebaseErrorHandle(err: FirebaseError) {
	if (import.meta.env.VITE_DEV_MODE === 'true') console.error(err);
	switch (err.code) {
		case 'auth/user-not-found':
			return 'ไม่พบผู้ใช้งานนี้ในระบบ';
		case 'auth/invalid-login-credentials':
			return 'รหัสผ่านไม่ถูกต้อง';
		case 'auth/email-already-in-use':
			return 'อีเมลนี้มีผู้ใช้งานแล้ว';
		case 'auth/email-already-exists':
			return 'อีเมลนี้มีผู้ใช้งานแล้ว';
		case 'auth/invalid-email':
			return 'อีเมลไม่ถูกต้อง';
		case 'auth/weak-password':
			return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
		case 'auth/operation-not-allowed':
			return 'ไม่สามารถใช้งานระบบนี้ได้';
		case 'auth/invalid-password	':
			return 'รหัสผ่านไม่ถูกต้อง';
		default:
			return err.message;
	}
}
