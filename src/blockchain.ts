import { Block } from "./block";
import { Transaction } from "./transaction";

export class Blockchain {
  private chain: Array<Block> ;
  private pendingTransactions: Array<Transaction>;

  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
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
}