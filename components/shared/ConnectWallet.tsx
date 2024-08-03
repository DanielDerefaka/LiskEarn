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
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div>
      {connected ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;