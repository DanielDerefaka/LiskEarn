"use client"
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ConnectButton from './shared/ConnectWallet';
import { getEthEarnContract } from '@/lib/ContractInteraction';
import { UserData } from '@/types';
import { useRouter } from 'next/navigation';
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';

interface Profile {
  name: string;
  category: 'creator' | 'bounty_hunter';
  profileImg: string
}

const Navbar: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
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

  // Add disconnect wallet function
  const disconnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Reset states
        setWalletAddress(null);
        setIsConnected(false);
        setProfile(null);

        // If using Web3Modal or similar library, you might need to call their disconnect method
        // await web3Modal.clearCachedProvider();

        // Reload the page to ensure all states are cleared
        router.refresh();
      } catch (error) {
        console.error("Failed to disconnect wallet:", error);
        setError("Failed to disconnect wallet. Please try again.");
      }
    }
  };

  const renderProfileSection = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isConnected) {
      return <ConnectButton />;
    }

    if (profile) {
      if (profile.category === 'creator') {
        return (
          <Link href="/dashboard">
            <button className='bg-black p-2 px-5 py-2 text-white rounded-sm'>Dashboard</button>
          </Link>
        );
      } else if (profile.category === 'bounty_hunter') {
        return <div>
           <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <div className='flex gap-2 rounded-md cursor-pointer hover:bg-slate-50 p-2'>
            <div> 
                  <Image src={profile.profileImg} className='rounded-full object-cover w-8 h-8' alt='image' width={30} height={0} />
            </div>
            <div className='mt-0'>
            <p>{profile.name.split(' ')[0]}</p>

            </div>

          </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
      <DropdownMenuItem>
            <Link href="/UserProfile">  
            Profille
            </Link>
          </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
            <Link href="/UserProfile">  
            Profille
            </Link>
          </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnectWallet}>
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
        </div>;
      }
    }

    return (
      <Link href="/create-account">
        <button>Create Account</button>
      </Link>
    );
  };

  return (
    <nav className="flex fixed w-full top-0 z-10 items-center justify-between flex-wrap bg-black-2 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link href="/">
          <span className="font-semibold text-xl text-black">Lisk Earn</span>
        </Link>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          <Link href="/bounties" className="block mt-4 lg:inline-block lg:mt-0  mr-4">
            Bounties
          </Link>
          <Link href="/grant" className="block mt-4 lg:inline-block lg:mt-0  mr-4">
            Grant
          </Link>
          <Link href="/dev-connect" className="block mt-4 lg:inline-block lg:mt-0 ">
            Dev Connect
          </Link>
        </div>
        <div>
          {renderProfileSection()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;