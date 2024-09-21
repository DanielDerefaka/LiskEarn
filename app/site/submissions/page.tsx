"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import contractInteractions from '@/lib/Contract';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useConnectionContext } from '@/context/isConnected';
import { useRouter } from 'next/navigation';

type Submission = {
  id: string;
  bountyId: string;
  content: string;
  bountyState: boolean;
  submissionState: boolean;
  submissionOwner: string;
  timestamp: number;
};

const Page = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const {isConnected, walletAddress, profile} = useConnectionContext();

  const fetchSubmissions = async (): Promise<Submission[]> => {
    const sub = await contractInteractions.getUserSubmissions();
    return sub.map((subb: any) => ({
      id: subb.id.toString(),
      bountyId: subb.bountyId.toString(),
      content: subb.content,
      bountyState: subb.bountyState,
      submissionState: subb.submissionState,
      submissionOwner: subb.submissionOwner,
      timestamp: subb.timestamp.toNumber(),
    }));
  };

  useEffect(() => {
    if (isConnected && profile && profile.category == "bounty_hunter") {
      setIsLoading(true);
      fetchSubmissions()
        .then(setSubmissions)
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }else {
      alert("Page only accessible to bounty hunters");
      router.push("/dashboard");
    }
  }, [isConnected, walletAddress, profile]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[50px]">
      <h1 className="text-3xl font-bold mb-6">My Submissions</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-600">No submissions made</h3>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((s) => (
            <Card key={s.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-lg font-semibold">Bounty #{s.bountyId}</CardTitle>
                <CardDescription className="text-purple-100">
                  By: {shortenAddress(s.submissionOwner)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="prose prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(s.content) }} />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {formatDate(s.timestamp)}
                  </div>
                  <Badge variant={s.submissionState ? "default" : "destructive"}>
                    {s.submissionState ? (
                      <CheckCircleIcon className="mr-1 h-4 w-4" />
                    ) : (
                      <XCircleIcon className="mr-1 h-4 w-4" />
                    )}
                    {s.submissionState ? "Approved" : "Not Approved"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;