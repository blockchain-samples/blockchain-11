import { Block } from "./block";
import { Transaction } from "./transaction";

export class Blockchain {
  private chain: Array<Block> ;
  private newTransactions: Array<Transaction>;

  constructor() {
    this.chain = [];
    this.newTransactions = [];
  }

  createNewBlock(nonce:any, previousBlockHash:string, hash:string): Block {
    const newBlock = new Block(
      this.chain.length + 1,
      Date.now(),
      this.newTransactions,
      nonce,
      hash, previousBlockHash
    );

    this.newTransactions = [];
    this.chain.push(newBlock);
    
    return newBlock;
  } ;
}