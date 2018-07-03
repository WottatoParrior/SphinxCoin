const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.timestamp +
        this.previousHash +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(diff) {
    while (this.hash.substring(0, diff) !== Array(diff + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined" + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.diff = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block("01/01/2017", "Genesis block", "0");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLastBlock().hash
    );
    block.mineBlock(this.diff);

    console.log("Block mined");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalance(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return "2false";
      }

      if (currentBlock.hash !== previousBlock.hash) {
        return false;
      }
      console.log("s");

      return true;
    }
  }
}

let sphinxcoin = new Blockchain();
sphinxcoin.createTransaction(new Transaction("add1", "add2", 100));
sphinxcoin.createTransaction(new Transaction("add2", "add1", 10));

console.log("Starting the miner");
sphinxcoin.minePendingTransactions("chris");

console.log("Balance is", sphinxcoin.getBalance("chris"));

console.log("Starting the miner");
sphinxcoin.minePendingTransactions("chris");

console.log("Balance is", sphinxcoin.getBalance("chris"));
