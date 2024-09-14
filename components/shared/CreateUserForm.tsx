"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import contractInteractions from "@/lib/Contract";
import { useRouter} from "next/navigation";
import ConnectWallet from "./ConnectWallet";
import { ethers } from 'ethers';
import ConnectWallett from "./ConnWallet";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  category: z
    .string()
    .min(2, { message: "Category must be at least 2 characters." }),
  profileImg: z.string().url({ message: "Invalid URL for profile image." }),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateUser() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
const router = useRouter()
    useEffect(() => {
        const checkWalletConnection = async () => {
          if ((window as any).ethereum) {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
              setWalletAddress(accounts[0]);
            }
          }
        };
    
        checkWalletConnection();
      }, []);
    
      
    
      const handleConnectWallet = async () => {
        if ((window as any).ethereum) {
          const provider = new ethers.providers.Web3Provider((window as any).ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);
        } else {
          alert('Please install MetaMask!');
        }
      };

      
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await contractInteractions.createUser(
        data.name,
        data.email,
        data.category,
        data.profileImg
      );

      
      toast({
        title: "User Created",
        description: "Your user profile has been successfully created.",
      });

      router.push("/")
   
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description:
          "There was an error creating your user profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className=" mx-auto p-4 border rounded-md py-8 px-5 shadow-sm min-w-[500px]  justify-center">
     
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
     
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" className="bg-white focus:outline-none focus:border-transparent" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="bg-white"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="bg-white ml-3 border-gray-300 border rounded-md p-2 "
            {...register("category")}
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="creator">Creator</option>
            <option value="bounty_hunter">Bounty Hunter</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="profileImg">Profile Image URL</Label>
          <Input
            id="profileImg"
            className="bg-white"
            {...register("profileImg")}
          />
          {errors.profileImg && (
            <p className="text-red-500 text-sm mt-1">{errors.profileImg.message}</p>
          )}
        </div>

        {/* <div>
          <Label htmlFor="profileImg">Please Connect Your Wallet</Label> <br />
          
        <button className="bg-black-2 text-white mt-2 rounded-sm p-2 px-2 py-4">
        <ConnectWallett/>
        </button>
        </div> */}

       
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create User"}
        </Button>
      </form>
    
    </div>
  );
}
