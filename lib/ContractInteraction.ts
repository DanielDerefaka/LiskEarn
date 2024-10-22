import { ethers } from 'ethers';
import { getSigner } from './ethers';
import EthEarnABI from './contractAbi.json';

const CONTRACT_ADDRESS = "0x776730646d40248a2579E5C567032D3162E4E392";

export  const getEthEarnContract = () => {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, EthEarnABI, getSigner());
  console.log("Contract instance created:", contract);
  return contract;
};

