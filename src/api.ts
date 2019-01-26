/* tslint:disable:no-console */
import * as bodyParser from "body-parser";
import * as express from "express";
import * as rp from "request-promise";
import * as uuid from "uuid";
import { Block } from "./block";
import { Blockchain } from "./blockchain";


const port = process.argv[2];
const currentNodeUrl = process.argv[3];

const blockchain = new Blockchain();
blockchain.currentNodeUrl = currentNodeUrl;

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
  const newTransaction = req.body;
  const index = blockchain.addTransactionToPendingTransactions(newTransaction);

  res.json({ note: `Transaction will be added in block ${index}` });
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

  if (blockchain.networkNodes.indexOf(newNodeUrl) < 0) {
    blockchain.networkNodes.push(newNodeUrl);
  }

  const regNodesPromises: any[] | rp.RequestPromise[] = [];
  blockchain.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      body: { newNodeUrl },
      json: true,
      method: "POST",
      uri: `${networkNodeUrl}/register-node`
    };

    regNodesPromises.push(rp(requestOptions));
  });

  Promise.all(regNodesPromises).then(data => {
    const bulkRegisterOptions = {
      body: { allNetworkNodes: [...blockchain.networkNodes, blockchain.currentNodeUrl] },
      json: true,
      method: "POST",
      uri: `${newNodeUrl}/register-nodes-bulk`
    };

    return rp(bulkRegisterOptions);
  }).then(data => {

    res.json({ note: "New Node registered with network successfully" });
  });

});

app.post("/register-node", (req, res) => {

  const {
    body: { newNodeUrl }
  } = req;
  console.log(`registering new url: ${newNodeUrl} on ${blockchain.currentNodeUrl}`);

  if (blockchain.networkNodes.indexOf(newNodeUrl) < 0
    && newNodeUrl !== blockchain.currentNodeUrl) {

    blockchain.networkNodes.push(newNodeUrl);
  }
  res.json({ note: "New node registered successfully" });

});

app.post("/register-nodes-bulk", (req, res) => {

  const {
    body: { allNetworkNodes }
  } = req;

  console.log(`registering bulk nodes ${JSON.stringify(allNetworkNodes)}`);

  if (allNetworkNodes) {
    allNetworkNodes.forEach((networkNodeUrl: string) => {

      if (blockchain.networkNodes.indexOf(networkNodeUrl) < 0
        && blockchain.currentNodeUrl !== networkNodeUrl) {

        blockchain.networkNodes.push(networkNodeUrl);
      }

    });

  }

  res.json({ note: "Bulk registration successful" });

});

app.post("/transaction/broadcast", (req, res) => {

  const {
    body: { amount, sender, recipient }
  } = req;
  const newTransaction = blockchain.createNewTransaction(amount, sender, recipient);
  blockchain.addTransactionToPendingTransactions(newTransaction);

  const requestPromises: rp.RequestPromise[]= [];

  blockchain.networkNodes.forEach(networkUrl => {
    const requestOptions = {
      body: newTransaction,
      json: true,
      method: "POST",
      uri: networkUrl + "/transaction"
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then(data => {
    console.log(data);
    res.json({ note: "Transaction created and broadcast successfully" });
  });



});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);

});
