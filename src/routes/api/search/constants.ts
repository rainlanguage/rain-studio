/**
 * Rain expression Subgraphs for each chain
 */
export const subgraphs = [
	{
		/**
		 * 	Only mumbai at the moment
		 */
		chain: 80001,
		url: 'https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-expressions'
	}
];

/**
 * Hold all the info/keys that will be queried with Account entities
 */
export const accountQuery = `
 id
 events {
	 id
	 timestamp
	 transaction {
		 id
		 timestamp
		 blockNumber
	 }
 }
 expressions {
	 id
	 contextScratch
	 config {
		 id
		 sources
		 constants
	 }
	 event {
		 id
		 transaction {
			 id
			 timestamp
			 blockNumber
		 }
	 }
	 sender {
		 id
		 deployTransaction {
			 id
			 timestamp
			 blockNumber
		 }
	 }
	 interpreter {
		 id
	 }
	 interpreterInstance {
		 id
	 }
 }
`;

/**
 * Hold all the info/keys that will be queried with Factory entities
 */
export const factoryQuery = `
 id
 children {
	 deployTransaction {
		 id
		 timestamp
		 blockNumber
	 }
	 expressions {
		 id
		 contextScratch
		 config {
			 id
			 sources
			 constants
		 }
		 event {
			 id
			 transaction {
				 id
				 timestamp
				 blockNumber
			 }
		 }
		 sender {
			 id
			 deployTransaction {
				 id
				 timestamp
				 blockNumber
			 }
		 }
		 interpreter {
			 id
		 }
		 interpreterInstance {
			 id
		 }
	 }
 }
`;

/**
 * Hold all the info/keys that will be queried with Contract entities
 */
export const contractQuery = `
 id
 deployTransaction {
	 id
	 timestamp
	 blockNumber
 }
 expressions {
	 id
	 contextScratch
	 config {
		 id
		 sources
		 constants
	 }
	 event {
		 id
		 transaction {
			 id
			 timestamp
			 blockNumber
		 }
	 }
	 sender {
		 id
		 deployTransaction {
			 id
			 timestamp
			 blockNumber
		 }
	 }
	 interpreter {
		 id
	 }
	 interpreterInstance {
		 id
	 }
 }
`;

/**
 * Hold all the info/keys that will be queried with Interpreter entities
 */
export const interpreterQuery = `
 id
 instances {
	 id
 }
 expressions {
	 id
	 contextScratch
	 config {
		 id
		 sources
		 constants
	 }
	 event {
		 id
		 transaction {
			 id
			 timestamp
			 blockNumber
		 }
	 }
	 sender {
		 id
		 deployTransaction {
			 id
			 timestamp
			 blockNumber
		 }
	 }
	 interpreter {
		 id
	 }
	 interpreterInstance {
		 id
	 }
 }
`;

/**
 * Hold all the info/keys that will be queried with Expresion entities
 */
export const expresionQuery = `
 id
 event {
	 id
	 timestamp
	 transaction {
		 id
		 timestamp
		 blockNumber
	 }
 }
 account {
	 id
 }
 sender {
	 id
 }
 contextScratch
 interpreter {
	 id
 }
 interpreterInstance {
	 id
 }
 config {
	 id
	 sources
	 constants
 }
`;
