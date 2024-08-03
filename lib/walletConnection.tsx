// utils/wallet.ts
import { ethers } from 'ethers';
import Cookies from 'js-cookie';

export async function connectWalletButton() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Set the wallet address in a cookie
      Cookies.set('walletAddress', address, { expires: 7 }); // expires in 7 days

      return address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  } else {
    throw new Error('No Ethereum wallet found');
  }
}