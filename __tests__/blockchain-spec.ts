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