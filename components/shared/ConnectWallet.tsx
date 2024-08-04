import React, { useState, useEffect } from 'react';
import { initializeEthers } from '@/lib/ethers';

const ConnectWallet: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    try {
      const { signer } = await initializeEthers();
      const address = await signer.getAddress();
      setAddress(address);
      setConnected(true);
      // Removed the window.location.reload() to prevent automatic page refresh
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      try {
        const { provider } = await initializeEthers();
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setConnected(true);
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