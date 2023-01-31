---
title: 'Example: DCA Strategy'
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from 'rain-svelte-components/package'

	const expression = `/* Calculate the number of seconds in a month */
seconds-in-month: mul(60 60 24 30),

/* Set the maximum amount of dollars to spend per month */
dollars-per-month: 1000,

/* Calculate the maximum amount of dollars to spend per second */
dollars-per-second: div(1000 seconds-in-month),

/* Set the start timestamp for the DCA strategy */
start-timestamp: 1668780839,

/* Get the address of the order author */
order-author: sender(),

/* Get the hash of the order */
order-hash: context<0 0>(),

/* Create a unique storage key using the order author and order hash */
storage-key: hash(order-author order-hash),

/* Get the total amount of dollars sent in previous orders */
total-sent: get(storage-key),

/* Calculate the total amount of dollars that can be sent by now */
total-sendable-by-now: mul(dollars-per-second sub(block-timestamp() start-timestamp)),

/* Calculate the amount of dollars that can be sent in this order */
sendable-in-this-order: sub(total-sendable-by-now total-sent),

/* Set the arb bounty factor to 0.999 */
arb-bounty-factor: 0.999,

/* Get the USDT-ETH price from the Chainlink oracle */
usdt-eth: chainlinkprice(0x00 0x00),

/* Calculate the amount and price of the order */
amount price: sendable-in-this-order mul(usdt-eth arb-bounty-factor),

/* Update the total amount of dollars sent using the storage key */
:set(storage-key add(total-sent amount);`

const expression2 = `order-author: sender(),
order-hash: context<0 0>(),
storage-key: hash(order-author order-hash),`
</script>

A dollar-cost averaging (DCA) strategy is a common investment technique used to mitigate the risks of volatility in the market by buying a fixed amount of a particular asset at regular intervals. This can be useful for traders who want to buy a specific token over time, without having to worry about the market fluctuations.
To implement a DCA order strategy in Rainlang, you can use the following expression:

<ForkableFormatter raw={expression} />

Let's break down this expression line by line to understand how it works:

<ForkableFormatter raw={`seconds-in-month: mul(60 60 24 30),
dollars-per-month: 1000,
dollars-per-second: div(1000 seconds-in-month),`} />

The first part of the expression calculates the number of seconds in a month using the mul word to multiply the number of minutes in an hour by the number of hours in a day by the number of days in a month. This is then used to calculate the maximum amount of tokens that can be sent per second using the div word to divide the maximum amount per month by the number of seconds in a month.

<ForkableFormatter raw={`start-timestamp: 1668780839,`} />

Next, the start-timestamp variable is set to the timestamp of the beginning of the strategy, which is used as a reference point for calculating the amount of tokens that can be sent in each order.

<ForkableFormatter raw={expression2} />

This is followed by the order-author and order-hash variables, which are used to construct a unique storage key for tracking the total amount of tokens cleared so far across executions of this order.

<ForkableFormatter raw={`total-sent: get(storage-key),`} />

The total-sent variable is then set to the value stored under the storage-key, which represents the total amount of tokens sent so far.

<ForkableFormatter raw={`total-sendable-by-now: mul(dollars-per-second sub(block-timestamp() start-timestamp)),`} />

This is used to calculate the total amount of tokens that can be sent by now, which is calculated by multiplying the maximum amount per second by the number of seconds since the start of the month. This output is named total-sendable-by-now.

<ForkableFormatter raw={`sendable-in-this-order: sub(total-sendable-by-now total-sent),`} />

The sendable-in-this-order variable is then calculated using the sub word to subtract the total amount sent so far from the total amount that can be sent by now. This represents the amount of tokens that can be sent in this order.

<ForkableFormatter raw={`arb-bounty-factor: 0.999,
usdt-eth: chainlinkprice(0x00 0x00),
amount price: sendable-in-this-order mul(usdt-eth arb-bounty-factor),`} />

To get the current USDT-ETH price, we use the chainlinkprice word. This value is then multiplied by the arb-bounty-factor value to leave an arbitrage bounty, incentivising the order to be cleared.

<ForkableFormatter raw={`:set(storage-key add(total-sent amount);`} />

Finally, the set word is used to update the value stored under the storage-key by adding the amount of tokens sent in this order to the total amount sent so far. This allows you to track the total amount of tokens sent and ensure that you do not exceed the maximum amount per month.

## Summary

In this way, the expression allows a user to implement a DCA order strategy that automatically adjusts the amount and price of their orders based on the current market conditions and the amount of dollars already spent. By breaking the expression down into individual parts and explaining how each part works, you can better understand how to write and use expressions like this in Rainlang.
