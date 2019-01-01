import { Block } from "./block";
import { Transaction } from "./transaction";
const shajs = require('sha.js');

export class Blockchain {
  private chain: Array<Block> ;
  private pendingTransactions: Array<Transaction>;

  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.createNewBlock(100, '0', '0');
  }

  createNewBlock(nonce:any, previousBlockHash:string, hash:string): Block {
    const newBlock = new Block(
      this.chain.length + 1,
      Date.now(),
      this.pendingTransactions,
      nonce,
      hash, previousBlockHash
    );

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  };
  
  getLastBlock(): Block|null {
    let len = this.chain.length;
    return len > 0 ? this.chain[len - 1] : null;
  }

  createNewTransaction(amount: number, sender: string, recipient: string): number {
    const newTransaction = new Transaction(amount, sender, recipient);
    this.pendingTransactions.push(newTransaction);
    let lastBlock = this.getLastBlock();

    return lastBlock ? lastBlock.getIndex()+1 : 0;
  }

  getChain(): Array<Block>{
    return this.chain;
  }

  hashBlock(previousBlockHash: string, currentBlock: Block, nonce: number): string {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlock);
    const hash = shajs('sha256').update(dataAsString).digest('hex');
    return hash;
  }

  proofOfWork(previousBlockHash: string, currentBlock: Block):number {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlock, nonce);

    while (hash.substring(0, 4) !== '0000') {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlock, nonce);
    }

    return nonce
  }
}