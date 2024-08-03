"use client"
import Bounties from "@/components/Bounties";
import { Button } from "@/components/ui/button";
import { getEthEarnContract } from "@/lib/ContractInteraction";
import { ethers } from "ethers";
import Image from "next/image";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

type initialValueType = {
  id: string,
  description: string,
  owner: string,
  name: string,
  timeStamp: number,
  endDate:  number,
  pay: number,
};

const initialValue = {
  id: "",
  description: "",
  owner: "",
  name: "",
  timeStamp: 0,
  endDate:  0,
  pay: 0,
};

const activeBountyContext = createContext({
  val: initialValue,
  setter: (() => undefined) as Dispatch<SetStateAction<initialValueType>>,
})

export default function Home() {
  const [activeBounty, setActiveBounty] = useState({
    id: "",
    description: "",
    owner: "",
    name: "",
    timeStamp: 0,
    endDate:  0,
    pay: 0
  });
  const [userCategory, setUserCategory] = useState<string>("");
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
      }else {
        alert("Wallet is");
      }
    };

    checkWalletConnection();
  }, []);

  const fetchUserCategory = async () => {
    const contract = await getEthEarnContract();

    if(!contract) {
      alert("Unable to get user profile");
      return;
    }

    const fetchedProfile = await contract.viewMyProfile();

    return fetchedProfile.category;
  }

  useEffect(() => {
    if(isConnected && walletAddress) {
      fetchUserCategory().then((res) => {
        setUserCategory(res);
      })
    }
  }, [walletAddress, isConnected]);


  return (
    <activeBountyContext.Provider value={{
      val: activeBounty,
      setter: setActiveBounty
    }}>
      <main className="">
      <section className="h-full w-full pt-25 mt-25 md:mt-1 relative flex  md:p-20 p-5  md:pt-20 md:flex-row flex-col">
       <div className="w-full">
        <Bounties/>
       </div>
       <div className="md:w-[800px] w-full border-l-2 border-gray-200 h-screen p-5">
        {activeBounty.id == "" || activeBounty.name == "" ? <><h3 className="text-gray-600 font-semibold text-2xl">No Bounties in View</h3></> : (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-gray-800 font-semibold text-2xl">{activeBounty.name}</h3>
              <p>{activeBounty.pay}ETH</p>
            </div>
            <p className="text-gray-600 text-lg text-wrap">{activeBounty.description}</p>

            <div className="flex flex-col gap-2 mt-5">
              <span>Author: {activeBounty.owner}</span>
              <span>Uploaded: {activeBounty.timeStamp}</span>
              <span>Ends: {activeBounty.endDate}</span>
            </div>

            {userCategory === "bounty_hunter" && <>
              <Button className="w-full mt-5">Make Submission</Button>
            <span className="text-sm text-gray-600 font-bold">N/B: Submissions can only be made by bounty hunters</span>
            </>}
          </div>
        )}
       </div>

      </section>
    </main>
    </activeBountyContext.Provider>
  );
}

export {
  activeBountyContext,
}
