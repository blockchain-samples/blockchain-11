export class Block {
  private index: number;
  private timestamp: number;
  private transactions: Array<any>;
  private nonce: any;
  private hash: string;
  private previousBlockHash: string;

  constructor(index:number, timestamp:number, transactions:Array<any>, nonce:any, hash:string, previousBlockHash:string) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = nonce;
    this.hash = hash;
    this.previousBlockHash = previousBlockHash;
  }

  getIndex(): number{
    return this.index;
  }
  getTimestamp(): number{
    return this.timestamp;
  }
  getTransaction(): Array<any> {
    return this.transactions;
  }
  getNonce(): any { return this.nonce; };
  
  getHash(): string{ return this.hash };
  getPreviousBlockHash(): string { return this.previousBlockHash };

}