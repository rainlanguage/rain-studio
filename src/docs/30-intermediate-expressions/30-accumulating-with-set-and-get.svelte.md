---
title: Accumulating with set and get
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from 'rain-svelte-components/package'

	const expression = `/* Calculate the amount of the token to mint */
amount-per-mint: 1000,

/* Create a unique key for each wallet that tries to mint */
caller: context<0 0>(),

/* Get how much has been minted so far for the caller.
** Here we’re using ‘get’ and the storage key is the caller’s wallet address
** This means there’s a unique storage slot for each caller.
** If nothing has been set yet, this will be 0.
 */
amount-so-far: get(caller),

/* Check if the accumulated amount is above a certain value */
condition: less-than(amount-so-far 20000),

/* The amount the caller can mint in this transaction */
amount-for-this-mint: if(condition amount-per-mint 0),

/* Add the accumulated amount and the amount for this transaction. */
new-accumulated-amount: add(amount-so-far amount-for-this-mint),

/* Set the new value 
** We’re using the caller’s address as a storage key again, but now we’re storing the total accumulated amount for retrieval in the next run of this expression.
*/
:set(caller new-accumulated-amount);`
</script>

## Step 1: Set up the expression

1. Create a new expression
2. Rename your expression from Untitled expression to Checking an accumulated token balance with Set and Get
3. In the notes write "Checking an accumulated token balance with Set and Get from Getting Started with Rain"

## Step 2: Writing the Expression

Example: To use the "if" word to check if the accumulated amount of a token for a wallet is above a certain value, you can use the following expression:

<ForkableFormatter raw={expression} />

In this expression, the "amount" variable is set to a constant value of 1000. Then, the "result" variable is calculated using the "if" word to check if the accumulated amount is above 20000 using the "greater-than" word and the value stored under the key "sender()". If the accumulated amount is above 20000, the "if" word returns 0, which means that no tokens will be minted. Otherwise, the "if" word returns the "amount" variable, which is the amount of tokens to mint.

Finally, the "set" word updates the value stored under the key "caller()" by adding the "amount" of tokens minted to the previous value. This allows you to accumulate the total amount of tokens minted for the wallet over time.

By using the "if" word in this way, you can control the flow of your program and make decisions based on the values stored in the interpreter. This allows you to perform complex calculations and manage the minting of tokens in a flexible and customizable way. In this case, you can use the "if" word to limit the total amount of tokens minted to 20000.
