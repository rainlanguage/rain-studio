import { json } from '@sveltejs/kit';
import Moralis from 'moralis';

export async function requestMessage({
	address,
	chain,
	network
}: {
	address: string;
	chain: string;
	network: 'evm';
}) {
	const result = await Moralis.Auth.requestMessage({
		address,
		chain,
		network,
		domain: 'rain-studio.vercel.app',
		statement: 'Please sign this message to confirm your identity.',
		uri: 'https://rain-studio.vercel.app',
		expirationTime: '2023-01-01T00:00:00.000Z',
		timeout: 15
	});

	const { message } = result.toJSON();

	return message;
}

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { request } = event;

	const { address, chain, network } = await request.json();

	const message = await requestMessage({
		address,
		chain,
		network
	});

	return json({ message });
}
