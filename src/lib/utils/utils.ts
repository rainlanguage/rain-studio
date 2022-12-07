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
