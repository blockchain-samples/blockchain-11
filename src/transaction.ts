export class Transaction {
  public id?:string;
  constructor(public amount: number, public sender: string, public recipient: string) {
  }
}
