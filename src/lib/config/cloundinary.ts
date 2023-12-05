import { checkAndSetUserData, type CloudinaryAssets } from '$lib/firebase/actions/userAction';
import { initFirebase } from '$lib/firebase/config';
import { Cloudinary } from '@cloudinary/url-gen';
import { doc, updateDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';
import Hashes from 'jshashes';

export const cld = writable<Cloudinary | null>(null);

export const cloudinaryConfig = () => {
	cld.set(new Cloudinary({ cloud: { cloudName: 'dg03o1tta' } }));
};

export async function fileUploader(
	file: File,
	uId: string,
	assetUpload: 'PARENT' | 'RECEIPT'
): Promise<{ publicId: string }> {
	const cloudname = import.meta.env.VITE_CLOUNDINARY_CLOUD_NAME;

	try {
		const formData = new FormData();
		formData.append('upload_preset', 'oszk9qxu');
		formData.append('file', file);

		const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudname}/upload`, {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error(`File upload failed with status: ${response.status}`);
		}

		const result: {
			[key: string]: string | number | boolean;
			public_id: string;
			signature: string;
			created_at: string;
		} = await response.json();

		const assets: CloudinaryAssets = {
			public_id: result.public_id,
			signature: result.signature,
			timestamp: Math.floor(new Date(result.created_at).getTime() / 1000)
		};

		if (assetUpload === 'PARENT') {
			await updateFileUrlOnFirebase(assets, uId, 'assets.parentPermissionSrc');
		} else if (assetUpload === 'RECEIPT') {
			await updateFileUrlOnFirebase(assets, uId, 'assets.paymentReceiptSrc');
		}
		await checkAndSetUserData(uId);

		return { publicId: result.public_id };
	} catch (error) {
		console.error('Error in fileUploader:', error);
		throw error;
	}
}

async function updateFileUrlOnFirebase(
	asset: CloudinaryAssets | null,
	uId: string,
	locate: string
) {
	const { db } = initFirebase();
	const userRef = doc(db, 'users', uId);
	return updateDoc(userRef, Object.assign({}, { [locate]: asset }));
}

export async function deleteFile(
	asset: CloudinaryAssets,
	uId: string,
	assetDelete: 'PARENT' | 'RECEIPT'
) {
	const cloudname = import.meta.env.VITE_CLOUNDINARY_CLOUD_NAME;

	try {
		// Usage

		const params = {
			public_id: asset.public_id,
			timestamp: Math.round(Date.now() / 1000) // Unix timestamp in seconds
		};

		const signature = generateSignature(params, import.meta.env.VITE_CLOUNDINARY_API_SECRET);

		const formData = new FormData();
		formData.append('public_id', asset.public_id);
		formData.append('api_key', import.meta.env.VITE_CLOUNDINARY_API_KEY);
		formData.append('signature', signature);
		formData.append('timestamp', params.timestamp.toString());

		const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudname}/image/destroy`, {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error(`File deletion failed with status: ${response.status}`);
		}

		const result = await response.json();

		if (assetDelete === 'PARENT') {
			await updateFileUrlOnFirebase(null, uId, 'assets.parentPermissionSrc');
		} else if (assetDelete === 'RECEIPT') {
			await updateFileUrlOnFirebase(null, uId, 'assets.paymentReceiptSrc');
		}
		await checkAndSetUserData(uId);

		return result;
	} catch (error) {
		console.error('Error in deleteFile:', error);
		throw error;
	}
}

function generateSignature(params: { [k: string]: unknown }, apiSecret: string) {
	// Create a string with all parameters sorted alphabetically
	const paramString = Object.keys(params)
		.sort()
		.map((key) => `${key}=${params[key]}`)
		.join('&');

	// Hash the string with your API Secret using SHA1
	const hash = new Hashes.SHA1().hex(paramString + apiSecret);

	return hash;
}

// export const fileUploader = async (filePath: string, publicId: string) => {
// 	try {
// 		const result = await cloudinary.uploader.upload(filePath, {
// 			public_id: publicId
// 		});
// 		console.log('Image uploaded successfully:', result.secure_url);
// 	} catch (error) {
// 		console.error('Error uploading image:', error);
// 	}
// };
