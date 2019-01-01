import { Blockchain } from '../src/blockchain';

test('Blockchain should be created', () => {
  const blockchain = new Blockchain();
  expect(blockchain).toBeTruthy();
});

test('New Block should be created', () => {
  const blockchain = new Blockchain();
  const newBlock = blockchain.createNewBlock(1111, 'hash2', 'hash1');
  console.log(newBlock);
  const anotherBlock = blockchain.createNewBlock(2222, 'hash3', 'hash2');
  console.log(anotherBlock);

  console.log(blockchain);
  expect(newBlock).toBeTruthy();
});

test('Create new transactions', () => {
  const blockchain = new Blockchain();
  blockchain.createNewBlock(789457, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56'); 

  blockchain.createNewTransaction(100, 'ALEX', 'JENN');


  console.log(blockchain);
  blockchain.createNewBlock(548764, 'AKMC875E6S1RS9', 'WPLS214R7T6SJ3G2'); 
  
  expect(blockchain.getChain()[1]).toBeTruthy();
  console.log(blockchain.getChain()[1]);
});

test('SHA256 has of block', () => {
  const blockchain = new Blockchain();
  const previousBlockHash = '87765DA6CCF0668238C1D27C35692E11';
  
  blockchain.createNewTransaction(10, 'B4CEE9C0E5CD571', '3A3F6E462D48E9');
  const currentBlock = blockchain.createNewBlock(1234, previousBlockHash, '3A3F6E462D48E9');

  let hash = blockchain.hashBlock(previousBlockHash, currentBlock, 1234);
  let hash2 = blockchain.hashBlock(previousBlockHash, currentBlock, 1234);
  console.log({message:'Hash Value', hash, hash2});
  expect(hash).toBeTruthy();
  expect(hash2).toEqual(hash);
});

test('Proof Of Work should work', () => {
  const blockchain = new Blockchain();
  const previousHash = 'OINAISDFN009'

  blockchain.createNewTransaction(101, 'N90ANS9', '90NA90SNDF');
  blockchain.createNewTransaction(30, '09ANS09', 'UIANSIUDFUI');
  blockchain.createNewTransaction(200, '89ANS89DFN98', 'AUSDF89ANSD9');

  let nonce = 100;
  let newBlock = blockchain.createNewBlock(nonce, previousHash, 'hash???');

  nonce = blockchain.proofOfWork(previousHash, newBlock);
  console.log({ nonce });
  expect(nonce).toBeGreaterThan(100);
})
