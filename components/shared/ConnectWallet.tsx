import React, { useState, useEffect } from 'react';
import { initializeEthers } from '@/lib/ethers';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from 'ethers';

const ConnectWallet: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    try {
      let provider;
      
      if (typeof window.ethereum !== 'undefined') {
        // MetaMask (or other injected wallet)
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
      } else {
        // WalletConnect
        provider = new WalletConnectProvider({
          infuraId: "84811a63e023e26019d881b8c45c8372", // Replace with your Infura ID
        });
        await provider.enable();
        provider = new ethers.providers.Web3Provider(provider);
      }

      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
      setConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setConnected(true);
          }
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error);
      }
    };
    checkConnection();
  }, []);

  return (
    <div>
      {connected ? (
        <p>Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md transition duration-300 hover:bg-indigo-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;