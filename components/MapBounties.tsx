import React, { useContext } from 'react';
import Image from 'next/image';
import { activeBountyContext } from '@/app/site/page';

type BountyProp = {
  name: string;
  description: string;
  owner: string;
  pay: number;
  endDate: number;
  entryDate: number;
  key: number;
  state?: boolean;
  id: string;
};

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDate(dateInput: number | string): string {
  const date = typeof dateInput === 'number' ? new Date(dateInput * 1000) : new Date(dateInput);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}


const MapBounties: React.FC<BountyProp> = ({
  name,
  description,
  owner,
  pay,
  endDate,
  entryDate,
  key,
  state,
  id,
}) => {
  const { setter } = useContext(activeBountyContext);

  return (
    <div 
      className="p-4 hover:bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg cursor-pointer mb-5 transition-all duration-300 border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md"
      key={key}
      onClick={() => {
        setter({
          id,
          name,
          owner,
          timeStamp: entryDate,
          endDate: endDate,
          description,
          pay,
        });
      }}
    >
      <div className="flex justify-between items-cente ">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
            <Image src="/vercel.svg" alt="img" width={30} height={30} className="filter invert" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-800 mb-1">
              {name}
            </h1>
            <p className="text-sm text-gray-600">
              <span className="font-medium">By:</span> {shortenAddress(owner)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-600">{pay} ETH</p>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${state ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {state ? 'Active' : 'Not Active'}
          </span>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
        <div className="flex space-x-4">
          <p>🏷️ Bounty</p>
          <p>⏳ Due {formatDate(endDate)}</p>
          <p>👥 4 Submissions</p>
        </div>
        <p className="text-indigo-500 font-medium">
          Uploaded: {formatDate(entryDate)}
        </p>
      </div>
    </div>
  );
};

export default MapBounties;