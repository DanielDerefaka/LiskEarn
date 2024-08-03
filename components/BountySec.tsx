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
import MapBounties from "./MapBounties";
import contractInteractions from "@/lib/Contract";
import { Bounty } from "@/types";
import { ethers } from "ethers";
import { stat } from "fs";
import { getEthEarnContract } from "@/lib/ContractInteraction";

type BountyProp ={
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
  const [walletAddress, setWalletAddress] = useState<string>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>();

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

  const fetchBounties = async () => {
    let bounties = [];

    switch (State) {
      case "all":
        bounties = await contractInteractions.getAllBounties();
        console.log(bounties);
        break;

      case "open":
        bounties =await contractInteractions.getAllActiveBounties()
        break;

      case "ended": 
        bounties =await contractInteractions.getAllCompletedBounties()
        break;
    
      default:
        bounties =await contractInteractions.getAllBounties()
        break;
    }

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
    if(isConnected && walletAddress) {  
        fetchBounties();
    }
  }, [State, isConnected, walletAddress]);

  return (
    <div className="mt-5">
      <Tabs defaultValue="all">
        <TabsList className=" ">
          
          <TabsTrigger value="all" onClick={() =>{
            setState("all")
          }}>All</TabsTrigger>
          <TabsTrigger value="open" onClick={() => {
            setState("open");
          }}>Open</TabsTrigger>
          <TabsTrigger value="ended" onClick={() => {
            setState("ended");
          }}>Ended</TabsTrigger>
        </TabsList>
        <div className="border-b-[1px] border-gray-500 rounded"></div>
        <TabsContent value="open">
          {
            Bounties.map((b: BountyProp, i) => {
              return <MapBounties state={b.state} name={b.name} owner={b.owner} pay={b.pay} endDate={b.endDate} entryDate={b.timestamp} description={b.description} key={i} id={b.id}  />
            })
          }
        </TabsContent>
        <TabsContent value="review"></TabsContent>
        <TabsContent value="completed"></TabsContent>
      </Tabs>
    </div>
  );
};

export default BountySec;
