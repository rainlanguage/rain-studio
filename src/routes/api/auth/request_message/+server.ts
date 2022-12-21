import { HASH_KEY } from '$env/static/private';
import { json, error as sveltekitError } from '@sveltejs/kit';
import { utils } from 'ethers';

/**
 * Generate the sign message from an address and an id nonce
 */
const createMessage = ({
	address,
	nonce,
	url
}: {
	address: string;
	nonce: string;
	url?: string;
}): string => {
	const url_ = url ? `site ${url}` : 'site';
	const address_ = utils.getAddress(address);

	return `The ${url_} need you to sign this message to verify your identity with this wallet address.
	- NonceID: ${nonce}
	- Adress: ${address_.slice(0, 8) + '...' + address_.slice(address_.length - 6, address_.length)}`;
};

async function requestMessage(address: string) {
	const nonce = utils.hexDataSlice(utils.computeHmac('sha256', HASH_KEY, address), 0, 8);

	return createMessage({ address, nonce });
}

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { request } = event;

	const { address } = await request.json();

	if (!address || !utils.isAddress(address)) {
		throw sveltekitError(400, 'Address value missing or invalid format');
	}

	return json({
		message: await requestMessage(address)
	});
}
