const express = require('express')
const Web3 = require('web3')
const web3 = new Web3('https://mainnet.infura.io/v3/6fdac103735f42b3ad9692ac9843ea12')
const app = express()
const port = 3000
const { contract_receipt, account_receipt, erc20_receipt } = require('./functions')


// api to get the transaction details
app.get('/eth/api/v1/transaction/:txhash', async (req, res) => {
    // Parsing param to get the hash
    const { txhash } = req.params;

    // Getting transaction and transaction-receipt from hash
    const receipt = await web3.eth.getTransactionReceipt(txhash);
    const transaction = await web3.eth.getTransaction(txhash);
    const negativeSign = "-"

    // if contracct-address is not null then the hash belonged to contract-deployment transaction
    if (receipt.contractAddress != null){
        const result = await contract_receipt(receipt, transaction, negativeSign)
        res.send(result)
    }
    // if hash is null then hash belongs to tansaction-execution 
    else if(receipt.contractAddress == null){
        // If transfer is not ERC20 token tranfer then their will be no logs
        if(receipt.logs.length==0){
            const result = await account_receipt(receipt, transaction, negativeSign)
            res.send(result)
        }
        else{
            const result = await erc20_receipt(receipt, transaction, negativeSign)
            res.send(result)
        }
    }
})

module.exports = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})