const Web3 = require('web3')
const web3 = new Web3('https://mainnet.infura.io/v3/6fdac103735f42b3ad9692ac9843ea12')

// Get the chain name based on chanid
// The function is only written for ETH testchain and main-chain
function getChain(chainId){
    if(chainId == '0x1'){
        return 'ETH.main'
    }
    if(chainId == '0x3'){
        return 'ETH.ropten'
    }
    if(chainId == '0x4'){
        return 'ETH.rinkeby'
    }
    if(chainId == '0x5'){
        return 'ETH.Gorli'
    }
    if(chainId == '0x42'){
        return 'ETH.kovan'
    }
}

// Preparing the result to send
// logs.length should not be zero
async function contract_receipt(receipt, transaction, negativeSign){
    const contractReceipt = {
        block: { blockHeight: receipt.blockNumber }, 
        outs: [],
        ins: [],
        hash: receipt.blockHash,
        currency: "ETH", 
        chain: getChain(transaction.chainId),
        status: "",
        depositType: "Contract" 
    }

    for(let i=0; i<receipt.logs.length; i++){
        const outJson = {
            address: receipt.logs[i].topics[2], 
            value: await Web3.utils.hexToNumberString(receipt.logs[i].data),
            type : "transfer",
            coinspecific: {
                tokenAddress: receipt.logs[i].address 
            }
        }
        contractReceipt.outs.push(outJson)

        const inJson= {
            address: receipt.logs[i].topics[1], 
            value: negativeSign.concat(await Web3.utils.hexToNumberString(receipt.logs[i].data)),
            type : "transfer",
            coinspecific: {
                tokenAddress: receipt.logs[i].address 
            }
        }
        contractReceipt.ins.push(inJson)
    }
    
    if(receipt.status){
        contractReceipt.status = "confirmed"
    }else{
        contractReceipt.status = "failed"
    }

    return contractReceipt;
}

// Preparing the result to send
async function account_receipt(receipt, transaction, negativeSign){
    const accountReceipt = {
        block: { 
            blockHeight: receipt.blockNumber
        }, 
        outs: [{ address: receipt.to, value: transaction.value }],
        ins: [{ address: receipt.from, value: negativeSign.concat(transaction.value) }],
        hash: receipt.blockHash,
        currency: "ETH", 
        chain: getChain(transaction.chainId),
        status: "",
        depositType: "Contract" 
    }

    if(receipt.status){
        accountReceipt.status = "confirmed"
    }else{
        accountReceipt.status = "failed"
    }

    return accountReceipt
}

// Preparing the result to send
async function erc20_receipt(receipt, transaction, negativeSign){
    const erc20Receipt = {
        block: { blockHeight: receipt.blockNumber }, 
        outs: [],
        ins: [],
        hash: receipt.blockHash,
        currency: "ETH", 
        chain: getChain(transaction.chainId),
        status: "",
        depositType: "Contract" 
    }

    for(let i=0; i<receipt.logs.length; i++){
        const outJson = {
            address: receipt.logs[i].topics[2], 
            value: await Web3.utils.hexToNumberString(receipt.logs[i].data),
            type : "token",
            coinspecific: {
                tokenAddress: receipt.logs[i].address 
            }
        }
        erc20Receipt.outs.push(outJson)

        const inJson= {
            address: receipt.logs[i].topics[1], 
            value: negativeSign.concat(await Web3.utils.hexToNumberString(receipt.logs[i].data)),
            type : "token",
            coinspecific: {
                tokenAddress: receipt.logs[i].address 
            }
        }
        erc20Receipt.ins.push(inJson)
    }
    
    if(receipt.status){
        erc20Receipt.status = "confirmed"
    }else{
        erc20Receipt.status = "failed"
    }

    return erc20Receipt;
}


module.exports = {
    getChain,
    contract_receipt,
    account_receipt,
    erc20_receipt
}