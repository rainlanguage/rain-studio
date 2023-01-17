---
title: Understanding the stack
published: true
---

<script>
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import { Parser } from 'rain-svelte-components/package'
</script>

## Understanding the Stack in Rainlang

In Rainlang, the stack is a First-In-Last-Out (FILO) data structure that is used to store numeric constants and the results of calculations. In this tutorial, we'll explain how the stack works in Rainlang and how to use it to write expressions.

## [Overview](#overview)

Rainlang is a stack-based programming language, which means that data and calculations are performed using a stack. In this language, opcodes (operators) act on values that are pushed onto the stack, and the result of the operation is also pushed onto the stack. This allows for the creation of complex expressions that can be executed by an interpreter (the Rain Interpreter) implemented in a smart contract on the blockchain.

This allows users to perform computations on-chain and use the results to accomplish tasks like minting, burning, or transferring tokens. Because Rainlang is stack-based, the order of operations is determined by the order in which values are pushed onto the stack, rather than the order in which they appear in the expression.

## [Basic operations](#basic-operations)

To understand how the stack works in Rainlang, let's start with a simple expression that calculates the sum of 1 and 2 and names the output "myCalculation":

<Formatter raw={`myCalculation: add(1 2)`} />

This expression has two inputs, 1 and 2, and one output, the result of adding 1 and 2 (i.e. 3). When this expression is executed, the interpreter takes the inputs from the stack, performs the calculation, and puts the result back into the stack. In this case, the stack will look like this after the expression is executed:

```
[3]

```

As you can see, the stack contains one item, the result of the calculation.

## Nested expressions

In Rainlang, you can nest expressions within other expressions. For example, the following expression calculates the sum of 1 and 2, then multiplies that result by 3 and names the output "result":

<Formatter raw={`result: mul(add(1 2) 3)`} />

This expression has two nested expressions, the first of which calculates the sum of 1 and 2, and the second of which multiplies that result by 3. When this expression is executed, the interpreter evaluates the nested expressions in order, starting with the innermost expression. In this case, the stack will look like this after the innermost expression (i.e. add(1 2)) is executed:

```
[3]

```

Then, the interpreter will evaluate the second nested expression (i.e. mul(add(1 2) 3)), which puts the number 3 on the stack. At this point, the stack will look like this:

```
[3, 3]

```

Next, the interpreter multiplies the top two items on the stack (i.e. 3 \* 3) and puts the result back into the stack. In this case, the stack will look like this after the second nested expression is executed:

```
[9]

```

## Conclusion

In this tutorial, we explained how the stack works in Rainlang and how to use it to write expressions. We showed how to use named outputs and placeholders on the left-hand side of an expression, and we demonstrated how to nest expressions within other expressions. By understanding the stack and how it works, you can write complex expressions in Rainlang that perform a wide range of calculations.
