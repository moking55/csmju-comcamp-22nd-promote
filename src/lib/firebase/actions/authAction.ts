import type { FirebaseError } from 'firebase/app';
import type { User } from 'firebase/auth';
import {
	createUserWithEmailAndPassword,
	signOut,
	signInWithEmailAndPassword,
	sendPasswordResetEmail
} from 'firebase/auth';
import { writable } from 'svelte/store';
import { initFirebase } from '../config';

export const auth = writable<User | null>(null);

// Create a function to handle user authentication with email and password
export const signUpUserWithEmail = async (email: string, password: string) => {
	const { auth } = initFirebase();
	return createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			return userCredential.user;
		})
		.catch((error: FirebaseError) => {
			throw error;
		});
};

export const signInUserWithEmail = async (email: string, password: string) => {
	const { auth } = initFirebase();
	return signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			return userCredential.user;
		})
		.catch((error: FirebaseError) => {
			throw error;
		});
};

// Create a function to handle user sign out
export const signOutUser = async () => {
	const { auth } = initFirebase();
	try {
		return await signOut(auth);
	} catch (error: unknown) {
		throw new Error(error as string);
	}
};

export const onSendPasswordResetEmail = async (email: string) => {
	const { auth } = initFirebase();
	await sendPasswordResetEmail(auth, email).catch((error: FirebaseError) => {
		if (import.meta.env.VITE_DEV_MODE === 'true') console.error(error);
		throw error;
	});
};
