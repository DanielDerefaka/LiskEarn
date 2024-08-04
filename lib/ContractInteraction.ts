import { ethers } from 'ethers';
import { getSigner } from './ethers';
import EthEarnABI from './contractAbi.json';
import { Bounty, Submission, UserData } from '../types';

const CONTRACT_ADDRESS = "0x34c93240C1584D7C9b9592c5246F9F1EE5D65ed5";



export  const getEthEarnContract = () => {
  console.log("Getting signer...");
  const signer = getSigner();
  console.log("Signer obtained:", signer);
  console.log("Creating contract instance...");
  const contract = new ethers.Contract(CONTRACT_ADDRESS, EthEarnABI, signer);
  console.log("Contract instance created:", contract);
  return contract;
};

