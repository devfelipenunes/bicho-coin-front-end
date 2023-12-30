import axios from "axios";

const API = `${process.env.NEXT_PUBLIC_API_URL}`;

export async function postMintTransfer(wallet: string): Promise<string> {
  const response = await axios.post(`${API}/player/mint/${wallet}`);
  return response.data;
}

export async function postBalance(wallet: string): Promise<string> {
  const response = await axios.post(`${API}/player/balance/${wallet}`);
  return response.data;
}

export async function postTransfer(value: string): Promise<string> {
  const response = await axios.post(`${API}/player/transfer/${value}`);
  return response.data;
}
