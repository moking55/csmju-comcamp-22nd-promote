import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Create a function to handle user authentication with email and password
export const authenticateUserWithEmail = async (email: string, password: string) => {
	const auth = getAuth();
	try {
		const result = await createUserWithEmailAndPassword(auth, email, password);
		// Return the user's information
		return result.user;
	} catch (error: unknown) {
		throw new Error(error as string);
	}
};

// Create a function to handle user sign out
export const signOutUser = async () => {
	const auth = getAuth();

	try {
		return await signOut(auth);
	} catch (error: unknown) {
		throw new Error(error as string);
	}
};
