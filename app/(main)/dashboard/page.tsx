"use client"

import React, { useState, useEffect } from 'react';
import HeaderBox from "@/components/shared/HeaderBox";
import RightSidebar from "@/components/shared/RightSidebar";
import { ethers } from 'ethers';
import { getEthEarnContract } from '@/lib/ContractInteraction';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import ConnectButton from '@/components/shared/ConnectWallet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Goal } from 'lucide-react';

interface Profile {
  name: string;
  category: 'creator' | 'bounty_hunter';
  profileImg: string
}

const Page: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if there's a stored profile in localStorage
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }

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
        if(res === "bounty_hunter"){
          alert("Page only accessible to bounty creators");
          router.push("/site");
        }
      })
    }
  }, [walletAddress, isConnected]);

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
        // Store the fetched profile in localStorage
        localStorage.setItem('userProfile', JSON.stringify(fetchedProfile));
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

  const disconnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setWalletAddress(null);
        setIsConnected(false);
        setProfile(null);
        // Clear the stored profile from localStorage
        localStorage.removeItem('userProfile');
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
      return (
        <Link href="/dashboard">
          {profile.name}
        </Link>
      );
    }
  }

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header font-poppins ">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={profile?.name}
            subtext="Access and manage your Bounty Dashboard "
          />
        </header>
   

      <div className="flex flex-col gap-4 pb-6">
        <div className="flex gap-4 flex-col xl:!flex-row">
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Number of Bounty </CardDescription>
              <CardTitle className="text-4xl">
               
                1
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total Bounty for this account dashboard.
            </CardContent>
            {/* <DollarSign className="absolute right-4 top-4 text-muted-foreground" /> */}
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Users Submission</CardDescription>
              <CardTitle className="text-4xl">
               
               1
             </CardTitle>
              <small className="text-xs text-muted-foreground">
                {/* For the year {currentYear} */}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This is how many users submitted bounty.
            </CardContent>
            {/* <DollarSign className="absolute right-4 top-4 text-muted-foreground" /> */}
          </Card>
          
          <Card className="flex-1 relative">
            <CardHeader>
              <CardTitle>Account Goals </CardTitle>
              {/* <CardDescription>
                <p className="mt-2">
                  Reflects the number of goals you want to own and
                  manage.
                </p>
              </CardDescription> */}
            </CardHeader>
            <CardFooter>
             
            </CardFooter>
            <Goal className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
        </div>
       <div className="flex gap-4 xl:!flex-row flex-col">
          <Card className="flex-1 h-[800px]">
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
          <CardContent className=''>
         
          </CardContent>
          </Card>
        
          <Card className="xl:w-[400px] w-full">
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            
          </Card>
        </div>
      </div>
      </div>
   
    </section>
  );
};

export default Page;