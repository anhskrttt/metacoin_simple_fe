# MetaCoin with simple FE

<!-- ABOUT THE PROJECT -->

## About The Project

Add something here.

### Built With

- HTML/CSS/JS
- Truffle
- 

<!-- GETTING STARTED -->

## Getting Started

Add something here.

### Prerequisites

- Nodejs
- Truffle
- Ganache
- Metamask

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

#### Using Ganache as local blockchain

0. Clone the repo
   ```sh
   git clone https://github.com/anhskrttt/metacoin_simple_fe.git
   ```
1. Launch Ganache. Add truffle-config.js if needed
2. Compile & Deploy contract
   ```sh
   truffle deploy
   ```
3. Save the Metacoin contract's address and add it to the app/script.js (var METACOIN_ADDRESS)
4. Add senderAddr and receiverAddr as the first and second account's address (public key) in your local blockchain
5. Launch the .html file and check if there's any error

#### Added Metamask

Just the same as above but you must add Ganache to Metamask: [Source](https://dapp-world.com/blogs/01/how-to-connect-ganache-with-metamask-and-deploy-smart-contracts-on-remix-without-1619847868947#:~:text=Connection%20of%20Ganache%20with%20Metamask%20%3A&text=Open%20Metamask%20and%20go%20to,ID%20for%20ganache%20is%201337.)

![2021-05-01_11-03_1](https://user-images.githubusercontent.com/41201391/161360766-c18dd9dd-b488-4a84-b4f1-e9300891b314.png)


#### Using live node (E.g. Infura/Tomochain)