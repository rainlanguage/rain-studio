/**
 * Generate the sign message from an address and an id nonce
 */
export const createMessage = (address: string, nonce: string): string => {
	return `I want to verify this address with this nonce:
- Address: ${address}
- Nonce: ${nonce}`;
};

/**
 * Function to minimize the POST requests with JSON along all the app.
 */
export const postRequest = (url_: string, data_: Record<string, unknown> = {}) => {
	return fetch(url_, {
		method: 'POST',
		body: JSON.stringify(data_),
		headers: {
			'content-type': 'application/json'
		}
	});
};

export const timeSince = (date: Date): string => {
	let seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

	let interval = seconds / 31536000;
	if (interval >= 1) {
		const years_ = Math.floor(interval);
		return years_ == 1 ? years_ + ' year' : years_ + ' years';
	}

	interval = seconds / 2592000;
	if (interval >= 1) {
		const months_ = Math.floor(interval);
		return months_ == 1 ? months_ + ' month' : months_ + ' months';
	}

	interval = seconds / 86400;
	if (interval >= 1) {
		const days_ = Math.floor(interval);
		return days_ == 1 ? days_ + ' day' : days_ + ' days';
	}

	interval = seconds / 3600;
	if (interval >= 1) {
		const hours_ = Math.floor(interval);
		return hours_ == 1 ? hours_ + ' hour' : hours_ + ' hours';
	}

	interval = seconds / 60;
	if (interval >= 1) {
		const minutes_ = Math.floor(interval);
		return minutes_ == 1 ? minutes_ + ' min' : minutes_ + ' mins';
	}

	seconds = Math.floor(seconds);
	return seconds == 1 ? seconds + ' sec' : seconds + ' secs';
};
