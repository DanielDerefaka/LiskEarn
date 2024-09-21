"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ConnectButton from "./shared/ConnectWallet";

const Navbar: React.FC = () => {

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
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;