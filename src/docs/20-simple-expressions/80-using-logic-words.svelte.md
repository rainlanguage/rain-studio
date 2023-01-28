---
title: Using logic words
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from 'rain-svelte-components/package'
</script>

## Step 1: Environment

Browse back to the expression you’ve marked as ‘My First Expression’
Use this box to experiment with ideas below

## Step 2: Write up the expression

In Rainlang, you can use logic words like "if", "every", "any", "greater-than", and "less-than" to evaluate conditions and control the flow of your expression. These words allow you to perform complex calculations and make decisions based on the results.

For example, the "every" word takes any number of parameters and returns true only if all of the parameters are non-zero.

The "any" word takes any number of parameters and returns true if any of the parameters are non-zero.

To understand how to use these words, let's start with a simple example. The following expression uses the "if" word to check if the number 3 is greater than 10, and names the output "result":

<ForkableFormatter raw={`result: if(greater-than(3 10) 1 0)`} />

In this case, the "if" word will evaluate the condition "greater-than(3 10)". Since 3 is not greater than 10, the "if" word will return 0, which is the value specified for the "false" case. The output of the expression is named "result".

In a more complicated example, the following "if" statement uses the "every" word to evaluate multiple conditions and names the output "result":

<ForkableFormatter raw={`result: if(every(greater-than(a b) less-than(c d)) 1 0)`} />

In this case, the "if" statement will return 1 if the condition "greater-than(a b)" and the condition "less-than(c d)" are both true, and 0 otherwise. The output of the "if" statement is named "result".

Similarly, the following "if" statement uses the "any" word to evaluate multiple conditions and names the output "result".

<ForkableFormatter raw={`result: if(any(equal_to(a b) equal_to(c d)) 1 0)`} />

In this case, the "if" statement will return 1 if either the condition "equals(a b)" or the condition "equals(c d)" is true, and 0 otherwise. The output of the "if" statement is named "result".

In addition to the "every" and "any" words, Rainlang also includes the "greater-than" and "less-than" words, which can be used to compare two numbers and return true or false based on the comparison. For example, the following "if" statement uses the "greater-than" word to evaluate a condition and names the output "result":

<ForkableFormatter raw={`result: if(greater-than(a b) 1 0)`} />

In this case, the "if" statement will return 1 if the value of "a" is greater than the value of "b", and 0 otherwise. The output of the "if" statement is named "result".

Here’s another example that uses another available word ‘erc20balanceof’. You can use the "erc20balanceof" word to check the balance of an ERC20 token for a given wallet. The "erc20balanceof" word takes two parameters: the address of the ERC20 token and the address of the wallet. It then puts the balance of the specified token for the given wallet on the stack.

For example, the following expression uses the "erc20balanceof" word to check the balance of a token with the address "0x123" for the wallet with the address "0x456", and names the output "balance":

<ForkableFormatter raw={`balance: erc20balanceof(0x123 0x456)`} />

In this case, the "erc20balanceof" word will put the balance of the token with the address "0x123" for the wallet with the address "0x456" on the top of the stack. The output of the expression is named "balance".

You can use the "erc20balanceof" word in combination with the "every" and "any" words to evaluate multiple conditions in an "if" statement. For example, the following "if" statement uses the "every" word and the "erc20balanceof" word to evaluate multiple conditions and names the output "result":

<ForkableFormatter raw={`balance1condition: greater-than(erc20balanceof(0x789 0xabc) 10),
balance2condition: greater-than(erc20balanceof(0x123 0x456) 10),
bothConditions: every(balance1condition balance2condition),
result: if(bothConditions 1 0)`} />

In this case, the "if" statement will return 1 if the balance of the token with the address "0x123" for the wallet with the address "0x456" is greater than 10 and the balance of the token with the address "0x789" for the wallet with the address "0xabc" is greater than 10. The output of the "if" statement is named "result".

## Summary

Using logic words in Rainlang can help you write more complex and flexible expressions. You can use these words to perform a wide range of operations and make decisions based on the results of your calculations. This allows you to create powerful and sophisticated programs that can handle a variety of different tasks and scenarios.
