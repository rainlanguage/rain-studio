---
title: Writing a FlowERC20 expression
published: true
---

<script>
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import { Parser } from 'rain-svelte-components'

	const expression = `/**
 * separator values 
 */
transferseparator: 0xfea74d0c9bf4a3c28f0dd0674db22a3d7f8bf259c56af19f4ac1e735b156974f,
mintburnseparator: 0xf339171dab445c29f9897dda2f42413426ee907dc7f8b52bd387bc7cf9384c6b,

/**
 * erc1155 transfers
 */
transfererc1155slist: transferseparator,
_ _ _ _: from to id amount,

/**
 * erc721 transfers - this is empty
 */
transfererc721slist: transferseparator,

/**
 * er20 transfers - this is empty
 */
transfererc20slist: transferseparator,

/**
 * native (gas) token transfers
 */
transfernativeslist: transferseparator,

/**
 * burns of this erc20 token
 */
burnslist: mintburnseparator,
_ _ _: from to amount,

/**
 * mints of this erc20 token
 */
mintslist: mintburnseparator,
_ _: to amount;
`

const expression2 = `/**
 * Define named outputs for the values
 */
fromAddress: 0x1;
toAddress: 0x2;
id: 100;
amount: 100;

/**
 * Define the ERC1155 transfer
 */
transfererc1155slist: transferseparator,
_ _ _ _:fromAddress toAddress id amount;`

const expression3 = `/**
 * Define named outputs for the values
 */
fromAddress: 0x1;
toAddress: 0x2;
id: 100;

/**
 * Define the ERC721 transfer
 */
transfererc721slist: transferseparator,
_ _ _:fromAddress toAddress id;`

const expression4 = `/**
 * Define named outputs for the values
 */
fromAddress: 0x1;
toAddress: 0x2;
amount: 100;

/**
 * Define the ERC20 transfer
 */
transfererc20slist: transferseparator,
_ _ _:fromAddress toAddress amount;`
</script>

An ERC20 contract is a type of smart contract that is built on the Ethereum blockchain and conforms to the ERC20 standard. This standard defines a common set of rules that all ERC20 contracts must follow, which makes it easy for different contracts to interoperate with each other. ERC20 contracts are typically used to create and manage digital tokens, which can be used for a wide range of applications, such as representing a company's stock, a virtual currency, or a unique digital asset.

FlowERC20 is a specific implementation of an ERC20 contract that includes support for Rainlang expressions. This allows users to write expressions that can be used to define complex rules and conditions for managing the contract's tokens. For example, an expression could be used to specify that tokens can only be transferred to certain addresses, or that tokens can only be minted if certain conditions are met. This flexibility allows users to create customized ERC20 contracts that can be used for a wide range of applications.

## What is a FlowERC20 expression?

A FlowERC20 expression is a set of instructions written in Rainlang that defines how a FlowERC20 contract should mint, burn, and transfer tokens. These instructions are executed by the Rain Interpreter, which is implemented in the FlowERC20 smart contract on the blockchain.

## How can I use a FlowERC20 expression?

To use a FlowERC20 expression, you would deploy a FlowERC20 contract and provide your expression as an input. This can be done using Rain Studio, a web-based tool for creating, deploying, and managing Rain expressions. Once your FlowERC20 contract is deployed, you can use it to mint, burn, and transfer tokens according to the instructions defined in your expression.

## Structure of the expression

The structure of an expression to be used with a FlowERC20 contract consists of a list of transfers, followed by a list of mints and burns. Each list starts with a separator, which is a specific value that signifies the beginning of the list. For example, the "transferseparator" value is used to indicate the start of a list of transfers, while the "mintburnseparator" value is used to indicate the start of a list of mints and burns.

After the separator, you can define the transfers/mints/burns in the list. For example, to define a transfer of an ERC1155 token, you would specify the "from" address, the "to" address, the "id" of the 1155 token, and the "amount" to transfer. For a mint or burn of the FlowERC20 token, you would specify the "to" address and the "amount" to mint or burn.

It is important to note that you can leave a list empty, but you must still include the separator value. You can also add multiple transfers/mints/burns by copying the line and defining the necessary values.

Here is an example expression that defines a transfer of an ERC1155 token, a mint of the FlowERC20 token, and a burn of the FlowERC20 token:

<ForkableFormatter raw={expression} />

Defining mints and burns
To define a mint of the FlowERC20 token, you can add a line to the "mintsList" that includes the recipient address and the amount to mint. For example, the following expression defines a mint of 100 tokens to the address "recipientAddress":

<ForkableFormatter raw={`mintsList: separator,
_ _: recipientAddress 100;`} />

To define a burn of the FlowERC20 token, you can add a line to the "burnsList" that includes the sender address and the amount to burn. For example, the following expression defines a burn of 100 tokens from the address "senderAddress":

<ForkableFormatter raw={`burnsList: separator,
_ _ _: senderAddress 0 100;`} />

## Defining token transfers

First, let's look at how to define the values for an ERC1155 transfer. In this example, we'll transfer 100 tokens from address 1 to address 2. We'll use named outputs to define the values and then reference them in the transfererc1155slist.

<ForkableFormatter raw={expression2} />

Next, let's look at how to define the values for an ERC721 transfer. In this example, we'll transfer a token with id 100 from address 1 to address 2. We'll use named outputs to define the values and then reference them in the transfererc721slist.

Here's the code:

<ForkableFormatter raw={expression3} />

Finally, let's look at how to define the values for an ERC20 transfer. In this example, we'll transfer 100 tokens from address 1 to address 2. We'll use named outputs to define the values and then reference them in the transfererc20slist.
Here's the code:

<ForkableFormatter raw={expression4} />
