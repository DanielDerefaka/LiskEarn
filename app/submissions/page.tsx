"use client"

import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import contractInteractions from '@/lib/Contract';
import { initializeEthers } from '@/lib/ethers';
import React, { useEffect, useState } from 'react'

type Props = {}

const page = (props: Props) => {
    const [submissions, setSubmissions] = useState<any[]>();
    const [walletAddress, setWalletAddress] = useState<string>();
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    useEffect(() => {
        const checkWalletConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const { signer } = await initializeEthers();
                    const address = await signer.getAddress();
                    setWalletAddress(address);
                    setIsConnected(true);
                } catch (error) {
                    console.error("Failed to check wallet connection:", error);
                    setError("Failed to connect to wallet. Please try again.");
                }
            }
        };

        checkWalletConnection();
    }, []);

    const fetchSubmissions: any = async () => {
        let sub = await contractInteractions.getUserSubmissions();

        function processSubmission(subb: any) {
            return {
              id: subb.id.toString(),
              bountyId: subb.bountyId.toString(),
              content: subb.content,
              bountyState: subb.bountyState,
              submissionState: subb.submissionState,
              submissionOwner: subb.submissionOwner,
              timestamp: subb.timestamp.toNumber(),
            };
        }

        const processedSubmissions = sub.map(processSubmission);

        return processedSubmissions;
    }

    useEffect(() => {
        if(isConnected && walletAddress) {
            fetchSubmissions().then((res: any) => {
                setSubmissions(res);
            })
        }
    }, [isConnected, walletAddress])
  return (
    <div>
        <h3>My Bounties</h3>
        {
                (!submissions || submissions.length <= 0) ? (<h3>No submissions made</h3>) : submissions!.map((s, i) =>( 
                    <Card key={i}>
                        <CardTitle className='text-sm font-normal'>{s.submissionOwner}</CardTitle>
                        <CardDescription>{s.content}</CardDescription>
                        {s.bountyState ? "Not Approved" : "Approved"}
                    </Card>
                ))
            }
    </div>
  )
}

export default page