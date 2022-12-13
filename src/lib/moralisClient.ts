import Moralis from 'moralis';
import { MORALIS_API_KEY } from '$env/static/private';

Moralis.start({
	apiKey: MORALIS_API_KEY
});
