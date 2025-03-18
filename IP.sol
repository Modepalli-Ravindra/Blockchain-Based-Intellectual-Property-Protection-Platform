pragma solidity >= 0.8.11 <= 0.8.11;
pragma experimental ABIEncoderV2;
//IP solidity code
contract IP {

    uint public userCount = 0; 
    mapping(uint => user) public userList; 
     struct user
     {
       string username;
       string password;
       string phone;
       string email;
       string home_address;
     }
 
   // events 
   event userCreated(uint indexed _userId);
   
   //function  to save user details to Blockchain
   function saveUser(string memory uname, string memory pass, string memory phone, string memory email, string memory add) public {
      userList[userCount] = user(uname, pass, phone, email, add);
      emit userCreated(userCount);
      userCount++;
    }

     //get user count
    function getUserCount()  public view returns (uint) {
          return  userCount;
    }

    uint public propertyCount = 0; 
    mapping(uint => property) public propertyList; 
     struct property
     {
       string property_id;
       string creator_name;
       string description;
       string filename;
       string verify_hash;
       string create_date;   
       string transfer_status;
     }
 
   // events 
   event propertyCreated(uint indexed _propertyId);
   
   //function  to save property details to Blockchain
   function saveProperty(string memory pid, string memory cname, string memory desc, string memory fname, string memory vh, string memory cdate, string memory ts) public {
      propertyList[propertyCount] = property(pid, cname, desc, fname, vh, cdate, ts);
      emit propertyCreated(propertyCount);
      propertyCount++;
    }

    //get property count
    function getPropertyCount()  public view returns (uint) {
          return  propertyCount;
    }

    function updateTransfer(uint i, string memory details) public { 
      propertyList[i].transfer_status = details;
   }

    uint public rewardsCount = 0; 
    mapping(uint => rewards) public rewardsList; 
     struct rewards
     {
       string username;
       string num_verifications;
       string rewards_value;       
     }
 
   // events 
   event rewardsCreated(uint indexed _rewardsId);
   
   //function  to save rewards details to Blockchain
   function saveRewards(string memory uname, string memory nv, string memory totalrewards) public {
      rewardsList[rewardsCount] = rewards(uname, nv, totalrewards);
      emit rewardsCreated(rewardsCount);
     rewardsCount++;
    }

     //get rewards count
    function getRewardCount()  public view returns (uint) {
          return  rewardsCount;
    }

    function updateRewards(uint i, string memory nv, string memory r) public { 
      rewardsList[i].num_verifications = nv;
      rewardsList[i].rewards_value = r;
   }


    function getUsername(uint i) public view returns (string memory) {
        user memory doc = userList[i];
	return doc.username;
    }

    function getPassword(uint i) public view returns (string memory) {
        user memory doc = userList[i];
	return doc.password;
    }

    function getPhone(uint i) public view returns (string memory) {
        user memory doc = userList[i];
	return doc.phone;
    }    

    function getEmail(uint i) public view returns (string memory) {
        user memory doc = userList[i];
	return doc.email;
    }

    function getAddress(uint i) public view returns (string memory) {
        user memory doc = userList[i];
	return doc.home_address;
    }

    function getFileName(uint i) public view returns (string memory) {
        property memory doc = propertyList[i];
	return doc.filename;
    }

    function getHashcode(uint i) public view returns (string memory) {
        property memory doc = propertyList[i];
	return doc.verify_hash;
    }

    function getPropertyid(uint i) public view returns (string memory) {
        property memory doc = propertyList[i];
	return doc.property_id;
    }

    function getCreator(uint i) public view returns (string memory) {
        property memory doc = propertyList[i];
	return doc.creator_name;
    }

    function getDescription(uint i) public view returns (string memory) {
        property memory doc = propertyList[i];
	return doc.description;
    }
    
    function getDate(uint i) public view returns (string memory) {
        property memory doc = propertyList[i];
	return doc.create_date;
    }

    function getTransfer(uint i) public view returns (string memory) {
        property memory doc = propertyList[i];
	return doc.transfer_status;
    }

   function getName(uint i) public view returns (string memory) {
        rewards memory doc = rewardsList[i];
	return doc.username;
    }

    function getVerificationCount(uint i) public view returns (string memory) {
        rewards memory doc = rewardsList[i];
	return doc.num_verifications;
    }

    function getRewards(uint i) public view returns (string memory) {
        rewards memory doc = rewardsList[i];
	return doc.rewards_value;
    }   
    
}