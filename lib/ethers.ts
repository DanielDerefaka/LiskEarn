import { ethers } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';
import Provider from '@walletconnect/ethereum-provider';

let provider: ethers.providers.Web3Provider;
let signer: ethers.Signer;

export const getProvider = () => provider;
export const getSigner = () => signer;

export const initializeEthers = async () => {
  if (typeof window !== 'undefined') {
    if (typeof window.ethereum !== 'undefined') {
      // MetaMask or other injected wallet
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
    } else {
      // WalletConnect
      const wcProvider = await EthereumProvider.init({
        projectId: '84811a63e023e26019d881b8c45c8372', // Replace with your WalletConnect Cloud Project ID
        chains: [1], // Ethereum Mainnet. Add other chain IDs as needed
        showQrModal: true
      });

      await wcProvider.enable();
      provider = new ethers.providers.Web3Provider(wcProvider as any);
    }

    signer = provider.getSigner();
    return { provider, signer };
  } else {
    throw new Error("Window is undefined. Are you running this on the server?");
  }
};

export async function setSigner(pSigner: ethers.providers.JsonRpcSigner) {
  signer = pSigner;
}

export const checkWalletConnection = async () => {
  if(getSigner()) {
    return { signer: await getSigner().getAddress() }
  }else {
    console.log("Wallet Not Connected");
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let pSigner = provider.getSigner();
        if (await pSigner.getAddress()) {
          setSigner(pSigner)
          return {
            isConnected: true,
            signer,
            provider
          }
        }
      } catch (error) {
        return {
          isConnected: false,
        }
      }
    } else {
      return {
        isConnected: false,
      }    
    }
  }
};