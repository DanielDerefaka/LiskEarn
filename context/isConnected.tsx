"use client"
import { getEthEarnContract } from "@/lib/ContractInteraction";
import { checkWalletConnection } from "@/lib/ethers"
import { createContext, Dispatch, SetStateAction, useContext, useState, ReactNode, useEffect } from "react"


type Profile = {
  name: string;
  category: "creator" | "bounty_hunter" | "Creator";
  profileImg: string;
}

type connectionInitialValueType = {
  setIsConnected: Dispatch<SetStateAction<boolean>>,
  isConnected: boolean,
  walletAddress?: string,
  setWalletAddress: Dispatch<SetStateAction<string | undefined>>,
  error?: false | string,
  setError: Dispatch<SetStateAction<string | false>>,
  profile: Profile | false,
  setProfile: Dispatch<SetStateAction<Profile | false>>,
  isLoading: boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
}

const connectionInitialValue: connectionInitialValueType = {
  setIsConnected: () => undefined,
  isConnected: false,
  setWalletAddress: () => undefined,
  walletAddress: "",
  error: false,
  setError: () => undefined,
  setProfile: () => undefined,
  profile: false,
  isLoading: false,
  setIsLoading: () => undefined,
}

const connectionContext = createContext(connectionInitialValue)

const ConnectionContextProvider = function ({ children }: { children: ReactNode }): ReactNode {
  const [walletAddress, setWalletAddress] = useState<string | undefined>("")
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<false | string>(false);
  const [profile, setProfile] = useState<Profile | false>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true)
    checkWalletConnection().then((res) => {
      if (!res) return setIsLoading(false);

      setIsConnected(res.isConnected ? res.isConnected : false);
      if (res.isConnected && res.signer) {
        res.signer?.getAddress().then((result) => {
          setWalletAddress(result)
        })
      }
      setIsLoading(false)
    });
  }, []);

  

  useEffect(() => {
    const fetchProfile = async () => {
        setIsLoading(true);
        setError(false);
        try {
            const contract = getEthEarnContract();
            if (!contract) throw new Error("Failed to get contract instance");
            const fetchedProfile = await contract.viewMyProfile();
            setProfile(fetchedProfile);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            setError("Failed to fetch profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isConnected) fetchProfile()

}, [walletAddress, isConnected]);

  return <>
    <connectionContext.Provider value={{
      walletAddress,
      setWalletAddress,
      isConnected,
      setIsConnected,
      error,
      setError,
      profile,
      setProfile,
      isLoading,
      setIsLoading
    }}>
      {children}
    </connectionContext.Provider>
  </>
}

const useConnectionContext = function () {
  const connection = useContext(connectionContext)

  return connection
}

export {
  connectionContext,
  ConnectionContextProvider,
  useConnectionContext
} 