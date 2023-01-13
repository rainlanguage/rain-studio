export const rainLinks: { name: string, url: string }[] = [
    {
        name: "Github",
        url: "https://github.com/rainprotocol/rain-protocol"
    },
    {
        name: "Docs",
        url: "https://docs.rainprotocol.xyz/intro"
    },
    {
        name: "Dev ecosystem",
        url: "https://t.me/+W0aQ36ptN_E2MjZk"
    }
]

export const ecosystemProjects: { name: string, logo: string }[] = [
    {
        name: "Bancor",
        logo: new URL('$lib/homepage/images/bancor.svg', import.meta.url).href
    },
    {
        name: "Bancor",
        logo: new URL('$lib/homepage/images/bancor.svg', import.meta.url).href
    },
    {
        name: "Bancor",
        logo: new URL('$lib/homepage/images/bancor.svg', import.meta.url).href
    },
    {
        name: "Bancor",
        logo: new URL('$lib/homepage/images/bancor.svg', import.meta.url).href
    },
]

export const features: { title: string, description: string, image: string }[] = [
    {
        title: "Discover",
        description: "Join the growing community of Rain Studio users, share and fork expressions.",
        image: new URL('$lib/homepage/images/discover.svg', import.meta.url).href
    },
    {
        title: "Write",
        description: "User-friendly IDE for writing and testing RainLang expressions.",
        image: new URL('$lib/homepage/images/write.svg', import.meta.url).href
    },
    {
        title: "Test",
        description: "View the simulated output of your expressions in real time.",
        image: new URL('$lib/homepage/images/test.svg', import.meta.url).href
    },
    {
        title: "Deploy",
        description: "Deploy your expressions using an ever growing library of contracts.",
        image: new URL('$lib/homepage/images/deploy.svg', import.meta.url).href
    }
]

