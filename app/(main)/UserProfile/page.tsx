"use client";
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { getEthEarnContract } from '@/lib/ContractInteraction';
import { UserData } from '@/types';
import ConnectWallet from '@/components/shared/ConnectWallet';
import Image from 'next/image';
import { ethers } from 'ethers';
import contractInteractions from '@/lib/Contract';

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
    <section className="home">
      <div className='home-content max-w-4xl mx-auto py-12'>
        <div className="w-full bg-white shadow-md rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold">User Profile</h2>
            <p className="text-gray-600">View and manage your profile information</p>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!isConnected ? (
            <div className="text-center py-8">
              <p className="mb-4 text-lg">Connect your wallet to view your profile</p>
              <ConnectWallet onClick={handleConnectWallet} />
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <p className="text-lg">Loading profile...</p>
            </div>
          ) : profile ? (
            <div className="space-y-6">
              <div className='flex justify-between items-center'>
                <div className="flex items-center space-x-6">
                  {profile.profileImg && (
                    <Image 
                      src={"/"+profile.profileImg} 
                      alt="Profile" 
                      width={100} 
                      height={0} 
                      className="rounded-full object-cover w-10 h-10"
                    />
                  )}
                  <div>
                    <h2 className="text-2xl font-semibold">{profile.name}</h2>
                    <p className="text-gray-600">{profile.category}</p>
                  </div>
                </div>
                <div>
                  <p>Email: {profile.email}</p>
                </div>
              </div>

              <form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={profile.name}  
                    onChange={(e) => {
                      setProfile({...profile,name: e.target.value});
                    } }
                    className="mt-1 block w-full  rounded-md border-gray-300 shadow-sm focus:border-transparent focus:ring-transparent p-5 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select 
                    id="category" 
                    value={profile.category} 
                    className="mt-1 block w-full rounded-md border-gray-300 p-5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onChange={(e) => {
                      setProfile({...profile,category: e.target.value});
                    }}
                  >
                    <option value="creator">Creator</option>
                    <option value="bounty_hunter">Bounty Hunter</option>
                  </select>
                </div>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={async (e) => {
                  e.preventDefault();

                  let pro = await contractInteractions.updateUserProfile(profile.name, profile.email, profile.profileImg);

                  setProfile(pro);
                }}>
                  Edit Profile
              </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="mb-4 text-lg">No profile found. Please create a profile.</p>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
