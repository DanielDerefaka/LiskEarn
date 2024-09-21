"use client"
import React from 'react';
import { initializeEthers } from '@/lib/ethers';
import { useConnectionContext } from "@/context/isConnected"
import Link from "next/link";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "../Loading";
import { usePathname } from 'next/navigation';

const ConnectWallet: React.FC = () => {
    const { profile, isLoading, setWalletAddress, setIsConnected, isConnected, setError } = useConnectionContext()
    const pathname = usePathname()

    const disconnectWallet = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                // Reset states
                setWalletAddress(undefined);
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

    const connectWallet = async () => {
        try {
            const { signer } = await initializeEthers();
            const address = await signer.getAddress();
            setWalletAddress(address);
            setIsConnected(true);
        } catch (error) {
            console.error("Failed to connect wallet:", error);
        }
    };

    return (
        <div>
            {isLoading
                ? (<div className='text-white'><Loading /></div>)
                : isConnected
                    ? (profile)
                        ? (profile.category === "creator" || profile.category === "Creator")
                            ? (<Link href="/dashboard">
                                {
                                    pathname == "/site" ? (
                                    <button className="bg-white text-indigo-600  font-semibold px-4 py-2 rounded-md transition duration-300 hover:bg-indigo-100">
                                        Dashboard
                                    </button>) : (
                                        <div className="flex items-center gap-2 rounded-md cursor-pointer p-2 bg-white text-black bg-opacity-20 hover:bg-opacity-30 transition duration-300">
                                            <Image
                                                src={profile.profileImg}
                                                className="rounded-full object-cover w-10 h-10"
                                                alt="Profile"
                                                width={32}
                                                height={32}
                                            />
                                            <span className="font-medium text-indigo-600">{profile.name.split(" ")[0]}</span>
                                        </div>
                                    )
                                }
                            </Link>)
                            : (profile.category === "bounty_hunter")
                                ? (<DropdownMenu>
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
                                </DropdownMenu>)
                                : <p>Invalid Profile</p>
                        : (<Link href="/auth/CreateAccount">
                            <button className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-md transition duration-300 hover:bg-indigo-100">
                                Create Account
                            </button>
                        </Link>)
                    : (<button
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