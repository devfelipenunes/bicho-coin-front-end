import Web3 from "web3";
import ABI from "./ABI.json";
import { ethers } from "ethers";
import axios from "axios";
import { postBalance, postMintTransfer, postTransfer } from "./ApiService";

const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");

const CONTRACT_ADDRESS = `${process.env.NEXT_PUBLIC_ADAPTER_ADDRESS}`;
const WALLET = `${process.env.NEXT_PUBLIC_WALLET_ADDRESS}`;

const account = web3.eth.accounts.privateKeyToAccount(
  "0x" + "8769726e73bf74579f0648125a6c1b3e7cf345b208655b3650dcf4ecc171883b"
);
web3.eth.accounts.wallet.add(account);

export function getContract() {
  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, {
    from: WALLET,
  });
  return contract;
}

async function getNonce(): Promise<bigint> {
  const nonce = await web3.eth.getTransactionCount(wallet);
  return nonce;
}

async function getGasPrice(): Promise<bigint> {
  const gasPrice = await web3.eth.getGasPrice();
  return gasPrice;
}

function getProvider(): ethers.BrowserProvider {
  if (!window.ethereum) throw new Error("No MetaMask found");
  return new ethers.BrowserProvider(window.ethereum);
}

export async function approve(): Promise<string> {
  const provider = getProvider();

  const wallet = getWallet();
  const contract = getContract();
  const gasPrice = await web3.eth.getGasPrice();
  const approvaelAmount = web3.utils.toHex(3);

  const nonce = await web3.eth.getTransactionCount(WALLET);
  const tx = await contract.methods.approve(WALLET, approvaelAmount).send({
    nonce: nonce,
    gasPrice: gasPrice,
    from: wallet,
  });
  console.log("tx", tx);

  // if (tx) {
  //   console.log("Approved");
  //   const allowance = await contract.methods.allowance(wallet, WALLET).call();
  //   console.log(allowance);
  // }
  // return tx.transactionHash;
  // const tx = await contract.methods.transfer(WALLET, 1).send({
  //   nonce: nonce,
  //   gasPrice: gasPrice,
  // });
  // return tx.transactionHash;
}

function getWallet() {
  const wallet = localStorage.getItem("wallet");
  return wallet;
}

export function doLogout(): boolean {
  localStorage.removeItem("wallet");
  localStorage.removeItem("balance");
  localStorage.removeItem("play");
  return true;
}

export async function mint(): Promise<string> {
  const wallet = localStorage.getItem("wallet");
  const tx = await postMintTransfer(wallet);
  return tx.data;
}

export async function doLogin(): Promise<string> {
  const provider = getProvider();
  const accounts = await provider.send("eth_requestAccounts", []);
  if (!accounts || !accounts.length) throw new Error(`No accounts found!`);
  localStorage.setItem("wallet", accounts[0]);

  return accounts[0];
}

export async function balance(): Promise<string> {
  const wallet = getWallet();
  const balance = await postBalance(wallet);
  localStorage.setItem("balance", balance);
  return balance;
}

export async function transfer(value: string): Promise<string> {
  const tx = await postTransfer(value);
  return tx.data;
}

export async function transferFrom(from, value) {
  const response = await axios.post(
    `http://localhost:3001/transfer/${from}/${value}`
  );
  return response.data;
}
