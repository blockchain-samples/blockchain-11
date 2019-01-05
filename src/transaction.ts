export class Transaction {
  constructor(
    private amount: number,
    private sender: string,
    private recipient: string
  ) {}
}
