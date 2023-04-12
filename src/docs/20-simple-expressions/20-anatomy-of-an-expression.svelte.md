---
title: Anatomy of an expression
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from '@rainprotocol/rain-svelte-components'
</script>

In Rainlang, expressions are used to perform calculations and other operations on-chain. In this introduction, we'll take a look at the structure and syntax of expressions in Rainlang and explain how they work.

## Overview

In Rainlang, **Expressions** are written using a specific syntax that consists of words, inputs, and outputs. **Words** are functions that perform specific operations, such as addition or multiplication. These functions take inputs (values or other expressions) and produce outputs (the result of the operation).

The syntax for an expression in Rainlang is as follows:

<ForkableFormatter raw={`output: word(input1 input2 ... inputN)`} />

In this syntax, the "output" is the name of the result of the expression, the "word" is the name of the word that is being executed, and the "input1 input2 ... inputN" are the values or expressions that are passed to the function as inputs.

## Words

In Rainlang, there are many different Words that can be used in expressions. Some examples of Words are:

- **add**: adds two or more values together and returns the result.
- **mul**: multiplies two or more values together and returns the result.
- **erc20balanceof**: Returns the balance of an ERC20 token for a specified account.
- **erc721ownerof**: Returns the owner of an ERC721 token for a specified token ID.
- **ensure**: Requires the specified items from the stack to be true (i.e. greater than zero) and reverts the transaction if this condition is not met.
- **hash**: Hashes the specified items from the stack using the Solidity keccak256 function and puts the result back into the stack.

These Words can be used in expressions to perform a wide range of calculations. For example, the following expression calculates the sum of 1 and 2 and names the result "mySum":

<ForkableFormatter raw={`mySum: add(1 2)`} />

We’ll explore more words and their uses throughout these guides.
Inputs
The inputs to a Word can be either numeric values or the results of other expressions. For example, the following expression calculates the product of the sum of 1 and 2 and the difference of 3 and 4 and names the result '\_'. '\_' is used as a placeholder when you don’t want to name the output (see below).

<ForkableFormatter raw={`_: mul(add(1 2) sub(4 3))`} />

In this expression, the add word is used as an input to the mul word. This is an example of a nested expression, where one expression is used as an input to another expression.

## Outputs

The output of an expression is a named value that can be used in other expressions or as an input to a smart contract. For example, the following expression calculates the sum of 1 and 2 and names the result "mySum":

<ForkableFormatter raw={`mySum: add(1 2)`} />

In this expression, the "mySum" value is the output of the add word, and because it’s named it can be used in other lines. If it’s the last line, it will be passed to the host smart contract as an input.

## Use named outputs in subsequent calculations

Now that you know how to make a simple calculation and name its output, you can use that named output in subsequent calculations.

For example, the following program calculates the sum of 1 and 5, then multiplies that result by 2 and names the output "result":

<ForkableFormatter raw={`myCalculation: add(1 5),
result: mul(myCalculation 2);`} />

## Comments

You can use comments for adding notes or explanations to your code.

<ForkableFormatter raw={`\/\*
This is a comment block. In Rainlang, comments start with a slash and an asterisk and end with an asterisk and a slash
*/`} />

## Conclusion

In this tutorial, we explained the syntax and structure of expressions in Rainlang. We discussed how words, inputs, and outputs work in Rainlang and how they can be used to perform a wide range of calculations. By understanding the anatomy of an expression in Rainlang, you can write complex expressions that can be executed on-chain.

A summary of what was covered in this section:

- **Words**: functions that perform specific operations, such as addition or multiplication.
- **Left-hand side**: the part of a Rainlang statement where you name the output of the right-hand side.
- **Right-hand side**: the part of a Rainlang statement that contains "words" (i.e. functions or operations) and their parameters.
- **Named output**: the result of a calculation that is given a name for later use in the program.
- **Placeholder**: a symbol used to represent an unknown or unspecified value.
- **Comments**: a note or explanation added to a program to make it easier to understand.
