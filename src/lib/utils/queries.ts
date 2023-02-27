// TODO: Convert to a class with methods to get the desired query

/**
 * Hold all the info/keys that will be queried with Account entities
 */
const accountQuery = `
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
const factoryQuery = `
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
      account {
        id
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
const contractQuery = `
  id
  opmeta
  deployTransaction {
    id
    timestamp
    blockNumber
  }
  expressions {
    id
    config {
      id
      sources
      constants
    }
    event {
      id
    }
    account {
      id
    }
    sender {
      id
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
const interpreterQuery = `
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
    account {
      id
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
 * Hold all the info/keys that will be queried with Expression entities
 */
const expressionQuery = `
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
    sources
    constants
  }
`;

/**
 * Query to search an address across certain entities, specfically Accounts, Factories, Contracts, Interpreters and Expression.
 */
export const QueryAddress = `
  query ($address: ID!) {
    account(id: $address) {
      ${accountQuery}
    }
    factory(id: $address) {
      ${factoryQuery}
    }
    contract(id: $address) {
      ${contractQuery}
    }
    interpreter(id: $address) {
      ${interpreterQuery}
    }
    expression(id: $address) {
      ${expressionQuery}
    }
  }
`;

/**
 * Query to search an specific transaction hash.
 */
export const QueryTransaction = `
  query ($hash: ID!) {
    transaction (id: $hash) {
      id
      timestamp
      blockNumber
      events {
        id
        timestamp
        emitter {
          id
        }
      }
    }
  }
`;

/**
 * Query to search any match from an array of accounts/wallets/profiles IDs.
 */
export const QueryAccountsFromArray = `
  query MyQuery($wallets: [ID!] = "") {
    accounts(where: {id_in: $wallets}) {
      events {
        id
      }
      expressions {
        id
        contextScratch
        account {
          id
        }
        sender {
          id
        }
        event {
          expression {
            config {
              constants
              sources
            }
            interpreterInstance {
              id
            }
          }
          timestamp
        }
      }
    }
  }
`;

/**
 * Query to search an Expression
 */
export const QueryExpression = `
 query ($address: ID!) {
   expression(id: $address) {
     ${expressionQuery}
   }
 }
`;

export const QueryGetKnownContracts = `
  query GetKnownContracts($knowAddresses: [ID!]) {
    contracts(where: {id_in: $knowAddresses}) {
      ${contractQuery}
    }
  }
`;
