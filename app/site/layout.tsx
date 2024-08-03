import React from 'react'
import Navbar from '@/components/Navbar'



const layout = ({children}: {children: React.ReactNode}) => {
  return (
   
   
   <main className='h-full'>
      <Navbar/> 
      {children}
   </main>
  
  )
}

export default layout