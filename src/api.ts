/* tslint:disable:no-console */
import * as bodyParser from "body-parser";
import * as express from "express";
import * as uuid from 'uuid';
import { Block } from "./block";
import { Blockchain } from "./blockchain";


const port = process.argv[2];
const currentNodeUrl = process.argv[3];

const blockchain = new Blockchain();

const nodeAddress = uuid().split("-").join("");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/blockchain", (req, res) => {
  res.send(blockchain);
});


app.get("/transaction", (req, res) => {
  res.send("Hello World");
});

app.post("/transaction", (req, res) => {
  const { amount, sender, recipient } = req.body;

  const blockIndex = blockchain.createNewTransaction(amount, sender, recipient);
  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

app.get("/mine", (req, res) => {
  const lastBlock:Block = blockchain.getLastBlock();
  const previousBlockHash = lastBlock.hash;
  const currentBlock = blockchain.getPendingBlock();

  const nonce = blockchain.proofOfWork(previousBlockHash, currentBlock);
  const blockHash = blockchain.hashBlock(previousBlockHash, currentBlock, nonce);

  const newBlock = blockchain.createNewBlock(nonce, previousBlockHash, blockHash);

  blockchain.createNewTransaction(12.5, "00", nodeAddress);

  res.json({
    block: newBlock,
    note: "New block mined successfully"
  });

});

app.post("/register-and-broadcast-node", (req, res) => {

  const {
    body: { newNodeUrl }
  } = req;

});

app.post("/register-node", (req, res) => {


});

app.post("/register-nodes-bulk", (req, res) => {


});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);

});
