---
title: Rain words
published: true
---

In Rainlang, Words are the fundamental building blocks of Rainlang expressions. A "Word" is a unit of logic that performs a specific operation or function, similar to opcodes or instructions in other programming languages. Words are combined together to form Expressions, which are used to perform calculations or execute specific tasks.

## Categories of Words

There are several categories of Rain words, each with a specific set of functions. For example:

- The **math** category contains words that perform mathematical operations, such as "add" and "mul" for addition and multiplication. An expression such as "add(1 2)" would take the inputs 1 and 2, add them together, and return the result.
- The **core** category includes words that are essential for executing expressions, such as "call" and "context". The "call" word allows users to run a source with specific inputs and outputs, while the "context" word enables the use of arguments passed to a contract's function.
- The **erc20** category includes words for working with ERC20 tokens, such as "erc20balanceof" for checking an account's balance of an ERC20 token.
- The **crypto** category includes words that perform cryptographic operations, such as "hash" for hashing values.

## Examples of Words

Here are some examples of different Rain words and how they are used in expressions:

- The "add" word is used to perform addition on its inputs. For example, the expression "add(1 2)" would take the inputs 1 and 2, add them together, and return the result 3.
- The "mul" word is used to perform multiplication on its inputs. For example, the expression "mul(2 3)" would take the inputs 2 and 3, multiply them together, and return the result 6.
- The "if" word is used to perform conditional branching. For example, the expression "if(greater-than(1 2) add(1 2) mul(1 2))" would first check if 1 is greater than 2 using the "greater-than" word. If the condition is true, the "add" word would be executed and the result 3 would be returned. If the condition is false, the "mul" word would be executed and the result 2 would be returned.
- The "set" word is used to store a value in memory. For example, the expression "set(x add(1 2))" would take the result of "add(1 2)", which is 3, and store it in memory under the key "x". This value can then be accessed and used in future expressions using the "get" word.

## List of all categories

| Name      | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| CHAINLINK | Functions related to calling a Chainlink oracle                              |
| CORE      | Basic functions for calling other sources and manipulating the stack         |
| CRYPTO    | Functions for hashing data                                                   |
| ERC20     | Functions for interacting with ERC20 tokens                                  |
| ERC721    | Functions for interacting with ERC721 tokens                                 |
| ERC1155   | Functions for interacting with ERC1155 tokens                                |
| EVM       | Functions for interacting with the Ethereum Virtual Machine                  |
| ERROR     | Functions for handling errors and exceptions                                 |
| MATH      | Mathematical functions for performing calculations on the stack              |
| LIST      | Functions for working with lists of values                                   |
| LOGIC     | Logical functions for making decisions and controlling the flow of a program |
| ORDERBOOK | Functions for interacting with an order book                                 |
| SALE      | Functions for working with a sale contract                                   |
| TIER      | Functions for interacting with a tier contract                               |
