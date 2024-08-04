// components/ConnectButton.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ConnectButton: React.FC = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

    useEffect(() => {
        // Check if already connected
        checkConnection();
        
        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount(null);
                    setProvider(null);
                }
            });
        }

        return () => {
            // Clean up listener
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
            }
        };
    }, []);

    const checkConnection = async () => {
        if (window.ethereum) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await web3Provider.listAccounts();
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                setProvider(web3Provider);
            }
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                await web3Provider.send("eth_requestAccounts", []);
                const signer = web3Provider.getSigner();
                const connectedAddress = await signer.getAddress();
                setAccount(connectedAddress);
                setProvider(web3Provider);
                console.log('Provider:', web3Provider);
            } catch (error) {
                console.error('User rejected the request.');
            }
        } else {
            console.error('No crypto wallet found. Please install it.');
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
    };

    const handleClick = () => {
        if (account) {
            disconnectWallet();
        } else {
            connectWallet();
        }
    };

    
    return (
        <button onClick={handleClick}>
            {account ? `Disconnect: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
    );
};

export default ConnectButton;