/* tslint:disable:no-console */
import * as bodyParser from "body-parser";
import * as express from "express";
import * as rp from "request-promise";
import * as uuid from "uuid";
import { Block } from "./block";
import { Blockchain } from "./blockchain";
import { Transaction } from "./transaction";


const port = process.argv[2];
const currentNodeUrl = process.argv[3];

const blockchain = new Blockchain();
blockchain.currentNodeUrl = currentNodeUrl;

const nodeAddress = uuid().split("-").join("");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/blockchain", (req, res) => {
  res.json(blockchain);
});

app.get("/block-explorer", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.get("/consensus", (req, resp) => {
  const requestPromises: rp.RequestPromise[]= [];
  blockchain.networkNodes.forEach(networkUrl => {
    const requestOptions = { json: true, method: "GET", uri: `${networkUrl}/blockchain` };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises).then(blockchains => {
    let maxChainLength = blockchain.chain.length;
    let longestChain = null;
    let pendingTransactions: Transaction[] = [];
    blockchains.forEach(otherChain => {
      if (otherChain.chain.length > maxChainLength) {
        maxChainLength = otherChain.chain.length;
        longestChain = otherChain.chain;
        pendingTransactions = otherChain.pendingTransactions;
      }
    });

    if (!longestChain || !Blockchain.isChainValid(longestChain)) {
      resp.json({ chain: blockchain.chain, note: "Current chain has not been replaced" });
    } else {
      blockchain.chain = longestChain;
      blockchain.pendingTransactions = pendingTransactions;
      resp.json({ chain: blockchain.chain, note: "This chain has been replaced" });
    }
  });
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

  const nonce = Blockchain.proofOfWork(previousBlockHash, currentBlock);
  const blockHash = Blockchain.hashBlock(previousBlockHash, currentBlock, nonce);

  const newBlock = blockchain.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises:rp.RequestPromise[] = [];
  blockchain.networkNodes.forEach(nodeUrl => {

    const requestOptions = {
      body: { newBlock },
      json: true,
      method: 'POST',
      uri: nodeUrl + "/receive-new-block"
    };
    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises).then(data =>{
    const transactionOptions = {
      body: {
        amount: 12.5,
        recipient: nodeAddress,
        sender: "00"
      },
      json: true,
      method: "POST",
      uri: blockchain.currentNodeUrl + "/transaction/broadcast"
    };

    return rp(transactionOptions);
  });
  res.json({
    block: newBlock,
    note: "New block mined successfully"
  });

});

app.post("/receive-new-block", (req, res) => {
  const newBlock = req.body.newBlock;
  const lastBlock = blockchain.getLastBlock();
  const correctHash:boolean = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex:boolean = lastBlock.index + 1 === newBlock.index;


  if (correctHash && correctIndex) {
    blockchain.chain.push(newBlock);
    blockchain.clearPendingTransactions();

    res.json({ note: "New block received and accepted.", newBlock });
  } else {
    res.json({
      newBlock,
      note: "New block rejected."
    });
  }


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
  }:{ body: Transaction} = req;

  const newTransaction = Blockchain.createNewTransaction(+amount, sender, recipient);
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
    res.json({ note: "Transaction created and broadcast successfully" });
  });
});

app.get("/block/:blockHash", (req, resp) => {
  const blockHash = req.params.blockHash;
  const foundBlock = blockchain.getBlock(blockHash);
  if (foundBlock) {
    resp.json({ block: foundBlock });
  } else {
    resp.status(404).json({ error: "block not found" });
  }
});

app.get("/transaction/:transactionId", (req, resp) => {
  const transactionId = req.params.transactionId;
  const blockAndTransaction = blockchain.getTransaction(transactionId);
  if (blockAndTransaction && blockAndTransaction.transaction) {
    resp.json({ result: blockAndTransaction });
  } else {
    resp.status(404).json({ error: "transaction not found" });
  }
});

app.get("/address/:address", (req, resp) => {
  const address = req.params.address;
  const { addressTransactions, balance } = blockchain.getAddressData(address);
  if (addressTransactions && addressTransactions.length > 0) {
    resp.json({ addressTransactions, balance });
  } else {
    resp.status(404).json({ message: "address not found" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);

});
