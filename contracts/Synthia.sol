// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SynthiaNFT.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
/**
 * @title Synthia
 * @dev Main contract that interacts with ASI agents to manage reputation scores
 */
contract Synthia is ReentrancyGuard {
    // The SynthiaNFT contract
    SynthiaNFT public immutable synthiaNFT;
    
    // ASI Agent address that can update scores
    address public asiAgent;
    
    // Mapping to track pending score updates
    mapping(address => bool) public pendingUpdates;
    
    // Events
    event ScoreRequested(address indexed user, uint256 timestamp);
    event ScoreUpdated(address indexed user, uint256 score, uint256 timestamp);
    event ASIAgentUpdated(address indexed oldAgent, address indexed newAgent);
    event UserAnalysisCompleted(address indexed user, uint256 score, uint256 timestamp);
    event AchievementUnlocked(address indexed user, string achievement, uint256 timestamp);
    
    modifier onlyASIAgent() {
        require(msg.sender == asiAgent, "Caller is not the ASI agent");
        _;
    }
    
    /**
     * @dev Initializes the contract with the ASI agent address
     * @param _asiAgent The address of the ASI agent
     */
    constructor(address _asiAgent) {
        require(_asiAgent != address(0), "Invalid ASI agent address");
        
        // Deploy the SynthiaNFT contract
        SynthiaNFT nft = new SynthiaNFT();
        synthiaNFT = nft;

        // Set this contract as the owner of the NFT contract and initialize it
        nft.setSynthiaContract(address(this));
        
        asiAgent = _asiAgent;
    }
    
    /**
     * @dev Updates the ASI agent address. Can only be called by the current ASI agent.
     * @param _newAgent The address of the new ASI agent
     */
    function updateASIAgent(address _newAgent) external onlyASIAgent {
        require(_newAgent != address(0), "Invalid address");
        emit ASIAgentUpdated(asiAgent, _newAgent);
        asiAgent = _newAgent;
    }
    
    /**
     * @dev Called by users to request a reputation score update
     */
    function requestScoreUpdate() external {
        address user = msg.sender;
        require(!pendingUpdates[user], "Score update already requested");
        
        pendingUpdates[user] = true;
        emit ScoreRequested(user, block.timestamp);
        
        // In a real implementation, this would trigger an off-chain ASI agent
        // to analyze the user's wallet and call updateScore
    }
    
    /**
     * @dev Called by the ASI agent to update a user's score
     * @param user The address of the user to update
     * @param score The new reputation score (0-1000)
     */
    function updateScore(address user, uint256 score) external nonReentrant onlyASIAgent {
        require(score <= 1000, "Invalid score");
        require(pendingUpdates[user], "No pending update for this user");
        
        // Clear the pending update before external calls (Checks-Effects-Interactions pattern)
        delete pendingUpdates[user];
        
        // Update the score in the NFT contract and store the tokenId
        uint256 tokenId = synthiaNFT.updateReputation(user, score);
        require(tokenId != 0, "Failed to update reputation");
        
        // Emit events for activity tracking
        emit ScoreUpdated(user, score, block.timestamp);
        emit UserAnalysisCompleted(user, score, block.timestamp);
        
        // Check for achievements based on score
        if (score >= 800) {
            emit AchievementUnlocked(user, "High Reputation Achiever", block.timestamp);
        } else if (score >= 600) {
            emit AchievementUnlocked(user, "Trusted Member", block.timestamp);
        }
    }
    
    /**
     * @dev Returns the current score of a user
     * @param user The address of the user
     * @return score The user's current reputation score
     * @return lastUpdated When the score was last updated
     */
    function getUserScore(address user) external view returns (uint256 score, uint256 lastUpdated) {
        try synthiaNFT.getTokenId(user) returns (uint256 tokenId) {
            if (tokenId != 0) {
                (score, lastUpdated) = synthiaNFT.getReputationData(tokenId);
            }
        } catch {}
        return (score, lastUpdated);
    }
}
