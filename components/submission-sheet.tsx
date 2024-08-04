"use client"
import contractInteractions from '@/lib/Contract'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardTitle } from './ui/card'
import { Button } from './ui/button'

type Props = {
    id: number
}

const SubmissionSheet = ({id}: Props) => {
    const [submissions, setSubmissions] = useState<any[]>();

    const fetchSubmissions: any = async () => {
        let sub = await contractInteractions.getSubmissionsForBounty(id);

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
        fetchSubmissions().then((res: any) => {
            setSubmissions(res);
        })
    }, [])
    return (
        <div className='flex flex-col gap-3 mt-5'>
            {
                (!submissions || submissions.length <= 0) ? (<h3>No submissions made</h3>) : submissions!.map((s, i) =>( 
                    <Card key={i}>
                        <CardTitle className='text-sm font-normal'>{s.submissionOwner}</CardTitle>
                        <CardDescription>{s.content}</CardDescription>
                        <div>
                            <Button className={`${!s.submissionState ? "bg-green-600" : "bg-gray-600 hover:bg-gray-600"}`} onClick={async (e) => {
                                e.preventDefault();
                                if(!s.submissionState) {
                                    try {
                                        await contractInteractions.approveSubmission(s.bountyId, s.id);
                                        alert("Submission approved, Refresh to view changes");
                                    } catch (error) {
                                        alert("Unable to approve submission");
                                    }
                                }
                            }}>{s.submissionState ? "Approved" : "Approve"}</Button>
                        </div>
                    </Card>
                ))
            }
        </div>
    )
}

export default SubmissionSheet