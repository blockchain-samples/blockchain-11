import { Blockchain } from '../src/blockchain';

test('Blockchain should be created', () => {
  const blockchain = new Blockchain();
  expect(blockchain).toBeTruthy();
});

test('New Block should be created', () => {
  const blockchain = new Blockchain();
  const newBlock = blockchain.createNewBlock(1111, 'hash2', 'hash1');
  console.debug(newBlock);
  const anotherBlock = blockchain.createNewBlock(2222, 'hash3', 'hash2');
  console.debug(anotherBlock);

  console.debug(blockchain);
  expect(newBlock).toBeTruthy();
});

test('Create new transactions', () => {
  const blockchain = new Blockchain();
  blockchain.createNewBlock(789457, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56');

  Blockchain.createNewTransaction(100, 'ALEX', 'JENN');

  console.debug(blockchain);
  blockchain.createNewBlock(548764, 'AKMC875E6S1RS9', 'WPLS214R7T6SJ3G2');

  expect(blockchain.chain[1]).toBeTruthy();
  console.debug(blockchain.chain[1]);
});

test('SHA256 has of block', () => {
  const blockchain = new Blockchain();
  const previousBlockHash = '87765DA6CCF0668238C1D27C35692E11';

  Blockchain.createNewTransaction(10, 'B4CEE9C0E5CD571', '3A3F6E462D48E9');
  const currentBlock = blockchain.createNewBlock(
    1234,
    previousBlockHash,
    '3A3F6E462D48E9'
  );

  const hash = Blockchain.hashBlock(previousBlockHash, currentBlock, 1234);
  const hash2 = Blockchain.hashBlock(previousBlockHash, currentBlock, 1234);
  console.debug({ message: 'Hash Value', hash, hash2 });
  expect(hash).toBeTruthy();
  expect(hash2).toEqual(hash);
});

test('Proof Of Work should work', () => {
  const blockchain = new Blockchain();
  const previousHash = 'OINAISDFN009';

  Blockchain.createNewTransaction(101, 'N90ANS9', '90NA90SNDF');
  Blockchain.createNewTransaction(30, '09ANS09', 'UIANSIUDFUI');
  Blockchain.createNewTransaction(200, '89ANS89DFN98', 'AUSDF89ANSD9');

  let nonce = 100;
  const newBlock = blockchain.createNewBlock(nonce, previousHash, 'hash???');

  nonce = Blockchain.proofOfWork(previousHash, newBlock);
  console.debug({ nonce });
  expect(nonce).toBeGreaterThan(100);
});


test("Chain Validation should work", () => {
  const blockChain = new Blockchain();
  const jsonChain = {
    "chain": [{
      "index": 1,
      "timestamp": 1549127307046,
      "transactions": [],
      "hash": "0",
      "previousBlockHash": "0",
      "nonce": 100
    }, {
      "index": 2,
      "timestamp": 1549127350033,
      "transactions": [],
      "hash": "0000c821654ed8f4a56d1d8206916f5f7eacd0e16f9b78269b41e4210e016eb9",
      "previousBlockHash": "0",
      "nonce": 105902
    }, {
      "index": 3,
      "timestamp": 1549127495020,
      "transactions": [{
        "amount": 12.5,
        "sender": "00",
        "recipient": "57397b8833774836b3dfaec8409fc3b9",
        "id": "40a2e2ce0754417086adac084f2d37e9"
      }, { "amount": "10", "sender": "SENDER", "recipient": "RECIPIENT", "id": "7eb4a3db36ef43a3825103f96266bbf2" }],
      "hash": "0000c7a3c2602ef396eb69dadcc537563bd716d15739ad93052500654beff611",
      "previousBlockHash": "0000c821654ed8f4a56d1d8206916f5f7eacd0e16f9b78269b41e4210e016eb9",
      "nonce": 100424
    }],
    "pendingTransactions": [{
      "amount": 12.5,
      "sender": "00",
      "recipient": "57397b8833774836b3dfaec8409fc3b9",
      "id": "4546e505844941a289a04ead27e75238"
    }],
    "networkNodes": [],
    "currentNodeUrl": "http://localhost:3000"
  };

  const testChain = Object.assign(new Blockchain(), jsonChain);
  const isValid = Blockchain.isChainValid(testChain.chain);
  expect(isValid).toBeTruthy();
});
