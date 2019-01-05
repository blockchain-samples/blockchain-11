import { Transaction } from "./transaction";

export class Block {
  public index: number = 1;
  public timestamp: number|null = null;
  public transactions: Transaction[]=[];
  public nonce: any;
  public hash: string = "";
  public previousBlockHash: string = '';

  constructor(index: number, transactions: Transaction[]) {
    this.index = index;
    this.transactions = transactions;
  }
}
