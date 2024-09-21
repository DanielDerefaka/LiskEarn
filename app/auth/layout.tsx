"use client"
import Loading from '@/components/Loading';
import ConnectWallet from '@/components/shared/ConnectWallet';
import { useConnectionContext } from '@/context/isConnected'
import React from 'react'


const AuthLayout = ({children}: {children: React.ReactNode}) => {
  const {isConnected, profile, isLoading} = useConnectionContext();

  if(isLoading) {
    return <div className="min-h-screen flex items-center justify-end"><Loading /></div>
  }

  if (isConnected) {
    if(profile) {
      return "User Already Exists to this Account, Change Wallet and Try Again"
    }
  
    return (
      <div className='min-h-screen bg-[#ffff]  flex items-center justify-center'>
    
          {children}
      </div>
    )
  }

  return <div>
    <ConnectWallet />
  </div>
}

export default AuthLayout