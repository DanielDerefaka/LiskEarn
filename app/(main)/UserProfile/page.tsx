"use client";
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { getEthEarnContract } from '@/lib/ContractInteraction';
import { UserData } from '@/types';
import ConnectWallet from '@/components/shared/ConnectWallet';
import Image from 'next/image';
import { ethers } from 'ethers';

const Profile: NextPage = () => {
  const [profile, setProfile] = useState<UserData | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check wallet connection and set wallet address
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
          setError("Failed to connect to wallet. Please try again.");
        }
      }
    };

    checkWalletConnection();
  }, []);

  // Fetch profile once the wallet address is set
  useEffect(() => {
    const fetchProfile = async () => {
      if (!walletAddress) return;

      setIsLoading(true);
      setError(null);

      try {
        const contract = getEthEarnContract();
        if (!contract) {
          throw new Error("Failed to get contract instance");
        }
        const fetchedProfile = await contract.viewMyProfile();
        setProfile(fetchedProfile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchProfile();
    }
  }, [walletAddress, isConnected]);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        setIsConnected(true);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setError("Failed to connect wallet. Please try again.");
      }
    } else {
      setError('Please install MetaMask!');
    }
  };

  return (
    <div>
      <h1 className='fv'>My Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isConnected ? (
        <ConnectWallet onClick={handleConnectWallet} />
      ) : isLoading ? (
        <p>Loading profile...</p>
      ) : profile ? (
        <div>
          <h2>{profile.name}</h2>
          <p>Email: {profile.email}</p>
          <p>Category: {profile.category}</p>
          {profile.profileImg && (
            <Image src={profile.profileImg} alt="Profile" width={50} height={50} />
          )}
        </div>
      ) : (
        <p>No profile found. Please create a profile.</p>
      )}
    </div>
  );
};

export default Profile;