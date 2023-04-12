---
title: Breaking down an expression
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from '@rainprotocol/rain-svelte-components'
</script>

## A simple expression

Consider this simple Rainlang expression:

<ForkableFormatter raw={`_: add(1 2);`} />

The expression starts with an underscore, which is a placeholder for the output of the expression. In this case, the output will be the result of the addition of 1 and 2.

The next part of the expression is the "add" word, which is a Rainlang word that performs addition. It takes two numbers as inputs and returns their sum.

The numbers 1 and 2 are passed as inputs to the "add" word, separated by a space.

The expression ends with a semicolon, which indicates the end of the expression.

Overall, this expression will take the numbers 1 and 2, add them together, and return the result of 3.
A smart contract could use this result to, for example, decide how many of a token to mint or transfer.

## Try it

Try changing the numbers that are being added in this expression and see how the simulated result changes.

<Parser raw={`_: add(1 2);`} hideSave hideLoad hideExpand hideHelp/>

## Terms

- _Rainlang_: Rainlang is the on-chain language used by Rain Studio to write expressions for Smart Contracts. It is designed to be easily readable and understandable, so that anyone can write expressions without needing to learn a complex programming language.
- _Expression_: An expression is a sequence of Words that can be executed by the on-chain interpreter to instruct a smart contract to do something. An expression can include a combination of words and values, as well as logical and mathematical operations, to perform a specific task or calculation.
- _Words_: In Rainlang, Words are the building blocks of Expressions. They represent the different operations that can be performed, such as addition, multiplication, or comparison. Words are followed by an opening parenthesis ( to include their inputs, and are closed with a closing parenthesis ).
- _Stack_: In Rainlang, the Stack is a data structure that is used to store the results of calculations and other data. It is a First-In-Last-Out (FILO) structure, meaning that the first item pushed onto the stack will be the last item popped off of it.
- _Parameters_: Words in Rainlang take Parameters, which are the values that the Word will operate on. For example, the "add" Word takes parameters and adds them together. Parameters are separated by spaces and are enclosed within parentheses.
- _Outputs_: Each Word produces outputs that are put on the Stack. These are used by the next Word to be executed.
- _Named outputs_: When one line of a Rainlang expression is executed, it will produce one or more Outputs, which are the results of the calculations performed by the Words in the line. Outputs are placed on the Stack and can be used as Inputs in other Expressions.
