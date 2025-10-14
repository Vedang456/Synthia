// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SynthiaNFT
 * @dev Soulbound NFT representing a user's reputation score.
 * This contract is controlled by the main Synthia contract.
 */
contract SynthiaNFT is ERC721, Ownable, ReentrancyGuard {
    // Only the main Synthia contract can update scores
    address public synthiaContract;

    struct ReputationData {
        uint256 score; // Reputation score (0-1000)
        uint256 lastUpdated; // Timestamp of last update
    }

    // Mapping from token ID to reputation data
    mapping(uint256 => ReputationData) private _reputationData;

    // Mapping from address to token ID
    mapping(address => uint256) private _addressToTokenId;

    // Events
    event ReputationUpdated(
        address indexed user,
        uint256 indexed tokenId,
        uint256 score,
        uint256 timestamp
    );
    
    event SynthiaContractUpdated(address indexed oldSynthia, address indexed newSynthia);
    event ReputationTokenMinted(address indexed user, uint256 indexed tokenId, uint256 score);
    event ReputationTokenUpdated(address indexed user, uint256 indexed tokenId, uint256 oldScore, uint256 newScore);

    modifier onlySynthia() {
        require(
            msg.sender == synthiaContract,
            "Caller is not Synthia contract"
        );
        _;
    }

    /**
     * @dev Initializes the contract with a name and symbol
     */
    constructor() ERC721("SynthiaReputation", "SYNR") Ownable(msg.sender) {}

    /**
     * @dev Sets the Synthia contract address. Can only be called once by the owner.
     */
    function setSynthiaContract(address newSynthia) external onlyOwner {
        require(synthiaContract == address(0), "Synthia contract already set");
        require(newSynthia != address(0), "Invalid Synthia address");
        require(
            newSynthia != address(this),
            "Cannot set self as Synthia contract"
        );
        emit SynthiaContractUpdated(synthiaContract, newSynthia);
        synthiaContract = newSynthia;
    }

    /**
     * @dev Updates the reputation score for a user. Can only be called by Synthia contract
     */
    function updateReputation(
        address user,
        uint256 score
    ) external nonReentrant onlySynthia returns (uint256) {
        require(score <= 1000, "Score must be <= 1000");
        require(user != address(0), "Invalid address");
        
        uint256 tokenId = _addressToTokenId[user];
        bool isNewToken = tokenId == 0;
        
        if (isNewToken) {
            // Generate tokenId for new users
            tokenId = uint256(uint160(user));
            // Update state before any external calls
            _addressToTokenId[user] = tokenId;
        }
        
        // Update reputation data
        _reputationData[tokenId] = ReputationData({
            score: score,
            lastUpdated: block.timestamp
        });
        
        // SafeMint after state updates to prevent reentrancy
        if (isNewToken) {
            _safeMint(user, tokenId);
            emit ReputationTokenMinted(user, tokenId, score);
        } else {
            // Emit update event for existing tokens
            uint256 oldScore = _reputationData[tokenId].score;
            emit ReputationTokenUpdated(user, tokenId, oldScore, score);
        }

        emit ReputationUpdated(user, tokenId, score, block.timestamp);
        return tokenId;
    }

    /**
     * @dev Returns the reputation data for a given token ID
     */
    function getReputationData(
        uint256 tokenId
    ) external view returns (uint256 score, uint256 lastUpdated) {
        // ownerOf will revert if token doesn't exist
        ownerOf(tokenId);
        ReputationData memory data = _reputationData[tokenId];
        return (data.score, data.lastUpdated);
    }

    /**
     * @dev Returns the token ID for a given address
     */
    function getTokenId(address user) external view returns (uint256) {
        return _addressToTokenId[user];
    }

    /**
     * @dev Override to make the token soulbound (non-transferable)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);

        // Allow minting and burning, but not transfers
        require(
            from == address(0) || to == address(0),
            "SynthiaNFT: Token is soulbound and non-transferable"
        );

        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Returns the token URI with on-chain metadata
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);

        ReputationData memory data = _reputationData[tokenId];

        string memory json = string(
            abi.encodePacked(
                '{"name": "Synthia Reputation #',
                Strings.toString(tokenId),
                '", "description": "Synthia Reputation NFT representing on-chain reputation score powered by ASI agents",',
                '"attributes": [',
                '{"trait_type": "Score", "value": ',
                Strings.toString(data.score),
                "},",
                '{"trait_type": "Last Updated", "display_type": "date", "value": ',
                Strings.toString(data.lastUpdated),
                "},",
                '{"trait_type": "Score Range", "value": "0-1000"}',
                "],",
                '"image": "ipfs://bafybeihpjhkeuiq3k6nqa3fkgezji6yzgalrz3qpyf36h3xexd46ug23em/1.png"',
                "}"
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(json))
                )
            );
    }
}
