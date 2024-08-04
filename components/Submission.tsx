"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import contractInteractions from "@/lib/Contract";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  id: number,
  walletAddress: string
}

const Submission = ({id, walletAddress}: Props) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await contractInteractions.makeSubmission(id, content);
      setSuccess("Submission made successfully!");
      setContent("");
    } catch (error) {
      console.error("Failed to make submission:", error);
      setError("Failed to make submission. See console for details.");
    }
  };

  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Submit Bounty</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{success}</span>
              </div>
            )}
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(id);
            }} className="space-y-4">
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Submission Content
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="mt-1 block w-full"
                  placeholder="Link to the submission file uploaded on a either google drive or any other online storage location"
                />
              </div>
              <div>
                <span>Wallet Address: </span><span>{walletAddress}</span>
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default Submission
