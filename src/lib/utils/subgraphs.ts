type SubgraphData = {
	chain: number;
	endpoints: {
		expressions: string;
		interpreters: string;
	};
};

/**
 * Rain expression Subgraphs for each chain
 */
export const Subgraphs: SubgraphData[] = [
	{
		/**
		 * 	Only mumbai at the moment
		 */
		chain: 80001,
		endpoints: {
			// TODO: Should remove the "expressions" sg
			expressions: 'https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-expressions',
			interpreters: 'https://api.thegraph.com/subgraphs/name/rainprotocol/interpreter-registry'
		}
	}
];
