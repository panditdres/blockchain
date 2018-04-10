const SHA256 = require('crypto-js/SHA256');

class Transaction {
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("blockmines " + this.hash)
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5; //  higher difficulty takes longer to generate a block 
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        // time stamp can be anything and since it's the first block, previous hash can be anything as well
        return new Block(0, "01/01/2018", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransaction(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions); // in reality, miners have to pick their transactions that they want to include
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined ');
        this.chain.push(block);

        this.pendingTransactions = [ new Transaction(null, miningRewardAddress, this.miningReward) ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                // if you are the from address, you transfer the $ away from your wallet hence reduce balance
                // if you are the to address, vice versa
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                } 
            }
        }

        return balance;
    }

    // method to check the integrity of the chain
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let pancoin = new Blockchain();

pancoin.createTransaction(new Transaction('address1', 'address2', 100)); // address1 and address2 would be the public key of someone's wallet
pancoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log("\n Starting the miner...")
pancoin.minePendingTransaction('reddit-address');

console.log("\n Balance of Reddit:", pancoin.getBalanceOfAddress('reddit-address'));

console.log("\n Starting the miner again...")
pancoin.minePendingTransaction('reddit-address');

console.log("\n Balance of Reddit:", pancoin.getBalanceOfAddress('reddit-address'));
