"use client";
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { getEthEarnContract } from '@/lib/ContractInteraction';
import { UserData } from '@/types';
import ConnectWallet from '@/components/shared/ConnectWallet';
import Image from 'next/image';
import { ethers } from 'ethers';
import contractInteractions from '@/lib/Contract';
import { useConnectionContext } from '@/context/isConnected';

const Profile: NextPage = () => {
  const [profile, setProfile] = useState<UserData | null>(null);
  const {isConnected, walletAddress, setIsConnected, setWalletAddress} = useConnectionContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <section className="min-h-screen flex w-full items-center justify-center">
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
              <ConnectWallet />
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
                      src={profile.profileImg} 
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
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
                  <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">Wallet Address</label>
                  <input 
                    type="text" 
                    id="walletAddress" 
                    value={profile.walletAddress}  
                    // onChange={(e) => {
                    //   setProfile({...profile,name: e.target.value});
                    // } }
                    readOnly
                    className="mt-1 block w-full  rounded-md border-gray-300 shadow-sm focus:border-transparent focus:ring-transparent p-5 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select 
                    id="category" 
                    value={profile.category} 
                    className="mt-1 block w-full rounded-md border-gray-300 p-5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    // onChange={(e) => {
                    //   setProfile({...profile,category: e.target.value});
                    // }}
                    disabled
                  >
                    <option value="creator">Creator</option>
                    <option value="bounty_hunter">Bounty Hunter</option>
                  </select>
                </div>
               
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
