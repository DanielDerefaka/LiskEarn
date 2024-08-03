"use client";

import React, { useState } from 'react';
import HeaderBox from "@/components/shared/HeaderBox";
import { ethers } from 'ethers';
import { getEthEarnContract } from '@/lib/ContractInteraction';
import { useRouter } from 'next/navigation';
import ConnectWallet from '@/components/shared/ConnectWallet';
import contractInteractions from '@/lib/Contract';

const Page: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pay, setPay] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endDateTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
      console.log("Submitting bounty with details:", {
        name,
        description,
        pay,
        endDateTimestamp,
      });
      await contractInteractions.makeBounty(name, description, pay, endDateTimestamp);
      alert('Bounty created successfully!');
    } catch (error) {
      console.error("Failed to create bounty:", error);
      setError('Failed to create bounty. See console for details.');
      // Display the actual error message for debugging purposes
      alert(`Error: ${error.message || error}`);
    }
  };

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log("Wallet connected:", address);
        // Set the wallet address in the state if needed
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setError("Failed to connect wallet. Please try again.");
      }
    } else {
      setError('Please install MetaMask!');
    }
  };

  return (
    <section className="home font-poppins">
      <div className="home-content max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="home-header mb-8">
          <HeaderBox
            type="greeting"
            title="Create Bounty"
            user={""}
            subtext="Fill out the form below to create a new bounty."
          />
        </header>

        <div className="bg-white shadow-md rounded-lg p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Bounty Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter bounty name"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter description"
                required
              />
            </div>

            <div>
              <label htmlFor="pay" className="block text-sm font-medium text-gray-700">Pay (in ETH)</label>
              <input
                type="number"
                id="pay"
                value={pay}
                onChange={(e) => setPay(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter payment amount in ETH"
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="datetime-local"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Bounty
              </button>
            </div>
          </form>
          <div className="mt-8">
            <ConnectWallet onClick={handleConnectWallet} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
