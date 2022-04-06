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
const METACOIN_ADDRESS = "0x659D92685F98b555450fD40C2d5249E2cc0d902A";
// const METACOIN_ADDRESS = ;

const ethereumButton = document.querySelector(".enableEthereumButton");
const showAccount = document.querySelector(".showAccount");

// Check if Metamask is installed
// If not, return to local network (ganache)
if (typeof web3 !== "undefined") {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

document.addEventListener("DOMContentLoaded", function (event) {
  if (window.ethereum) {
    // ethereum.request({ method: "eth_requestAccounts" });

    getAccount();

    ethereum.on("ChainChanged", () => window.location.reload());

    ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        console.log(accounts[0]);
        console.log(22222222222);
        senderAddr = accounts[0];

        showAccount.innerHTML = "Account: " + accounts[0];
        document.getElementById("content").style.display = "block";
      }
    });
  } else {
    console.error("Install Metamask.");

    document.getElementById("alert_metamask").style.display = "block";
    $(".enableEthereumButton").attr("disabled", "false");
  }
});

// Easier to debug later
// window.web3 = web3;

var metaCoinInstance = new web3.eth.Contract(
  JSON.parse(JSON.stringify(MetaCoinABI)),
  METACOIN_ADDRESS
);

function getBalance() {
  let addr_value = document.getElementById("b_addr").value;

  $("#al_inva").hide();

  if (web3.utils.isAddress(addr_value)) {
    document.getElementById("err_invalid").style.display = "none";
    metaCoinInstance.methods.getBalance(addr_value).call(function (err, res) {
      if (err) {
        console.log("An error occured", err);
        return;
      } else {
        console.log("The balance is: ", res);

        document.getElementById("gb_p").style.display = "block";
        document.getElementById("gb_addr").innerHTML = " " + addr_value + " ";
        document.getElementById("o_balance").innerHTML = res;
      }
    });
  } else {
    console.log("Invalid input");
    $("#al_inva").show();
  }
}

async function sendCoinTo() {
  document.getElementById("err_invalid").style.display = "none";

  let inputs = document.getElementById("sc_form").elements;
  let receiver_addr = inputs["s_addr"].value; // Receiver Address
  let amount_token = inputs["s_amount"].value; // Amount
  let transactionReceipt = null;

  console.log("Sender: ", senderAddr);
  await metaCoinInstance.methods
    .sendCoin(receiver_addr, amount_token)
    .send({ from: senderAddr }, async function (error, transactonHash) {
      if (error) {
        console.log("An error occured", err);
        document.getElementById("err_invalid").style.display = "block";
        document.getElementById("err_invalid").innerHTML = err;
        return;
      } else {
        console.log("Submitted transaction with hash: ", transactonHash);
        // while (transactionReceipt == null) {
        //   // Waiting until the transaction is mined
        //   transactionReceipt = await web3.eth.getTransactionReceipt(
        //     transactonHash
        //   );
        // }

        transactionReceipt = await web3.eth.getTransactionReceipt(
          transactonHash
        );
        console.log("Got the transaction receipt: ", transactionReceipt);

        document.getElementById("sc_hash").style.display = "block";
        document.getElementById("hash").innerHTML = transactonHash;
      }
    });

  let [, ...topics] = transactionReceipt.logs[0].topics;
  let txInfo = web3.eth.abi.decodeLog(
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

ethereumButton.addEventListener("click", () => {
  getAccount();
  console.log("Enter ethereumbutton");
});

async function getAccount() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  senderAddr = accounts[0];
  showAccount.innerHTML = "Account: " + account;
  console.log("Account: ", account);
  $("#al_sc").show();

  document.getElementById("content").style.display = "block";

  $(".enableEthereumButton").attr("disabled", "true");
  $(".enableEthereumButton").html("Connected");
}
