import { ethers } from 'ethers';
import { getSigner } from './ethers';
import EthEarnABI from './contractAbi.json';

const CONTRACT_ADDRESS = "0x34c93240C1584D7C9b9592c5246F9F1EE5D65ed5";

export  const getEthEarnContract = () => {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, EthEarnABI, getSigner());
  console.log("Contract instance created:", contract);
  return contract;
};

