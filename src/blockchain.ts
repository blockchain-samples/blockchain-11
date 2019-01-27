import shajs = require('sha.js');
import uuid = require("uuid");
import { Block } from "./block";
import { Transaction } from "./transaction";

export class Blockchain {

  public readonly chain: Block[];
  public currentNodeUrl?:string;
  public networkNodes:string[];

  private pendingTransactions: Transaction[];

  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.networkNodes = [];
    this.createNewBlock(100, "0", "0");
  }

  public getPendingBlock():Block {
    return new Block(this.chain.length + 1, this.pendingTransactions);
  }

  public createNewBlock(nonce: any, previousBlockHash: string, hash: string): Block {
    const newBlock = new Block(
      this.chain.length + 1,
      this.pendingTransactions
    );

    newBlock.timestamp = Date.now();
    newBlock.nonce = nonce;
    newBlock.hash = hash;
    newBlock.previousBlockHash = previousBlockHash;

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  public getLastBlock(): Block  {
    const len = this.chain.length;
    return this.chain[len - 1] ;
  }

  public createNewTransaction(
    amount: number,
    sender: string,
    recipient: string
  ): Transaction {
    const newTransaction = new Transaction();
    newTransaction.amount = amount;
    newTransaction.sender = sender;
    newTransaction.recipient = recipient;
    newTransaction.id = uuid().split("-").join("");


    return newTransaction;
  }

  public addTransactionToPendingTransactions(transaction: Transaction) {
    this.pendingTransactions.push(transaction);
    const lastBlock = this.getLastBlock();
    return lastBlock ? lastBlock.index + 1 : 0;
  }

  public hashBlock(
    previousBlockHash: string,
    currentBlock: Block,
    nonce: number
  ): string {
    const dataAsString =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlock);
    const hash = shajs("sha256")
      .update(dataAsString)
      .digest("hex");
    return hash;
  }

  public clearPendingTransactions(){
    this.pendingTransactions = [];
  }
  public proofOfWork(previousBlockHash: string, currentBlock: Block): number {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlock, nonce);

    while (hash.substring(0, 4) !== "0000") {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlock, nonce);
    }

    return nonce;
  }
}
