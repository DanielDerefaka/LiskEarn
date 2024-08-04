"use client"
import Bounties from "@/components/Bounties";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SubmissionPage from "@/components/Submission";


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


function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(dateInput: number | string): string {
  const date = typeof dateInput === 'number' ? new Date(dateInput * 1000) : new Date(dateInput);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

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
       <div className="md:w-[800px] w-full  border-l-2 border-gray-200 mt-5 h-screen p-5">
        {activeBounty.id == "" || activeBounty.name == "" ? <>
        
        <h3 className="text-gray-600 font-semibold text-2xl">No Bounties in View</h3></>
         : (

          
          <div>
  <Card className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
        <CardTitle className="text-2xl font-bold truncate">{activeBounty.name}</CardTitle>
        <CardDescription className="text-purple-100 mt-2">{activeBounty.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-3xl font-bold text-indigo-600">{activeBounty.pay} ETH</span>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Active</span>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">Author: {shortenAddress(activeBounty.owner)}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">Uploaded: {formatDate(activeBounty.timeStamp)}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">Ends: {formatDate(activeBounty.endDate)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">


       


        <Dialog >
      <DialogTrigger asChild>
      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
          Make Submission
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-scroll md:max-h-[700px]  md:h-fit h-screen bg-white">
      

       <SubmissionPage/>
        
      </DialogContent>
    </Dialog>
      </CardFooter>
    </Card>

            

        
            {/* <span className="text-sm text-gray-600 font-bold">N/B: Submissions can only be made by bounty hunters</span> */}
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
