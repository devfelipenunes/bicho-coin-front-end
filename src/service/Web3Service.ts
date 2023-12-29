import Web3 from "web3";
import ABI from "./ABI.json";
import { ethers } from "ethers";
import axios from "axios";

const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");

const account = web3.eth.accounts.privateKeyToAccount(
  "0x" + "8769726e73bf74579f0648125a6c1b3e7cf345b208655b3650dcf4ecc171883b"
);
web3.eth.accounts.wallet.add(account);

function getProvider(): ethers.BrowserProvider {
  if (!window.ethereum) throw new Error("No MetaMask found");
  return new ethers.BrowserProvider(window.ethereum);
}

export function doLogout(): boolean {
  localStorage.removeItem("wallet");
  localStorage.removeItem("balance");
  localStorage.removeItem("play");
  return true;
}

export async function mint() {
  const account = localStorage.getItem("wallet");
  const response = await axios.post(`http://localhost:3001/mint/${account}`);
  return response.data;
}

export async function doLogin(): Promise<string> {
  const provider = getProvider();
  const accounts = await provider.send("eth_requestAccounts", []);
  if (!accounts || !accounts.length) throw new Error(`No accounts found!`);
  localStorage.setItem("wallet", accounts[0]);
  return accounts[0];
}

export async function getBalance(): Promise<string> {
  const account = localStorage.getItem("wallet");
  const response = await axios.post(`http://localhost:3001/balance/${account}`);
  localStorage.setItem("balance", response.data);
  return response.data;
}

export async function transfer(value) {
  const response = await axios.post(`http://localhost:3001/transfer/${value}`);
  return response.data;
}

export async function transferFrom(from, value) {
  const response = await axios.post(
    `http://localhost:3001/transfer/${from}/${value}`
  );
  return response.data;
}
