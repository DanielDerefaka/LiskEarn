"use client";
import contractInteractions from '@/lib/Contract';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';

type Props = {
    id: number;
};

const SubmissionSheet = ({ id }: Props) => {
    const [submissions, setSubmissions] = useState<any[]>([]);

    const fetchSubmissions = async () => {
        try {
            const sub = await contractInteractions.getSubmissionsForBounty(id);

            const processedSubmissions = sub.map((subb: any) => ({
                id: subb.id.toString(),
                bountyId: subb.bountyId.toString(),
                content: subb.content,
                bountyState: subb.bountyState,
                submissionState: subb.submissionState,
                submissionOwner: subb.submissionOwner,
                timestamp: new Date(subb.timestamp.toNumber() * 1000).toLocaleString(),
            }));

            setSubmissions(processedSubmissions);
        } catch (error) {
            console.error("Failed to fetch submissions:", error);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [id]);

    return (
        <div className='mt-5'>
            {submissions.length === 0 ? (
                <h3 className="text-center text-gray-500">No submissions made</h3>
            ) : (
                <div className=''>
                    {submissions.map((s, i) => (
                        <Card key={i} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent>
                                <CardTitle className='text-lg font-semibold mt-2'>

                                {s.submissionOwner.slice(0, 6)}...{s.submissionOwner.slice(-4)}
                                </CardTitle>
                                <CardDescription className='mb-4'>{s.content}</CardDescription>
                                <p className='text-gray-500 text-sm'>Submitted on: {s.timestamp}</p>
                            </CardContent>
                            <CardFooter className='flex justify-end'>
                                <Button
                                    className={`transition ${s.submissionState ? "bg-gray-600 hover:bg-gray-500" : "bg-green-600 hover:bg-green-500"}`}
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        if (!s.bountyState && !s.submissionState) {
                                            try {
                                                await contractInteractions.approveSubmission(s.bountyId, s.id);
                                                alert("Submission approved. Refresh to view changes.");
                                                fetchSubmissions(); // Refresh the list after approval
                                            } catch (error) {
                                                alert("Unable to approve submission");
                                            }
                                        }
                                    }}
                                    disabled={s.submissionState}
                                >
                                    {s.submissionState ? "Approved" : "Approve"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubmissionSheet;
