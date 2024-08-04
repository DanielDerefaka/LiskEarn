"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import ConnectButton from "./shared/ConnectWallet";
import { getEthEarnContract } from "@/lib/ContractInteraction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "./Loading";

interface Profile {
  name: string;
  category: "creator" | "bounty_hunter" | "Creator";
  profileImg: string;
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
      if (typeof window.ethereum !== "undefined") {
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
        if (!contract) throw new Error("Failed to get contract instance");
        const fetchedProfile = await contract.viewMyProfile();
        setProfile(fetchedProfile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) fetchProfile();
  }, [walletAddress, isConnected]);

  const disconnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Reset states
        setWalletAddress(null);
        setIsConnected(false);
        setProfile(null);
  
        // Clear any stored connection data
        localStorage.removeItem('walletconnect');
  
        // If using Web3Modal, clear its cached provider
        // if (web3Modal) {
        //   await web3Modal.clearCachedProvider();
        // }
  
        // Request MetaMask to disconnect
        if (window.ethereum.disconnect) {
          await window.ethereum.disconnect();
        }
  
        // For older versions of MetaMask or other wallets
        if (window.ethereum.close) {
          await window.ethereum.close();
        }
  
        // Force reload the page to ensure all states are cleared
        // window.location.reload();
      } catch (error) {
        console.error("Failed to disconnect wallet:", error);
        setError("Failed to disconnect wallet. Please try again.");
      }
    }
  };

  // const disconnectWallet = async () => {
  //   if (typeof window.ethereum !== 'undefined') {
  //     // Check if MetaMask is installed and connected
  //     if (window.ethereum.isConnected()) {
  //       // Disconnect from MetaMask
  //       window.ethereum.disconnect()
  //         .then(() => {
  //           console.log('Disconnected from MetaMask');
  //           // Additional actions after disconnection (e.g., updating UI)
  //         })
  //         .catch((error:any) => {
  //           console.error('Error disconnecting from MetaMask:', error);
  //         });
  //     } else {
  //       console.log('MetaMask is not connected');
  //     }
  //   } else {
  //     console.log('MetaMask is not installed');
  //   }
  // }
  const renderProfileSection = () => {
    if (isLoading) return <div className="text-white"><Loading/></div>;
    if (!isConnected) return <ConnectButton />;
    if (profile) {
      if (profile.category === "creator" || profile.category === "Creator") {
        return (
          <Link href="/dashboard">
            <button className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-md transition duration-300 hover:bg-indigo-100">
              Dashboard
            </button>
          </Link>
        );
      } else if (profile.category === "bounty_hunter") {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 rounded-md cursor-pointer p-2 bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                <Image
                  src={profile.profileImg}
                  className="rounded-full object-cover w-10 h-10"
                  alt="Profile"
                  width={32}
                  height={32}
                />
                <span className="text-white font-medium">{profile.name.split(" ")[0]}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2">
              <DropdownMenuItem>
                <Link href="/site/profile" className="w-full">Profile</Link>
               
              </DropdownMenuItem>
               <DropdownMenuItem>
               
                <Link href="/site/submissions" className="w-full">My Submissions</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={disconnectWallet}>
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
    return (
      <Link href="/auth/CreateAccount">
        <button className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-md transition duration-300 hover:bg-indigo-100">
          Create Account
        </button>
      </Link>
    );
  };

  return (
    <nav className="fixed w-full top-0 z-10 bg-gradient-to-r from-purple-600 to-indigo-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-white text-xl font-bold">Lisk Earn</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/site" className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium">
                  Bounties
                </Link>
                <Link href="/site/submissions" className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium">
                  Submissions
                </Link>
                <Link href="/" className="text-white hover:bg-indigo-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium">
                  Dev Connect
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {renderProfileSection()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;