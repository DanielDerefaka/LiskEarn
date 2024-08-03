import { ethers } from 'ethers';

let provider: ethers.providers.Web3Provider;
let signer: ethers.Signer;

export const initializeEthers = async () => {
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    return { provider, signer };
  } else {
    throw new Error("Please install MetaMask!");
  }
};

export const getProvider = () => provider;
export const getSigner = () => signer;