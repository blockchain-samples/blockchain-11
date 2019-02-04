# Purpose
This repo is an implementation of [Learn-Blockchain-Programming-with-JavaScript](https://github.com/PacktPublishing/Learn-Blockchain-Programming-with-JavaScript) 
done in Typescript instead of javascript. The book the source code is based on can be found here:

[https://www.packtpub.com/web-development/learn-blockchain-programming-javascript](https://www.packtpub.com/web-development/learn-blockchain-programming-javascript)

I was not a fan of the javascript style used in the book so decided to do it in typescript instead. I can't guarantee 
that I followed all the best coding styles, but did try to clean things up as I went. 

# Running

### Start all the nodes:
```
npm run start
npm run node_1
npm run node_2
npm run node_3
npm run node_4
npm run node_5
```

This would start an instance on localhost ports 3000-3005. Then the nodes need to be registered with each other.

### Register the nodes with each other
```$shell
http :3000/register-and-broadcast-node newNodeUrl='http://localhost:3001'
http :3000/register-and-broadcast-node newNodeUrl='http://localhost:3002'
http :3000/register-and-broadcast-node newNodeUrl='http://localhost:3003'
http :3000/register-and-broadcast-node newNodeUrl='http://localhost:3004'
http :3000/register-and-broadcast-node newNodeUrl='http://localhost:3005'
```

The API can be used to post transactions to the chain and to mine new blocks.

[Block Explorer](http://localhost:3000/block-explorer) can be used to search the chain and view transactions, blocks, and balances. (See `src/index.html`)

See `src/api.ts` for the full API



