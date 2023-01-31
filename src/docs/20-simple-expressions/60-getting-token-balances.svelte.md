---
title: Getting token balances
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from 'rain-svelte-components/package'
</script>

## Step 1: Environment

Browse back to the expression you’ve marked as ‘My First Expression’
Use this box to experiment with ideas below

## Step 2: Experimenting

In Rainlang, you can use the erc20balanceof word to get the balance of an ERC20 token for a specific Ethereum wallet. The erc20balanceof word takes two parameters: the address of the ERC20 token contract, and the address of the Ethereum wallet. For example, the following expression gets the balance of an ERC20 token with contract address 0x123456 for an Ethereum wallet with address 0xabcdef and names the output "myBalance":

<ForkableFormatter raw={`myBalance: erc20balanceof(0x123456 0xabcdef)`} />

This expression will return the balance of the ERC20 token for the specified wallet and put the result on the top of the stack. For example, if the balance is 100, the stack will look like this after the expression is executed:

```
[100]
```

You can then use the named output, "myBalance", in subsequent expressions to perform calculations with the balance. For example, the following expression calculates the result of adding 10 to the balance of the ERC20 token and names the output "result":

<ForkableFormatter raw={`myBalance: erc20balanceof(0x123456 0xabcdef),
result: add(myBalance 10)`} />

This expression will take the value of "myBalance" from the stack, add 10 to it, and put the result back into the stack. In this case, if the balance of the ERC20 token is 100, the stack will look like this after the expression is executed:

```
[100, 110]
```

As you can see, using the erc20balanceof word in Rainlang allows you to easily get the balance of an ERC20 token for a specific Ethereum wallet and use that balance in subsequent calculations.
