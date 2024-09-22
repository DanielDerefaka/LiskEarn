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
import { useConnectionContext } from "@/context/isConnected";
import Loading from "./Loading";

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
  const {walletAddress, isConnected, profile} = useConnectionContext();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchBounties = async () => {
    let bounties = [];
    setIsLoading(true);

    try {
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
    } catch (error: any) {
      console.log(error.message ?? error); 
    }finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(isConnected && walletAddress && profile) fetchBounties();
  }, [State, isConnected, walletAddress, profile]);

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
        {!isLoading ? (
          <>
          <TabsContent value="all">
          {
            Bounties.map((b: BountyProp, i) => {
              return <MapBounties state={b.state} name={b.name} owner={b.owner} pay={b.pay} endDate={b.endDate} entryDate={b.timestamp} description={b.description} key={i} id={b.id}  />
            })
          }
        </TabsContent>
        <TabsContent value="open">
          {
            Bounties.map((b: BountyProp, i) => {
              if(b.name == "" || b.name == undefined || b.name == null || b.pay <= 0) {
                return <></>
              }
              return <MapBounties state={b.state} name={b.name} owner={b.owner} pay={b.pay} endDate={b.endDate} entryDate={b.timestamp} description={b.description} key={i} id={b.id}  />
            })
          }
        </TabsContent>
        <TabsContent value="ended">
          {
            Bounties.map((b: BountyProp, i) => {
              if(b.name == "" || b.name == undefined || b.name == null || b.pay <= 0) {
                return <></>
              }
              return <MapBounties state={b.state} name={b.name} owner={b.owner} pay={b.pay} endDate={b.endDate} entryDate={b.timestamp} description={b.description} key={i} id={b.id}  />
            })
          }
        </TabsContent>
        
        <TabsContent value="review"></TabsContent>
        <TabsContent value="completed"></TabsContent>
        </>
        ): <div className="pt-8"><Loading /></div>}
      </Tabs>
    </div>
  );
};

export default BountySec;
