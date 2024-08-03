import { ethers } from 'ethers';
import { getSigner } from './ethers';
import EthEarnABI from './contractAbi.json';
import { Bounty, Submission, UserData } from '../types';

const CONTRACT_ADDRESS = "0x8Bd684838524456C5C4396dB0ab6E903D42d3893";



export  const getEthEarnContract = () => {
  console.log("Getting signer...");
  const signer = getSigner();
  console.log("Signer obtained:", signer);
  console.log("Creating contract instance...");
  const contract = new ethers.Contract(CONTRACT_ADDRESS, EthEarnABI, signer);
  console.log("Contract instance created:", contract);
  return contract;
};