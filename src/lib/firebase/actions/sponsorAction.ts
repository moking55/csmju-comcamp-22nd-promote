import { writable } from 'svelte/store';
import { initFirebase } from '../config';
import { FirebaseError } from 'firebase/app';
import {
	query,
	collection,
	getDocs,
	orderBy,
	addDoc,
	deleteDoc,
	doc,
	updateDoc,
	Timestamp
} from 'firebase/firestore';

const { db } = initFirebase();

export type SponsorData = {
	name: string;
	created_at: Timestamp;
	position: string | null;
	donateAmount: number | null;
	from: string | null;
	donateDate: Timestamp | null;
};

export type Sponsor = SponsorData & { uId: string };

export const sponsorStore = writable<Sponsor[]>([]);

export async function getSponsorList(): Promise<Sponsor[]> {
	try {
		const q = query(collection(db, 'sponsorList'), orderBy('created_at', 'asc'));
		return (await getDocs(q)).docs.map((doc) => ({ uId: doc.id, ...(doc.data() as SponsorData) }));
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

export async function addSponsor(data: SponsorData) {
	try {
		const ref = collection(db, 'sponsorList');
		const sponsor = await addDoc(ref, data);
		return sponsorStore.update((sponsors) => [...sponsors, { ...data, uId: sponsor.id }]);
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

export async function deleteSponsor(uId: string) {
	try {
		await deleteDoc(doc(db, 'sponsorList', uId));
		return sponsorStore.update((sponsors) => sponsors.filter((sponsor) => sponsor.uId !== uId));
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

export async function updateSponsor(uId: string, data: SponsorData) {
	try {
		console.log(uId, data);
		await updateDoc(doc(db, 'sponsorList', uId), data);
		const sponsors = await getSponsorList();
		return sponsorStore.set(sponsors);
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}
