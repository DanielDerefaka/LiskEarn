import { ethers } from 'ethers';
import { getSigner } from './ethers';
import EthEarnABI from './contractAbi.json';
import { Bounty, Submission, UserData } from '../types';
import { strict } from 'assert';

const CONTRACT_ADDRESS = "0x8Bd684838524456C5C4396dB0ab6E903D42d3893";

const getEthEarnContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, EthEarnABI, signer);
};

export const contractInteractions = {
   // User functions
   createUser: async (name: string, email: string, category: string, profileImg: string): Promise<void> => {
    try {
      const contract = await getEthEarnContract();
      const tx = await contract.createUser(name, email, category, profileImg);
      await tx.wait();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  updateUserProfile: async (name: string, category: string, profileImg: string): Promise<UserData> =>{
    try {
      const contract = await getEthEarnContract();
      const tx = contract.updateUserProfile(name, category, profileImg);
      return tx;
    } catch (error) {
      console.log("Error updating user profile: ", error);
      throw error;
    }
  },

  viewMyProfile: async (): Promise<UserData> => {
    try {
      const contract = await getEthEarnContract();
      const profile = await contract.viewMyProfile();
      return profile;
    } catch (error) {
      console.error("Error viewing profile:", error);
      throw error;
    }
  },

  // Bounty functions
  makeBounty: async (name: string, description: string, pay: string, endDate: number): Promise<void> => {
    try {
      const contract = await getEthEarnContract();
      const payInWei = ethers.utils.parseEther(pay);
      const tx = await contract.makeBounty(name, description, payInWei, endDate);
      await tx.wait();
    } catch (error) {
      console.error("Error creating bounty:", error);
      throw error;
    }
  },

  getAllActiveBounties: async (): Promise<Bounty[]> => {
    try {
      const contract = await getEthEarnContract();
      const bounties = await contract.getAllActiveBounties();
      return bounties;
    } catch (error) {
      console.error("Error getting active bounties:", error);
      throw error;
    }
  },


  getAllBounties: async (): Promise<Bounty[]> => {
    try {
      const contract = await getEthEarnContract();
      const bounties = await contract.getAllBounties();
      return bounties;
    } catch (error) {
      console.error("Error getting all bounties:", error);
      throw error;
    }
  },

  getAllCompletedBounties: async (): Promise<Bounty[]> => {
    try {
      const contract = await getEthEarnContract();
      const bounties = await contract.getAllCompletedBounties();
      return bounties;
    } catch (error) {
      console.error("Error getting completed bounties:", error);
      throw error;
    }
  },

  getUserBounties: async (): Promise<Bounty[]> => {
    try {
      const contract = await getEthEarnContract();
      console.log(await getSigner());
      const bounties = await contract.getUserBounties();
      return bounties;
    } catch (error) {
      console.error("Error getting user bounties:", error);
      throw error;
    }
  },

  // Submission functions
  makeSubmission: async (bountyId: number, content: string): Promise<void> => {
    try {
      const contract = await getEthEarnContract();
      const tx = await contract.makeSubmission(bountyId, content);
      await tx.wait();
    } catch (error) {
      console.error("Error making submission:", error);
      throw error;
    }
  },

  getSubmissionsForBounty: async (bountyId: number): Promise<Submission[]> => {
    try {
      const contract = await getEthEarnContract();
      const submissions = await contract.getSubmissionsForBounty(bountyId);
      return submissions;
    } catch (error) {
      console.error("Error getting submissions for bounty:", error);
      throw error;
    }
  },

  getUserSubmissions: async (): Promise<Submission[]> => {
    try {
      const contract = await getEthEarnContract();
      const submissions = await contract.getUserSubmissions();
      return submissions;
    } catch (error) {
      console.error("Error getting user submissions:", error);
      throw error;
    }
  },

  updateUserSubmissionForBounty: async (bountyId: number, content: string): Promise<void> => {
    try {
      const contract = getEthEarnContract();
      const tx = await contract.updateUserSubmissionForBounty(bountyId, content);
      await tx.wait();
    } catch (error) {
      console.error("Error updating submission:", error);
      throw error;
    }
  },

  // Admin functions
  approveSubmission: async (bountyId: number, submissionId: number): Promise<void> => {
    try {
      const contract = await getEthEarnContract();
      const tx = await contract.ApproveSubmission(bountyId, submissionId);
      await tx.wait();
    } catch (error) {
      console.error("Error approving submission:", error);
      throw error;
    }
  },

  // New function to get a user's profile
  getAUserProfile: async (walletAddress: string): Promise<UserData> => {
    try {
      const contract = await getEthEarnContract();
      const profile = await contract.getAUserProfile(walletAddress);
      return profile;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  },
};

export default contractInteractions;