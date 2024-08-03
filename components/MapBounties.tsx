import Image from 'next/image'
import React from 'react'

type BountyProp ={
  name: string,
  description: string,
  owner: string,
  pay: number,
  endDate: number,
  entryDate: number,
  key: number,
  state?: boolean
}
const MapBounties = ({name, description, owner, pay, endDate, entryDate, key, state}: BountyProp) => {
  return (
    <div className={`p-5 hover:bg-gray-200  rounded-md cursor-pointer h-25 ${!state && "bg-red-600"}`} key={key}>
    <div className="flex justify-between">
      <div className="flex flex-row gap-4 ">
        <div className="w-10 h-10 bg-black">
          <Image src="/vercel.svg" alt="img" width={50} height={50} />
        </div>

        <div>
          <h1 className="font-bold text-[15px] text-gray-700">
            {name}
          </h1>
          <p className="space-x-1 text-gray-400 text-sm"><span>Uploaded By:</span> {owner}</p>
          <div className="flex gap-2 text-sm text-gray-400 ">
            <p>Bounty</p>
            <p>Due {endDate}</p>
            <p>4 </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-bold font-mono">{pay}</p>
      </div>
    </div>
  </div>
  )
}

export default MapBounties