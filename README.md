# Assignment


## Quick Start 

1. git clone
2. cd Blockchain
3. Install dependencies : npm install
4. Start application : npm start
5. Run test : npm test

## API

1. **/eth/api/v1/transaction/:txhash**

    Params: valid txhash

    Return: transaction receipt

    Description:

    The Api takes valid txhash and gets the transaction and transaction-receipt. Then it checks 
    the following things: 

    1. contractAddress field: If the contractAddress is not null then the transaction belongs to contract-deployment / contract-execution type else it belongs to tranfer type.

    2. logs length: The tranfer function of ERC20 token takes three argument and these arguments is stored in the the logs[].topics . So if logs.length is zero then it is account transaction else it is ERC20 token-transaction 
