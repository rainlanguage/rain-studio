---
title: Using context
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from '@rainprotocol/rain-svelte-components'

	const expression1 = `toAddress: context\<0 1>()`
	const expression2 = `toAddress: context\<0 1>(),
condition: equal_to(toAddress 0x0324)`
	const expression3 = `toAddress: context\<0 1>(),
condition: equal_to(toAddress 0x0324),
result: if(condition 1 0)`
</script>

## Step 1: Understanding context

In Rainlang, the context word is used to access the context grid, which is a 2-dimensional grid of data that is provided by the smart contract. The context grid is typically used to pass data to Rainlang expressions, such as the addresses and amounts involved in a token transfer.

To access a specific cell in the context grid, you use the context word followed by the coordinates of the cell in angle brackets (e.g. `context<0 0>`), and a set of parentheses (e.g. `context<0 0>()`). The first number in the coordinates is the column, and the second number is the row. For example, to access the first cell in the first row of the context grid, you would use the coordinates 0 0 (i.e. `context<0 0>()`).

Different smart contracts will insert different data into the context grid, so the exact meaning of each cell in the grid will vary depending on the contract. For example, when writing a Flow contract "can transfer" expression, the first column of the context grid typically contains the "from" address (the address the token is being sent from), the "to" address (the address the token is being sent to), and the "amount" (the amount of the token being sent).

## Step 2: Using context

To use the context word in a Rainlang expression, you can simply use the coordinates of the cell you want to access as the operand of the word, followed by a set of parentheses. The result of the expression can be named on the left-hand side of the statement. For example, to access the "to" address in a "can transfer" expression and name the result "toAddress", you could use the context word with the coordinates 0 1, like this:

<ForkableFormatter raw={expression1} />

This expression would return the "to" address as a string and name the result "toAddress". You can then use this named output in subsequent calculations or comparisons. For example, to check if the "to" address is the same as a specific address, you could use the equals function, like this:

<ForkableFormatter raw={expression2} />

In this expression, the equals function compares the value of toAddress to the string "some-address" and returns 1 if they are equal and 0 if they are not. You can then use this result in an if statement to control the flow of your program. For example, to block a transfer if the "to" address is "some-address", you could use the following expression:

<ForkableFormatter raw={expression3} />

This expression checks if the "to" address is "some-address" using the equals function, and if it is, it returns 0, which will block the transfer.

In summary, the context word allows you to access the context grid and use the data it contains in your Rainlang expressions.
