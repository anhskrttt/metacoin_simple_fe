const MetaCoinABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "sendCoin",
    outputs: [
      {
        internalType: "bool",
        name: "sufficient",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "getBalanceInEth",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
var senderAddr;
// Add yoru contract address here.
const METACOIN_ADDRESS = "0x2808196F26cC7d7072f285fe71db230720BD6201";

document.addEventListener("DOMContentLoaded", function (event) {
  if (window.ethereum) {
    ethereum.request({ method: "eth_requestAccounts" });

    ethereum.on("ChainChanged", () => window.location.reload());

    ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        console.log(accounts[0]);
        senderAddr = accounts[0];
      }
    });
  } else {
    console.error("Install Metamask.");
  }
});

var web3;

if (typeof web3 !== "undefined") {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

window.web3 = web3;

var metaCoinInstance = new web3.eth.Contract(
  JSON.parse(JSON.stringify(MetaCoinABI)),
  METACOIN_ADDRESS
);

var accounts = async function () {
  await web3.eth.getAccounts();
};

// Please change these 2 lines.
// var senderAddr = "0x237ee09CaBF1c46E2275e37d500fFC0b7fe2D228";
var receiverAddr = "0xda7175932B62b77363fdE7773eb24943bcE77255";

function getBalance() {
  var sender = document.getElementById("b_addr").value;

  if (web3.utils.isAddress(sender)) {
    document.getElementById("err_invalid").style.display = "none";
    metaCoinInstance.methods.getBalance(sender).call(function (err, res) {
      if (err) {
        console.log("An error occured", err);
        return;
      } else {
        console.log("The balance is: ", res);

        document.getElementById("gb_p").style.display = "block";
        document.getElementById("gb_addr").innerHTML = " " + sender + " ";
        document.getElementById("o_balance").innerHTML = res;
      }
    });
  } else {
    console.log("Invalid input");
    document.getElementById("err_invalid").style.display = "block";
  }
}

function sendCoinTo() {
  document.getElementById("err_invalid").style.display = "none";

  var inputs = document.getElementById("sc_form").elements;
  var receiver_addr = inputs["s_addr"].value; // Receiver Address
  var amount_token = inputs["s_amount"].value; // Amount
  let transactionReceipt = null;

  (async function () {
    metaCoinInstance.methods
      .sendCoin(receiver_addr, amount_token)
      .send({ from: senderAddr }, async function (error, transactonHash) {
        if (error) {
          console.log("An error occured", err);
          document.getElementById("err_invalid").style.display = "block";
          document.getElementById("err_invalid").innerHTML = err;
          return;
        } else {
          console.log("Submitted transaction with hash: ", transactonHash);
          while (transactionReceipt == null) {
            // Waiting expectedBlockTime until the transaction is mined
            transactionReceipt = await web3.eth.getTransactionReceipt(
              transactonHash
            );
          }
          console.log("Got the transaction receipt: ", transactionReceipt);

          document.getElementById("sc_hash").style.display = "block";
          document.getElementById("hash").innerHTML = transactonHash;

          var [, ...topics] = transactionReceipt.logs[0].topics;
          var txInfo = web3.eth.abi.decodeLog(
            [
              {
                indexed: true,
                internalType: "address",
                name: "_from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "_to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "_value",
                type: "uint256",
              },
            ],
            transactionReceipt.logs[0].data,
            topics
          );

          document.getElementById("sc_info").innerHTML =
            "Transfer Event:<br/> _from: " +
            txInfo[0] +
            "<br/>_to: " +
            txInfo[1] +
            "<br/>_amount: " +
            txInfo[2];
        }
      });
  })();
}