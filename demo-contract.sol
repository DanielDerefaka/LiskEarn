//SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EthEarn {
    address private owner;
    address private LiskTokenContractAddress = 0x8a21CF9Ba08Ae709D64Cb25AfAA951183EC9FF6D;
    IERC20 public LiskToken;
    uint256 AmtToMakeBounty;

    struct UserData {
        uint256 id;
        string name;
        string email;
        address walletAddress;
        string category;
        string profileImg;
        uint256 timestamp;
        uint256[] bounties;
        uint256[] submissions;
    }

    struct Bounty {
        uint256 id;
        string name;
        string description;
        address owner;
        uint256[] submissions;
        uint256 pay;
        bool state;
        uint256 timestamp;
        uint256 endDate;
    }

    struct Submission {
        uint256 id;
        uint256 bountyId;
        string content;
        bool bountyState;
        bool submissionState;
        address submissionOwner;
        uint256 timestamp;
    }

    struct Response {
        string status;
        uint16 statusCode;
        string message;
    }

    mapping (address => UserData) private User;
    address[] private Users;
    Bounty[] private Bounties;
    Submission[] private Submissions;

    event UserAlreadyExist(address _walletAddress, string _emailAddress);
    event NewUserCreated(uint256 indexed userId, address _walletAddress, string _name, string _emailAddress, uint256 _timestamp);
    event NotEnoughToken(uint256 indexed userId, uint256 _amountTried, uint256 _balance);
    event NewBountyAdded(uint256 indexed bountyId, string _name, address _owner, uint256 _timestamp);
    event NewSubmissionMade(uint256 indexed submissionId, string _bountyName, uint256 _timestamp);
    event BountySubmissionUpdated(uint256 indexed submissionId, string _bountyName);
    event BountyIsNoLongerActive(uint256 indexed bountyId, string _name, uint256 endDate);
    event SubmissionAlreadyMadeUpdate(string bountyName);
    event NoSubmissionMadeYet(string bountyName);
    event UnauthorizedAccess(address _walletAddress);
    event SubmissionApproved(uint256 indexed submissionId, string submissionOwnerName);

    constructor () {
        LiskToken = IERC20(LiskTokenContractAddress);
        AmtToMakeBounty = 10*(10**18);
    }

    modifier userExist() {    
        bool exists = false;

        for (uint256 i; i < Users.length; i++) 
        {
            if(Users[i] == msg.sender) {
                exists = true;
                break;
            }
        }

        require(exists, "Unauthorized access");
        _;
    }

    function userNotExist(string memory emailAddress) private view returns (bool) {
        bool exists = false;

        for (uint256 i; i < Users.length; i++) 
        {
            if(Users[i] == msg.sender || keccak256(abi.encodePacked(User[Users[i]].email)) == keccak256(abi.encodePacked(emailAddress))) {
                exists = true;
                break  ;
            }
        }

        require(!exists, "User already Exists");

        return !exists;
    }

    function createUser(string memory _name, string memory _email, string memory _category, string memory _profileImg) public {
        if(userNotExist(_email)) {
            uint256[] memory emptyIdArray;
        
            UserData memory newUser = UserData({
                id: Users.length,
                name: _name,
                email: _email,
                category: _category,
                walletAddress: msg.sender,
                timestamp: block.timestamp,
                bounties: emptyIdArray,
                profileImg: _profileImg,
                submissions: emptyIdArray
            });

            User[msg.sender] = newUser;
            Users.push(newUser.walletAddress);

            emit NewUserCreated(newUser.id, newUser.walletAddress, newUser.name, newUser.email, newUser.timestamp);
        }else {
            emit UserAlreadyExist(msg.sender, _email);
        }
    }

    modifier isCreator () {
        require(keccak256(abi.encodePacked(User[msg.sender].category))  == keccak256(abi.encodePacked("creator")), "Only Users signed as creators can make bounties");
        _;
    }

    modifier isBountyHunter () {
        require(keccak256(abi.encodePacked(User[msg.sender].category))  == keccak256(abi.encodePacked("bounty_hunter")), "Only Users signed as bounty hunters can make submissions");
        _;
    } 

    function makeBounty(string memory _name, string memory _description, uint256 _pay, uint256 _endDate) public userExist isCreator {
        // require(LiskToken.balanceOf(msg.sender) >= (AmtToMakeBounty + _pay*(10**18)), "Insufficient funds");

        // bool transferToCompany = LiskToken.transfer(owner, AmtToMakeBounty);

        // require(transferToCompany, "Unable to make bounty, transfer to DAO failed");

        require(_pay > 0, "Bounty cannot be free");

        uint256[] memory emptyIdArray;

        Bounty memory newBounty = Bounty({
            id: Bounties.length,
            name: _name,
            description: _description,
            owner: msg.sender,
            pay: _pay,
            timestamp: block.timestamp,
            submissions: emptyIdArray,
            state: true,
            endDate: _endDate 
        });

        Bounties.push(newBounty);

        User[msg.sender].bounties.push(newBounty.id);

        emit NewBountyAdded(newBounty.id, newBounty.name, newBounty.owner, newBounty.timestamp);
    }
    
    function setBountyStateBasedOnEndDate (uint256 i) private {
        if(Bounties[i].endDate < block.timestamp) {
            Bounties[i].state = false;
        }
    }

    function getUserBounties() public userExist isCreator view returns (Bounty[] memory) {
        uint256 count = User[msg.sender].bounties.length;
        Bounty[] memory userBounties = new Bounty[](count);
        
        for (uint256 i; i < count; i++) 
        {
            userBounties[i] = Bounties[User[msg.sender].bounties[i]];
        }

        return userBounties;
    }

    function getAllBounties() public view userExist returns (Bounty[] memory)  {
        uint256 count = Bounties.length;
        Bounty[] memory allBounties = new Bounty[](count);

        for (uint256 i; i < count; i++) 
        {
            allBounties[i] = Bounties[i];
        }

        return allBounties;
    }

    function getAllActiveBounties() public view returns (Bounty[] memory) {
        uint256 count = Bounties.length;
        Bounty[] memory allBounties = new Bounty[](count);

        for (uint256 i; i < count; i++) 
        {
            // setBountyStateBasedOnEndDate(i);
            if(!(Bounties[i].state)) continue;
            allBounties[i] = Bounties[i];
        }

        return allBounties;
    }

    function getAllCompletedBounties() public view returns (Bounty[] memory) {
        uint256 count = Bounties.length;
        Bounty[] memory allBounties = new Bounty[](count);

        for (uint256 i; i < count; i++) 
        {
            // setBountyStateBasedOnEndDate(i);
            if(Bounties[i].state) continue;
            allBounties[i] = Bounties[i];
        }

        return allBounties;
    }
    
    function makeSubmission(uint256 _bountyId, string memory _content) public userExist isBountyHunter {
        if(Bounties[_bountyId].state) {
            if(userHasSubmitted(_bountyId)) {
                emit SubmissionAlreadyMadeUpdate(Bounties[_bountyId].name);
            }
            else{
                Submission memory newSubmission = Submission({
                    id: Submissions.length,
                    bountyId: _bountyId,
                    content: _content,
                    timestamp: block.timestamp,
                    bountyState: Bounties[_bountyId].state,
                    submissionState: false,
                    submissionOwner: User[msg.sender].walletAddress
                });

                Submissions.push(newSubmission);
                User[msg.sender].submissions.push(newSubmission.id);
                Bounties[_bountyId].submissions.push(newSubmission.id);

                emit NewSubmissionMade(newSubmission.id, Bounties[_bountyId].name, newSubmission.timestamp);
            }
        }else {
            emit BountyIsNoLongerActive(_bountyId, Bounties[_bountyId].name, Bounties[_bountyId].endDate);
        }
    }

    function getSubmissionsForBounty(uint256 _bountyId) public userExist isCreator view returns (Submission[] memory) {
        require(Bounties[_bountyId].owner == msg.sender, "Unauthorized access");

        uint256 count = Bounties[_bountyId].submissions.length;
        Submission[] memory bountySubmissions = new Submission[](count);

        for (uint256 i; i < count; i++) 
        {
            bountySubmissions[i] = Submissions[Bounties[_bountyId].submissions[i]];
        }

        return bountySubmissions;
    }

    function getUserSubmissions() public userExist isBountyHunter view returns (Submission[] memory) {
        uint256 count = User[msg.sender].submissions.length;
        Submission[] memory userSubmissions = new Submission[](count);

        for (uint256 i; i < count; i++) 
        {
            userSubmissions[i] = Submissions[User[msg.sender].submissions[i]];
        }

        return userSubmissions;
    }

    function ApproveSubmission(uint256 _bountyId, uint256 _submissionId) public userExist {
        if(Submissions[_submissionId].bountyId == _bountyId) {
            // require(LiskToken.balanceOf(msg.sender) >= (Bounties[Submissions[_submissionId].bountyId].pay*(10**18)), "Insufficient funds to approve the submission");
            // bool success = LiskToken.transfer(Submissions[_submissionId].submissionOwner, Bounties[_bountyId].pay);
            // require(success, "Unable to approve submission, Lisk could not be sent to the submitter");
            Submissions[_submissionId].submissionState = true;
            emit SubmissionApproved(_submissionId, User[Submissions[_submissionId].submissionOwner].name);
        }else {
            emit NoSubmissionMadeYet(Bounties[_bountyId].name);
        }
    }

    function endBounty(uint256 _bountyId) public {
        require(Bounties[_bountyId].id >= 0, "Bounty doesn't exist");
        Bounties[_bountyId].state = false;
    }

    function viewMyProfile() public userExist view returns (UserData memory) {
        return User[msg.sender];
    }

    function getAUserProfile(address _walletAddress) public userExist view  returns (UserData memory) {
        return User[_walletAddress];
    }

    function updateUserProfile(string memory name, string memory category, string memory profileImage) public returns (UserData memory) {
        UserData storage user = User[msg.sender];
        user.name = name;
        user.category = category;
        user.profileImg = profileImage;

        User[msg.sender] = user;

        return User[msg.sender];
    }

    function userHasSubmitted(uint256 _bountyId) private view returns (bool) {
        bool state = false;

        for (uint256 i; i < User[msg.sender].submissions.length; i++) 
        {
            if(Submissions[User[msg.sender].submissions[i]].bountyId == _bountyId) {
                return state = true;
            }
        }

        return state;
    }

    function updateUserSubmissionForBounty(uint256 _bountyId, string memory _content) public userExist isBountyHunter {
        uint256 count = User[msg.sender].submissions.length;

        for (uint256 i; i < count; i++) 
        {
            if(Submissions[User[msg.sender].submissions[i]].bountyId == _bountyId) {
                Submissions[User[msg.sender].submissions[i]].content = _content;
                emit BountySubmissionUpdated(Submissions[User[msg.sender].submissions[i]].id, Bounties[Submissions[User[msg.sender].submissions[i]].bountyId].name);
                break;
            }
        }   
    }
}