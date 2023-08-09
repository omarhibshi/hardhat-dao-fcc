# 1) Box.sol **_is the contract to be governed._**

# 2) GovernanceToken.sol **_is the contract of the Token to be used fot voting._**

### **_// Someone knows a hot proposal is coming up_**

### **_// Do they just buy a ton of tokens, and then they dump it right after voting_**

### **_// To prvent this, Snapshot of tokens people have at a certain block is taken_**

### **_// This is why "GovernanceToken.sol" use ERC20Votes as opposed to ERC20_**

# 3) GovernorContract.sol **_is the contract that has all the voting logic code that "GovernanceToken.sol" will use._**

### **_// This contract controls the vote? Basiclly, you send your vote to this contract_**

### **_// This contract is set as "Proposer" in the TimeLock contract because it is only contract that can peopose things in the DAO_**

# 4) TimeLock.sol **_is the owner of the "Box.sol" contract._**
