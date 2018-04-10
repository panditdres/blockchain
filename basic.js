const SHA256 = require('crypto-js/SHA256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
    }

    createGenesisBlock(){
        // time stamp can be anything and since it's the first block, previous hash can be anything as well
        return new Block(0, "01/01/2018", "Genesis Block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        // in reality, you need a lot more checks before being able to add new blocks
        // demo of how a block chain works
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
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

console.log('mineblock 1...')
pancoin.addBlock(new Block(1,"10/01/2018", {amount: 50}));
console.log('mineblock 2...')
pancoin.addBlock(new Block(2,"10/02/2018", {amount: 150}));
pancoin.addBlock(new Block(3,"10/03/2018", {amount: 250}));
pancoin.addBlock(new Block(4,"10/04/2018", {amount: 350}));



// Try to alter the chain and make it invalid by changing the data
// pancoin.chain[1].data = { amount: 550 }
// pancoin.chain[1].hash = pancoin.chain[1].calculateHash();

// Note: blockchain is design to add a block but not to change/tamper a block or a delete a block again
// console.log(JSON.stringify(pancoin, null, 4));
// console.log("Is blockchain valid? " + pancoin.isChainValid())