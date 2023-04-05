---
title: Delimiting lines
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from 'rain-svelte-components'
</script>

## Step 1: Environment

Browse back to the expression you’ve marked as ‘My First Expression’
Use this box to experiment with ideas below

## Step 2: Experimenting

In Rainlang, each line of code must be delimited with a comma, and each source in an expression must be delimited with a semicolon. This means that each statement or expression must be followed by a comma, and each source must be followed by a semicolon, except for the last line of code and the last source in a program.

For example, the following program calculates the sum of 1 and 2 and names the output "myCalculation", then multiplies that result by 3 and names the output "result":

<ForkableFormatter raw={`myCalculation: add(1 2),
result: mul(myCalculation 3);`} />

Notice that each line of code is followed by a comma, except for the last line, which must be followed by a semicolon. This is the correct way to delimit lines in Rainlang.

An expression can have multiple sources, which are sub-expressions delimited by a semicolon. Some contracts may require multiple sources in an expression, used for different things. For example, in an Order expression the first source is used by the Orderbook contract to clear an order, and the second source is used to do any additional calculations after the order has been cleared.

Here is an example of an expression with multiple sources. The following expression has two sources.

<ForkableFormatter raw={`myCalculation: add(1 2);
myCalculation: mul(1 2);`} />

In this example, the first source calculates the sum of 1 and 2 and names the output "myCalculation". The second source multiplies them together, and also names the output “myCalculation”. You can do this because named outputs are not shared between sources. Notice that each source is followed by a semicolon, except for the last source.

If an expression has only one source, then there must be a semicolon at the end of the line. For example, the following expression has only one source and therefore requires a semicolon at the end:

<ForkableFormatter raw={`myCalculation: add(1 2);`} />

If you forget to include the comma or semicolon at the end of a line, you will get a syntax error when you try to run your program. For example, the following expression has only one source but is missing the semicolon at the end, so it will produce a syntax error:

<ForkableFormatter raw={`myCalculation: add(1 2)`} />

To fix this error, simply add a semicolon at the end of the line, like this:

<ForkableFormatter raw={`myCalculation: add(1 2);`} />

In summary, it is important to remember to delimit each line of code with a comma and each source with a semicolon.