export const expressionExamples: { name: string, description: string, expression: string }[] = [
    {
        name: "DEX Strategies",
        description: "Dollar-cost averaging strategy, used with the Orderbook contract.",
        expression: `/* calculate the number of seconds in a month */
seconds-in-month: mul(60 60 24 30),

/* set the maximum amount of dollars to spend per month */
dollars-per-month: 1000,

/* calculate the maximum amount of dollars to spend per second */
dollars-per-second: div(1000 seconds-in-month),

/* set the start timestamp for the dca strategy */
start-timestamp: 1668780839,

/* get the address of the order author */
order-author: sender(),

/* get the hash of the order */
order-hash: context<0 0>(),

/* create a unique storage key using the order author and order hash */
storage-key: hash(order-author order-hash),

/* get the total amount of dollars sent in previous orders */
total-sent: get(storage-key),

/* calculate the total amount of dollars that can be sent by now */
total-sendable-by-now: mul(dollars-per-second sub(block-timestamp() start-timestamp)),

/* calculate the amount of dollars that can be sent in this order */
sendable-in-this-order: sub(total-sendable-by-now total-sent),

/* set the arb bounty factor to 0.999 */
arb-bounty-factor: 0.999,

/* get the usdt-eth price from the chainlink oracle */
usdt-eth: chainlinkprice(0x00 0x00),

/* calculate the amount and price of the order */
amount price: sendable-in-this-order mul(usdt-eth arb-bounty-factor),

/* update the total amount of dollars sent using the storage key */
:set(storage-key add(total-sent amount);`
    },
    {
        name: "NFT Drops",
        description: "An NFT drop expression",
        expression: `/* calculate the number of seconds in a month */
    seconds-in-month: mul(60 60 24 30),
    
    /* set the maximum amount of dollars to spend per month */
    dollars-per-month: 1000,
    
    /* calculate the maximum amount of dollars to spend per second */
    dollars-per-second: div(1000 seconds-in-month),
    
    /* set the start timestamp for the dca strategy */
    start-timestamp: 1668780839,
    
    /* get the address of the order author */
    order-author: sender(),
    
    /* get the hash of the order */
    order-hash: context<0 0>(),
    
    /* create a unique storage key using the order author and order hash */
    storage-key: hash(order-author order-hash),
    
    /* get the total amount of dollars sent in previous orders */
    total-sent: get(storage-key),
    
    /* calculate the total amount of dollars that can be sent by now */
    total-sendable-by-now: mul(dollars-per-second sub(block-timestamp() start-timestamp)),
    
    /* calculate the amount of dollars that can be sent in this order */
    sendable-in-this-order: sub(total-sendable-by-now total-sent),
    
    /* set the arb bounty factor to 0.999 */
    arb-bounty-factor: 0.999,
    
    /* get the usdt-eth price from the chainlink oracle */
    usdt-eth: chainlinkprice(0x00 0x00),
    
    /* calculate the amount and price of the order */
    amount price: sendable-in-this-order mul(usdt-eth arb-bounty-factor),
    
    /* update the total amount of dollars sent using the storage key */
    :set(storage-key add(total-sent amount);`
    },
    {
        name: "Decentralised tournaments",
        description: "A Lobby expression",
        expression: `/* calculate the number of seconds in a month */
    seconds-in-month: mul(60 60 24 30),
    
    /* set the maximum amount of dollars to spend per month */
    dollars-per-month: 1000,
    
    /* calculate the maximum amount of dollars to spend per second */
    dollars-per-second: div(1000 seconds-in-month),
    
    /* set the start timestamp for the dca strategy */
    start-timestamp: 1668780839,
    
    /* get the address of the order author */
    order-author: sender(),
    
    /* get the hash of the order */
    order-hash: context<0 0>(),
    
    /* create a unique storage key using the order author and order hash */
    storage-key: hash(order-author order-hash),
    
    /* get the total amount of dollars sent in previous orders */
    total-sent: get(storage-key),
    
    /* calculate the total amount of dollars that can be sent by now */
    total-sendable-by-now: mul(dollars-per-second sub(block-timestamp() start-timestamp)),
    
    /* calculate the amount of dollars that can be sent in this order */
    sendable-in-this-order: sub(total-sendable-by-now total-sent),
    
    /* set the arb bounty factor to 0.999 */
    arb-bounty-factor: 0.999,
    
    /* get the usdt-eth price from the chainlink oracle */
    usdt-eth: chainlinkprice(0x00 0x00),
    
    /* calculate the amount and price of the order */
    amount price: sendable-in-this-order mul(usdt-eth arb-bounty-factor),
    
    /* update the total amount of dollars sent using the storage key */
    :set(storage-key add(total-sent amount);`
    },
    {
        name: "Game currencies",
        description: "A game energy currency that lets a wallet mint up to a specified max per day.",
        expression: `/**
* Energy claim calculation
*
* Calculate the number of seconds in a day 
*/
seconds-in-day: mul(60 60 24),

/* Set the maximum amount of energy that can be claimed per day */
energy-per-day: 100,

/* Calculate the maximum amount of energy that can be claimed per second */
energy-per-second: scale18div(18 100 seconds-in-day),

/* Set the start timestamp for the energy claim strategy */
start-timestamp: 1668780839,

/* Get the address of the sender of the transaction */
sender: context<0 0>(),

/* Create a unique storage key using the caller's address */
storage-key: hash(sender),

/* Get the total amount of energy claimed in previous transactions */
total-claimed: get(storage-key),

/* Calculate the total amount of energy that can be claimed by now */
total-claimable-by-now: mul(energy-per-second sub(block-timestamp() start-timestamp)),

/* Calculate the amount of energy that can be claimed in this transaction */
claimable-in-this-transaction: sub(total-claimable-by-now total-claimed),

/* Update the total amount of energy claimed using the storage key */
:set(storage-key add(total-claimed claimable-in-this-transaction)),

/**
* Separator values 
*/
transferSeparator: 0xfea74d0c9bf4a3c28f0dd0674db22a3d7f8bf259c56af19f4ac1e735b156974f,
mintBurnSeparator: 0xf339171dab445c29f9897dda2f42413426ee907dc7f8b52bd387bc7cf9384c6b,

/**
* erc1155 transfers
*/
transferERC1155sList: transferSeparator,

/**
* erc721 transfers
*/
transferERC721sList: transferSeparator,

/**
* er20 transfers
*/
transferERC20sList: transferSeparator,

/**
* native (gas) token transfers
*/
transferNativesList: transferSeparator,

/**
* burns of this erc20 token
*/
burnsList: mintBurnSeparator,

/**
* mints of this erc20 token
*/
mintsList: mintBurnSeparator,
_ _: sender claimable-in-this-transaction;
       `
    }
]