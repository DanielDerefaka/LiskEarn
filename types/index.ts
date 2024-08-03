

export interface Bounty {
    id: number;
    name: string;
    description: string;
    owner: string;
    submissions: number[];
    pay: number;
    state: boolean;
    timestamp: number;
    endDate: number;
  }
  
  export interface Submission {
    id: number;
    bountyId: number;
    content: string;
    bountyState: boolean;
    submissionState: boolean;
    submissionOwner: string;
    timestamp: number;
  }
  
  export interface UserData {
    id: number;
    name: string;
    email: string;
    walletAddress: string;
    category: string;
    profileImg: string;
    timestamp: number;
    bounties: number[];
    submissions: number[];
  }

  export interface HeaderBoxProps {
    type?: "title" | "greeting";
    title: string;
    subtext: string;
    user?: string;
  }
  