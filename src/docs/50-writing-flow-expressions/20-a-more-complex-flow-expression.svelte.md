---
title: A more complex Flow expression
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from '@rainprotocol/rain-svelte-components'

	const expression = `/**
 * mints of this erc20 token
 */
mintslist: mintburnseparator,
_ _: sender finalAmount,
`

const expression2 = `mintAmount: 100,
erc721Contract: 0x123456,
balance: erc721balanceof(erc721Contract, sender),
condition: greater-than(balance 1),
finalAmount: if(condition mintAmount 0),

/**
 * separator values 
 */
transferseparator: 0xfea74d0c9bf4a3c28f0dd0674db22a3d7f8bf259c56af19f4ac1e735b156974f,
mintburnseparator: 0xf339171dab445c29f9897dda2f42413426ee907dc7f8b52bd387bc7cf9384c6b,
﻿
/**
 * erc1155 transfers
 */
transfererc1155slist: transferseparator,
﻿
/**
 * erc721 transfers
 */
transfererc721slist: transferseparator,
﻿
/**
 * er20 transfers
 */
transfererc20slist: transferseparator,
﻿
/**
 * native (gas) token transfers
 */
transfernativeslist: transferseparator,
﻿
/**
 * burns of this erc20 token
 */
burnslist: mintburnseparator,

/**
 * mints of this erc20 token
 */
mintslist: mintburnseparator,
_ _: sender finalAmount,`

</script>

In Rainlang, you can use the if word to perform different actions based on a given condition. In this tutorial, we will use the if word and the erc721balanceof word to create a FlowERC20 expression that mints an amount of the token for the sender of the transaction, but only if they have at least 2 of a specific ERC721 token.
First, let's define the named outputs that we will use in our expression. In this case, we will define the "mintAmount" output with the amount of the FlowERC20 token that we want to mint, and the "erc721Contract" output with the contract address of the ERC721 token that we want to check the balance of.

<ForkableFormatter raw={`mintAmount: 100,
erc721Contract: 0x123456,`} />

Next, we will use the erc721balanceof word to get the balance of the ERC721 token for the sender of the transaction. We’ll then define our condition, which checks if the balance is greater than 1.

<ForkableFormatter raw={`balance: erc721balanceof(erc721Contract, sender),
condition: greater-than(balance 1),`} />

We will then use the if word to decide what the final amount to mint is. If the condition is true, the finalAmount will be the mintAmount, otherwise 0.

<ForkableFormatter raw={`finalAmount: if(condition mintAmount 0),`} />

The last step is to use these values to define a mint, as part of the mints list. As we learned in the previous section, mints are defined as `\_ \_: to amount`.

<ForkableFormatter raw={expression} />

## Including the logic in the FlowERC20 expression template

The final expression would look like this:

<ForkableFormatter raw={expression2} />

This expression will mint "mintAmount" of the FlowERC20 token to the sender if they have at least 2 of the specified ERC721 token, otherwise it will not mint any tokens. This is a simple example of how you can use the if word and named outputs to create more complex expressions with FlowERC20.
