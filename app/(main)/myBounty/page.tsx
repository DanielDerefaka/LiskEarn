"use client"
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import contractInteractions from "@/lib/Contract";
import { Bounty } from "@/types";
import { ethers } from "ethers";
import { stat } from "fs";
import { getEthEarnContract } from "@/lib/ContractInteraction";
import MapBounties from "@/components/MapBounties";
import { initializeEthers } from "@/lib/ethers";
import { usePathname, useRouter } from "next/navigation";
import { useConnectionContext } from "@/context/isConnected";

type BountyProp = {
    name: string,
    description: string,
    owner: string,
    pay: number,
    endDate: number,
    timestamp: number,
    state?: boolean,
    id: string
}

const BountySec = () => {
    const [Bounties, setBounties] = useState<any[]>([]);
    const [State, setState] = useState<string>("all");
    const [error, setError] = useState<string>();
    const pathname = usePathname();
    const router = useRouter();
    const {walletAddress, isConnected} = useConnectionContext();

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

    const fetchBounties = async () => {
        let bounties = await contractInteractions.getUserBounties();

        const processedBounties = bounties.map((bounty: any) => {
            return {
                id: bounty.id.toString(),
                name: bounty[1], // or bounty.name
                description: bounty[2], // or bounty.description
                owner: bounty[3], // or bounty.owner, 
                pay: ethers.utils.formatEther(bounty[5]),
                state: bounty[6],
                timestamp: new Date(bounty[7].toNumber() * 1000).toLocaleString(),
                endDate: new Date(bounty[8].toNumber() * 1000).toLocaleString(),
            };
        });

        setBounties(processedBounties);
    }

    useEffect(() => {
        console.log(isConnected);
        if (isConnected && walletAddress) {
            fetchBounties();
        }
    }, [State, isConnected, walletAddress]);

    return (
        <div className="mt-5 flex flex-col gap-3 px-12">
            {
                Bounties.length > 0 ? Bounties.map((b: BountyProp, i) => {
                    return <MapBounties state={b.state} name={b.name} owner={b.owner} pay={b.pay} endDate={b.endDate} entryDate={b.timestamp} description={b.description} key={i} id={b.id} endBounty />
                }) : <h3 className="text-2xl">No Bounty found in this category</h3>
            }
        </div>
    );
};

export default BountySec;
