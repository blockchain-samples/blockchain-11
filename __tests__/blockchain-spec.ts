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

})