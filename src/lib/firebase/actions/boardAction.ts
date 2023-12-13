import {
	collection,
	doc,
	getDocs,
	orderBy,
	query,
	updateDoc,
	type Timestamp,
	deleteDoc,
	addDoc
} from 'firebase/firestore';
import Delta from 'quill-delta';
import { writable } from 'svelte/store';
import { initFirebase } from '$lib/firebase/config';
import { FirebaseError } from 'firebase/app';

export type Board = {
	userUid: string;
	useEmail: string;
	title: string;
	description: Delta | string;
	tags: string[];
	created: Timestamp;
	lastDateEdit?: Timestamp;
};

export type BoardList = Board & { uId: string };

const { db } = initFirebase();

export const boardStore = writable<BoardList[]>([]);

export async function addBoard(board: Board) {
	try {
		const ref = collection(db, 'boardList');
		const res = await addDoc(ref, board);
		return res;
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

export async function getBoardList() {
	try {
		const ref = collection(db, 'boardList');
		const data = await getDocs(query(ref, orderBy('created', 'desc')));
		const board = data.docs.map((doc) => ({
			...(doc.data() as Board),
			description: new Delta(JSON.parse(doc.data().description)),
			uId: doc.id
		})) as BoardList[];
		return board;
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

export async function updateBoard(board: BoardList) {
	try {
		const ref = doc(db, 'boardList', board.uId);
		await updateDoc(ref, board);
		const boardList = await getBoardList();
		return boardStore.set(boardList);
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}

export async function deleteBoard(board: BoardList) {
	try {
		await deleteDoc(doc(db, 'boardList', board.uId));
		const boardList = await getBoardList();
		return boardStore.set(boardList);
	} catch (error) {
		if (error instanceof FirebaseError) {
			throw error;
		}
		throw new Error(error as string);
	}
}
