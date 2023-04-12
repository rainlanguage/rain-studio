---
title: Set and get
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from '@rainprotocol/rain-svelte-components'
</script>

## Step 1: Set up the expression

Browse back to the expression you’ve marked as ‘My Second Expression’. Use this box to experiment with ideas below.

## Step 2: Experiment

In Rainlang, the "set" and "get" words allow you to store and retrieve values between executions of a contract’s expressions across transactions/blocks.

This functionality is similar to naming outputs and using them later in an expression, but named outputs are only available within the same transaction. "Set" and "get", on the other hand, allow you to maintain values between transactions.

For example, you might use "set" and "get" to keep track of the total number of a particular token that has been created over multiple executions of an expression. Alternatively, you could use them to determine if a wallet address has previously interacted with the expression.

The "set" word has the syntax "set(key value)", where "key" is a unique identifier for the value and "value" is the value you want to store. For example, the following expression uses the "set" word to store the number 10 under the key "myValue":

<ForkableFormatter raw={`:set(myValue 10)`} />

Notice that the line starts with a colon (:). This is required for all lines in Rainlang, even those that do not produce an output. In this case, since the "set" word does not produce an output, you must still start the line with a colon.

The "get" word has the syntax "get(key)", where "key" is the unique identifier for the value you want to retrieve. For example, the following expression uses the "get" word to retrieve the value stored under the key "myValue":

<ForkableFormatter raw={`result: get(myValue)`} />

To use the "set" and "get" words in an expression, you can combine them with other Rainlang words and operations. For example, the following expression calculates the sum of 1 and 5 and stores the result under the key "myValue":

<ForkableFormatter raw={`:set(myValue add(1 5))`} />

You can also use the "get" word to retrieve the stored value and use it in subsequent calculations. For example, the following expression retrieves the value stored under the key "myValue" and multiplies it by 2:

<ForkableFormatter raw={`result: mul(get(myValue) 2)`} />

In this case, the "get" word will retrieve the value stored under the key "myValue" (i.e. 6), and the "mul" word will multiply it by 2 to produce the final output of 12.

To accumulate values over time, you can use the "set" and "get" words in combination with other Rainlang words and operations. For example, the following expression uses the "add" word to increment the value stored under the key "myValue" by 1.

<ForkableFormatter raw={`:set(myValue add(get(myValue) 1))`} />

In this case, the "get" word retrieves the value stored under the key "myValue" (i.e. 6), the "add" word adds 1 to that value (i.e. 7), and the "set" word stores the result (i.e. 7) under the key "myValue" for future use.

You can also use logic words like "if" to control the flow of your program based on the values stored in the interpreter. For example, the following expression uses the "if" word to check if the value stored under the key "myValue" is greater than 10, and names the output "result":

<ForkableFormatter raw={`result: if(greater-than(get(myValue) 10) 1 0)`} />

In this case, the "if" word will evaluate the condition "greater-than(get(myValue) 10)" using the value stored under the key "myValue" (i.e. 7). Since the value is not greater than 10, the "if" word will return 0, which is the value specified for the "false" case. The output of the expression is named "result".

By using the "set" and "get" words in Rainlang expressions, you can store and retrieve values over time and control the flow of your expression based on those values. This allows you to perform complex calculations and make decisions based on the results.
