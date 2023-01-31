export const rainLinks: { name: string; url: string }[] = [
    {
        name: 'Github',
        url: 'https://github.com/rainprotocol/rain-protocol'
    },
    {
        name: 'Docs',
        url: 'https://docs.rainprotocol.xyz/intro'
    },
    {
        name: 'Dev ecosystem',
        url: 'https://t.me/+W0aQ36ptN_E2MjZk'
    }
];

export const ecosystemProjects: { name: string; logo: string }[] = [
    {
        name: 'Rain',
        logo: new URL('$lib/homepage/images/rain-logo.svg', import.meta.url).href
    },
    {
        name: 'Rain',
        logo: new URL('$lib/homepage/images/rain-logo.svg', import.meta.url).href
    },
    {
        name: 'Rain',
        logo: new URL('$lib/homepage/images/rain-logo.svg', import.meta.url).href
    },
    {
        name: 'Rain',
        logo: new URL('$lib/homepage/images/rain-logo.svg', import.meta.url).href
    }
];

export const features: { title: string; description: string; image: string }[] = [
    {
        title: 'Discover',
        description: 'Join the growing community of Rain Studio users, share and fork expressions.',
        image: new URL('$lib/homepage/images/discover.svg', import.meta.url).href
    },
    {
        title: 'Write',
        description: 'User-friendly IDE for writing and testing RainLang expressions.',
        image: new URL('$lib/homepage/images/write.svg', import.meta.url).href
    },
    {
        title: 'Test',
        description: 'View the simulated output of your expressions in real time.',
        image: new URL('$lib/homepage/images/test.svg', import.meta.url).href
    },
    {
        title: 'Deploy',
        description: 'Deploy your expressions using an ever growing library of contracts.',
        image: new URL('$lib/homepage/images/deploy.svg', import.meta.url).href
    }
];

export const expressionExamples: { name: string; description: string; expression: string }[] = [
    {
        name: 'DEX Strategies',
        description: 'Dollar-cost averaging strategy, used with the Orderbook contract.',
        expression: `/*
the number of seconds in a month (roughly) as 60 * 60 * 24 * 30 = 2592000
*/
seconds-in-month: 2592000,

/*
set the maximum amount of dollars to spend per month.

orderbook treats 1e18 as "one" as this is the standard used by eth and many erc20 tokens. for example dai uses 1e18 to be $1 but tether only uses 1e6 for $1. regardless, orderbook will scale all tokens up or down as needed so that 1e18 is always "one token".

therefore 1000e18 is $1000.
*/
dollars-per-month: 1000000000000000000000,

/*
calculate the maximum amount of dollars to spend per second.

it would cost less gas to precalculate this offchain and provide it as an integer, but this is just an example so breaking the problem down lets us document and comment each line better :)
*/
dollars-per-second: div(dollars-per-month seconds-in-month),

/*
the start timestamp for the dca strategy as a unix timestamp in seconds.

this time is from nov 2022 so you'll want to provide your own.

there are plenty of online tools to easily generate a timestamp
*/
start-timestamp: 1668780839,

/* 
the hash of the order is in context for orderbook.
*/
order-hash: context<1 0>(),

/* 
the address of the order author is in context for orderbook.
*/
order-author: context<1 1>(),

/*
get the total amount of dollars sent for the lifetime of the order so far.

the order hash is unique to this order, and we're only tracking one value so we can use the order hash as the key for get/set.
*/
total-sent: get(order-hash),

/*
the order age in seconds is simply the current timestamp minus the start time.

'sub' throws an error and rolls back the entire transaction if this is a negative number, so that prevents anything happening before the start timestamp.
*/
order-age: sub(block-timestamp() start-timestamp),

/*
calculate the maximum total amount of dollars that can be sent by now.
*/
max-sendable: mul(dollars-per-second order-age),

/*
calculate the amount of dollars that can be sent in this order.

this is the max we could send minus the amount we already sent.
*/
sendable: sub(max-sendable total-sent),

/*
orders only clear if there is a bounty (probably).

we are more concerned about regularly buying close to the market price over time than getting an "exact best price".

if we give a bounty of 0.1% that should help bots pay the gas and include our order in a transaction.

as a percentage the bounty will naturally get larger as the sendable amount increases over time.

again we use 1e18 to mean "one" so 1e15 would be 0.001, therefore 1e18 - 1e15 is 0.999.
*/
bounty-factor: 999000000000000000,

/*
get the usd-eth price from the chainlink oracle.

the list of chainlink oracles can be found at https://data.chain.link/

the first argument is the contract address. for this example we are using the usdt/eth feed on mainnet.

the second argument is the oldest a quoted price can be and still considered "current". if the price from chainlink is older than this the expression will error and so the order won't clear. for this example we will use 1 hour, which is 3600 seconds.

chainlink oracle prices are always provided as 18 decimal, so 1e18 is "one" regardless of what the underlying oracle is configured as. this makes all feeds compatible with the same math in rain expressions.
*/
usd-eth: chainlinkprice(0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419 3600),

/*
orderbook always require the last two values on the lhs to be the max amount
and the price.
*/
amount price: sendable-in-this-order scale18-mul<18>(usd-eth bounty-factor);

/*
handle io.

this is called after the order is cross referenced against what the counterparty can offer. it's common that the counterparty can't fill the entire possible amount we calculated above.

the actual final vault movements will be provided here in context.
*/

/*
the decimals of the token could be different for e.g. usdt and dai.

we will need to rescale the amount sent to 18 decimal fixed point.
*/
token-decimals: context<4 1>(),

/*
the tokens sent are always in this context slot. column 4 is outputs, row 4 is the amount.
*/
token-amount-sent: context<4 4>(),

/*
this scales the real token amounts to their 18 decimal equivalents so we can store them and re-use them in future calculations.

we round up if the token is scaled down to be conservative and overestimate how much we've sent to date.
*/
token-amount-scaled: scale-18<18>(token-amount-sent),

/*
record how much has been sent in total. this will be the total across all input tokens so sending $400 of dai and $600 of usdt will be recorded as $1000 total.
*/
:set(order-hash add(get(order-hash) token-amount-scaled);`
    },
    {
        name: 'NFT Drops',
        description: 'An NFT drop expression',
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
        name: 'Decentralised tournaments',
        description: 'A Lobby expression',
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
        name: 'Game currencies',
        description:
            'A game energy currency that lets a wallet mint up to a specified max per day.',
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
];
