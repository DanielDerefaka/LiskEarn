"use client"
import Bounties from "@/components/Bounties";
import { Button } from "@/components/ui/button";
import { getEthEarnContract } from "@/lib/ContractInteraction";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
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
import DOMPurify from 'dompurify';
import { useConnectionContext } from "@/context/isConnected";

interface BountyDescriptionProps {
  description: string;
}

type initialValueType = {
  id: string,
  description: string,
  owner: string,
  name: string,
  timeStamp: number,
  endDate: number,
  pay: number,
  state: boolean
};

const initialValue = {
  id: "",
  description: "",
  owner: "",
  name: "",
  timeStamp: 0,
  endDate: 0,
  pay: 0,
  state: false
};

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(dateInput: number | string): string {
  const date = typeof dateInput === 'number' ? new Date(dateInput * 1000) : new Date(dateInput);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

const BountyDescription: React.FC<BountyDescriptionProps> = ({ description }) => {
  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
  );
};

const activeBountyContext = createContext({
  val: initialValue,
  setter: (() => undefined) as Dispatch<SetStateAction<initialValueType>>,
})

export default function Home() {
  const [activeBounty, setActiveBounty] = useState<initialValueType>({
    id: "",
    description: "",
    owner: "",
    name: "",
    timeStamp: 0,
    endDate: 0,
    pay: 0,
    state: false
  });
  const [userCategory, setUserCategory] = useState<string>("");

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
        setUserCategory(res);
      })
    }
  }, [walletAddress, isConnected]);


  return (
    <activeBountyContext.Provider value={{
      val: activeBounty,
      setter: setActiveBounty
    }}>
      <section className="">
        <section className="h-full w-full pt-25 mt-25 md:mt-1 relative flex  md:p-20 p-5  md:pt-20 md:flex-row flex-col">
          <div className="w-full">
            <Bounties />
          </div>
          <div className="md:w-[800px] w-full  border-l-2 border-gray-200 mt-5 h-screen p-5">
            {activeBounty.id == "" || activeBounty.name == "" ? <>

              <h3 className="text-gray-600 font-semibold text-2xl">No Bounties in View</h3></>
              : (


                <div>
                  <Card className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
                      <CardTitle className="text-2xl font-bold truncate">{activeBounty.name}</CardTitle>
                      <CardDescription className="text-purple-100 mt-2">
                      <BountyDescription description={activeBounty.description} />
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-3xl font-bold text-indigo-600">{activeBounty.pay} LISK</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${activeBounty.state ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-red-800'}`}>
                          {activeBounty.state ? 'Active' : 'Ended'}
                        </span>
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
                    {userCategory == "bounty_hunter" && (<CardFooter className="bg-gray-50 px-6 py-4">

                      <Dialog>
                        {
                          activeBounty.state && (<DialogTrigger asChild>
                            <Button className={`w-full  ${activeBounty.state ? "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1" : "bg-gray-600 hover:bg-red-600"}  text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform`}>
                              Make Submission
                            </Button>
                          </DialogTrigger>)
                        }
                        <DialogContent className="md:max-h-[700px] overflow-auto  md:h-fit h-screen bg-white">


                          <SubmissionPage id={parseInt(activeBounty.id)} walletAddress={walletAddress as string} />

                        </DialogContent>
                      </Dialog>
                    </CardFooter>)}
                  </Card>

                  {/* <span className="text-sm text-gray-600 font-bold">N/B: Submissions can only be made by bounty hunters</span> */}
                </div>
              )}
          </div>

        </section>
      </section>
    </activeBountyContext.Provider>
  );
}

export {
  activeBountyContext,
}
