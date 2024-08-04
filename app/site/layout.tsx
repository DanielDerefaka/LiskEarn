"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { getEthEarnContract } from '@/lib/ContractInteraction';



const layout = ({children}: {children: React.ReactNode}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          console.log(provider.getSigner());
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
          setError("Failed to connect to wallet. Please try again.");
        }
      } else {
        alert("Wallet is");
      }
    };

    checkWalletConnection();
  }, []);

  const fetchUserCategory = async () => {
    const contract = await getEthEarnContract();

    if (!contract) {
      alert("Unable to get user profile");
      return;
    }

    const fetchedProfile = await contract.viewMyProfile();

    return fetchedProfile.category;
  }

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchUserCategory().then((res) => {
        if(res === "creator"){
          if(pathname != "/site") {
            alert("Page only accessible to bounty hunters");
            router.push("/dashboard");
          }
        }
      })
    }
  }, [walletAddress, isConnected]);

  return (
   <main className='h-full'>
      <Navbar/> 
      {children}
   </main>
  
  )
}

export default layout