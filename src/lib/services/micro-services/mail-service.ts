export type MailData = {
	to: string;
	from: string;
	subject: string;
	text: string;
	html?: string;
};

export async function mailSender(msg: MailData) {
	const mailSenderApi = import.meta.env.VITE_BASE_API_SERVICE + 'api/mail-service/mailSender';

	const response = await fetch(mailSenderApi, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(msg)
	});

	if (response.status !== 200) {
		if (import.meta.env.VITE_DEV_MODE === 'true') console.error(response);
		throw new Error('ไม่สามารถส่งอีเมลได้');
	}

	return response.json();
}
