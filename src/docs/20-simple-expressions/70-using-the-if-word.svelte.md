---
title: Using the 'if' word
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from '@rainprotocol/rain-svelte-components'
</script>

## Step 1: Environment

Browse back to the expression you’ve marked as ‘My First Expression’
Use this box to experiment with ideas below

## Step 2: Write up the expression

In Rainlang, you can use the if word to perform different actions based on a given condition. The if word takes three parameters: a condition, a value to return if the condition is true, and a value to return if the condition is false. For example, the following expression gets the balance of an ERC20 token with contract address 0x123456 for an Ethereum wallet with address 0xabcdef and returns a value of 10 if the balance is greater than 10, and a value of 5 if the balance is 10 or less:

<ForkableFormatter raw={`myBalance: erc20balanceof(0x123456 0xabcdef),
high: 10,
low: 5,
result: if(greater-than(myBalance 10) high low);`} />

This expression first gets the balance of the ERC20 token and puts it on the top of the stack. It then defines the named outputs "high" and "low" with values of 10 and 5, respectively. Finally, it uses the if word to check if the balance is greater than 10. If it is, the if word returns the value of "high" and puts it on the stack. If the balance is 10 or less, the if word returns the value of "low" and puts it on the stack. For example, if the balance is 15, the stack will look like this after the expression is executed:

```
[10]

```

If the balance is 5, the stack will look like this after the expression is executed:

```
[5]

```

As you can see, using the if word and the greater-than word in Rainlang allows you to create conditions and perform different actions based on those conditions. By defining named outputs earlier in the expression, you can use those outputs as values in the if statement, which allows you to return different constant values based on the balance of an ERC20 token.
