import { activeBountyContext } from '@/app/site/page'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useContext } from 'react'
import { Button } from './ui/button'
import contractInteractions from '@/lib/Contract'

type BountyProp ={
  name: string,
  description: string,
  owner: string,
  pay: number,
  endDate: number,
  entryDate: number,
  key: number,
  state?: boolean,
  id: string,
  endBounty?: boolean,
  setFetch?: Dispatch<SetStateAction<number>>,
}
const MapBounties = ({name, description, owner, pay, endDate, entryDate, key, state, id, endBounty, setFetch}: BountyProp) => {
  let setter2 = (val: any) => {

  }

  if(!endBounty) {
    const {setter} = useContext(activeBountyContext);
    setter2 = setter;
  }

  return (
    <div className={`p-5 hover:bg-gray-200  rounded-md cursor-pointer h-25`} key={key} onClick={() => {
      if(!endBounty) {
        setter2({
          id,
          name,
          owner,
          timeStamp: entryDate,
          endDate: endDate,
          description,
          pay,
        })
      }
    }}>
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
          <div className={`${state ? "text-green-600" : "text-red-600"}`}>{state ? "Active" : "Ended"}</div>
        </div>
      </div>

      <div className='text-right h-full flex flex-col justify-between items-end'>
        <p className="text-bold font-mono">{pay}</p>
        {endBounty && <Button className={'mt-5 hover:bg-red-600'} onClick={async () => {
          await contractInteractions.endBounty(parseInt(id));
          setFetch!((prev) => prev+1);
          alert("Bounty ended successfully, Refresh to view changes");
        }
        }>Cancel Bounty</Button>}
      </div>
    </div>
  </div>
  )
}

export default MapBounties