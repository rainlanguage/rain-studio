---
title: Basic Orders
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from 'rain-svelte-components'

	const expression = `amount: 1000,
price: 1,
counterparty: context<0 2>(),

/* Get the accumulated amount cleared to the counterparty */
accumulatedAmount: get(counterparty),

/* Check if the accumulated amount cleared to the counterparty is below 1000 */
finalAmount: if(less-than(accumulatedAmount 1000) amount 0),

/* Set the new value */
:set(counterparty add(get(counterparty) result)),

/* Finally, put the amount and price onto the stack to be read by the Orderbook contract */
result: finalAmount price;`
</script>

To write an order expression to be executed as part of the Orderbook contract in Rainlang, you can follow these steps:

Start by deciding on the input and output tokens for the order. For example, if you want to place a bid to buy TKN using USDT, you would specify TKN as the input token and USDT as the output token. You can use multiple input and output tokens, and Orderbook will use the order to clear any pair of the input and output tokens it can.

The expression will determine the maximum amount of the output token that you are willing to sell, as well as the price at which you are willing to sell it.

The amount value is known as the 'maxAmount' and will be used by the Orderbook contract to match your bid with a suitable ask. The 'price' value is the worst price you are willing to pay for the input token, denominated in the output token. These values will be used by the Orderbook contract to match your bid with an appropriate ask.

Use the 'maxAmount' and 'price' values to construct your order expression. For example, to place a bid to buy 100 TKN at a maximum price of 1 USDT per TKN, you could use the following expression:

<ForkableFormatter raw={`amount: 100,
the-price: 1,
_ _: amount the-price`} />

You can then add your Order to the Orderbook contract. The contract will evaluate your expression and extract the 'maxAmount' and 'price' values from the stack. These values will be used to match your bid with an appropriate ask and execute the trade.

Once your Order has been executed, the tokens will be transferred to a vault within the contract. From the vault, you can withdraw the tokens to your wallet or use them in another Order. The Order will remain on the Orderbook until it is removed by the user.

By following these steps, you can write and submit an order expression to be executed as part of the orderbook contract in Rainlang. This allows you to participate in the trading of tokens on the Ethereum blockchain using a human-friendly and easy-to-understand language.

## Writing a more advanced order expression

When your Order is cleared by Orderbook, it is matched to another Order submitted by another user. This is the ‘counterparty’, i.e. the address that submitted the other Order. Orderbook puts the counterparty into context when the Order is being cleared. You can access the counterparty address in the context grid by using `context<0 2>()`.

To write an order expression using the 'set' and 'get' words to only clear a maximum of 1000 tokens for a specific counterparty at a price of 1, you can use the following expression:

<ForkableFormatter raw={`amount: 100,
the-price: 1,
_ _: amount the-price`} />

In this expression, the "amount" variable is set to a constant value of 1000, and the "price" variable is set to a constant value of 1. Then, the "counterparty" variable is set to the address of the counterparty using the "context" word and the coordinates 0 2.

Next, the "result" variable is calculated using the "if" word to check if the accumulated amount cleared to the counterparty is below 1000 using the "less-than" word and the value stored under the key "counterparty". If the accumulated amount is below 1000, the "if" word returns the "amount" variable, which is the amount of tokens to clear. Otherwise, the "if" word returns 0, which means that no tokens will be cleared.

Finally, the "set" word updates the value stored under the key "counterparty" by adding the "amount" of tokens cleared to the previous value. This allows you to accumulate the total amount of tokens cleared for the counterparty over time.

By using the "if" and "set" words in this way, you can control the flow of your program and make decisions based on the values stored in the interpreter. This allows you to perform complex calculations and manage the clearing of orders in a flexible and customizable way. In this case, you can use the "if" and "set" words to limit the total amount of tokens cleared to 1000 for a specific counterparty.
