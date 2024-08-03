import { ethers } from 'ethers';
import { getSigner } from './ethers';
import EthEarnABI from './contractAbi.json';
import { Bounty, Submission, UserData } from '../types';

const CONTRACT_ADDRESS = "0x6cB61A1D885FA497a6a6AC3A3600Fd9bACaeC174";



export  const getEthEarnContract = () => {
  console.log("Getting signer...");
  const signer = getSigner();
  console.log("Signer obtained:", signer);
  console.log("Creating contract instance...");
  const contract = new ethers.Contract(CONTRACT_ADDRESS, EthEarnABI, signer);
  console.log("Contract instance created:", contract);
  return contract;
};