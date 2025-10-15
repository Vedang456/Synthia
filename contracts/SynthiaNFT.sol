// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SynthiaNFT
 * @dev Soulbound NFT with on-chain SVG generation and reputation tiers
 * Enhanced for ETHOnline 2025 - ASI Alliance & Hedera tracks
 */
contract SynthiaNFT is ERC721, Ownable, ReentrancyGuard {
    address public synthiaContract;

    struct ReputationData {
        uint256 score; // 0-1000
        uint256 lastUpdated;
        uint256 totalUpdates; // Number of times updated
        uint256 firstMinted; // Original mint timestamp
        string tier; // "Diamond", "Platinum", "Gold", "Silver", "Bronze"
    }

    mapping(uint256 => ReputationData) private _reputationData;
    mapping(address => uint256) private _addressToTokenId;
    
    // Tier thresholds
    uint256 public constant DIAMOND_THRESHOLD = 900;
    uint256 public constant PLATINUM_THRESHOLD = 800;
    uint256 public constant GOLD_THRESHOLD = 700;
    uint256 public constant SILVER_THRESHOLD = 600;
    uint256 public constant BRONZE_THRESHOLD = 400;

    event ReputationUpdated(
        address indexed user,
        uint256 indexed tokenId,
        uint256 score,
        string tier,
        uint256 timestamp
    );
    
    event TierChanged(
        address indexed user,
        uint256 indexed tokenId,
        string oldTier,
        string newTier
    );

    modifier onlySynthia() {
        require(msg.sender == synthiaContract, "Caller is not Synthia contract");
        _;
    }

    constructor() ERC721("SynthiaReputation", "SYNR") Ownable(msg.sender) {}

    function setSynthiaContract(address newSynthia) external onlyOwner {
        require(synthiaContract == address(0), "Synthia contract already set");
        require(newSynthia != address(0), "Invalid Synthia address");
        synthiaContract = newSynthia;
    }

    /**
     * @dev Determine tier based on score
     */
    function _getTier(uint256 score) internal pure returns (string memory) {
        if (score >= DIAMOND_THRESHOLD) return "Diamond";
        if (score >= PLATINUM_THRESHOLD) return "Platinum";
        if (score >= GOLD_THRESHOLD) return "Gold";
        if (score >= SILVER_THRESHOLD) return "Silver";
        if (score >= BRONZE_THRESHOLD) return "Bronze";
        return "Unranked";
    }
    
    /**
     * @dev Get tier color for SVG
     */
    function _getTierColor(string memory tier) internal pure returns (string memory) {
        bytes32 tierHash = keccak256(bytes(tier));
        
        if (tierHash == keccak256("Diamond")) return "#B9F2FF";
        if (tierHash == keccak256("Platinum")) return "#E5E4E2";
        if (tierHash == keccak256("Gold")) return "#FFD700";
        if (tierHash == keccak256("Silver")) return "#C0C0C0";
        if (tierHash == keccak256("Bronze")) return "#CD7F32";
        return "#808080";
    }

    function updateReputation(
        address user,
        uint256 score
    ) external nonReentrant onlySynthia returns (uint256) {
        require(score <= 1000, "Score must be <= 1000");
        require(user != address(0), "Invalid address");
        
        uint256 tokenId = _addressToTokenId[user];
        bool isNewToken = tokenId == 0;
        string memory oldTier;
        
        if (isNewToken) {
            tokenId = uint256(uint160(user));
            _addressToTokenId[user] = tokenId;
            
            _reputationData[tokenId] = ReputationData({
                score: score,
                lastUpdated: block.timestamp,
                totalUpdates: 1,
                firstMinted: block.timestamp,
                tier: _getTier(score)
            });
            
            _safeMint(user, tokenId);
        } else {
            ReputationData storage data = _reputationData[tokenId];
            oldTier = data.tier;
            string memory newTier = _getTier(score);
            
            data.score = score;
            data.lastUpdated = block.timestamp;
            data.totalUpdates++;
            data.tier = newTier;
            
            if (keccak256(bytes(oldTier)) != keccak256(bytes(newTier))) {
                emit TierChanged(user, tokenId, oldTier, newTier);
            }
        }

        emit ReputationUpdated(
            user, 
            tokenId, 
            score, 
            _reputationData[tokenId].tier,
            block.timestamp
        );
        
        return tokenId;
    }

    function getReputationData(
        uint256 tokenId
    ) external view returns (uint256 score, uint256 lastUpdated) {
        ownerOf(tokenId);
        ReputationData memory data = _reputationData[tokenId];
        return (data.score, data.lastUpdated);
    }
    
    function getFullReputationData(
        uint256 tokenId
    ) external view returns (
        uint256 score,
        uint256 lastUpdated,
        uint256 totalUpdates,
        uint256 firstMinted,
        string memory tier
    ) {
        ownerOf(tokenId);
        ReputationData memory data = _reputationData[tokenId];
        return (
            data.score,
            data.lastUpdated,
            data.totalUpdates,
            data.firstMinted,
            data.tier
        );
    }

    function getTokenId(address user) external view returns (uint256) {
        return _addressToTokenId[user];
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        require(
            from == address(0) || to == address(0),
            "SynthiaNFT: Token is soulbound"
        );
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Generate on-chain SVG for the NFT
     */
    function _generateSVG(uint256 tokenId) internal view returns (string memory) {
        ReputationData memory data = _reputationData[tokenId];
        string memory tierColor = _getTierColor(data.tier);
        
        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            '<defs>',
            '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" style="stop-color:#1a1a2e"/>',
            '<stop offset="100%" style="stop-color:#16213e"/>',
            '</linearGradient>',
            '<linearGradient id="tier" x1="0%" y1="0%" x2="100%" y2="0%">',
            '<stop offset="0%" style="stop-color:', tierColor, ';stop-opacity:0.3"/>',
            '<stop offset="100%" style="stop-color:', tierColor, ';stop-opacity:0.8"/>',
            '</linearGradient>',
            '</defs>',
            '<rect width="400" height="400" fill="url(#bg)"/>',
            '<rect x="20" y="20" width="360" height="360" rx="20" fill="none" stroke="url(#tier)" stroke-width="3"/>',
            '<text x="200" y="80" font-family="Arial,sans-serif" font-size="32" font-weight="bold" fill="', tierColor, '" text-anchor="middle">SYNTHIA</text>',
            '<text x="200" y="120" font-family="Arial,sans-serif" font-size="18" fill="#ffffff" text-anchor="middle" opacity="0.7">Reputation Score</text>',
            '<text x="200" y="200" font-family="Arial,sans-serif" font-size="80" font-weight="bold" fill="', tierColor, '" text-anchor="middle">', Strings.toString(data.score), '</text>',
            '<text x="200" y="240" font-family="Arial,sans-serif" font-size="28" fill="', tierColor, '" text-anchor="middle">', data.tier, '</text>',
            '<line x1="80" y1="270" x2="320" y2="270" stroke="', tierColor, '" stroke-width="2" opacity="0.5"/>',
            '<text x="200" y="310" font-family="Arial,sans-serif" font-size="14" fill="#ffffff" text-anchor="middle" opacity="0.6">Powered by ASI Alliance</text>',
            '<text x="200" y="335" font-family="Arial,sans-serif" font-size="14" fill="#ffffff" text-anchor="middle" opacity="0.6">Verified on Hedera</text>',
            '<text x="200" y="365" font-family="Arial,sans-serif" font-size="12" fill="#ffffff" text-anchor="middle" opacity="0.5">#', Strings.toString(tokenId), '</text>',
            '</svg>'
        ));
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        ReputationData memory data = _reputationData[tokenId];

        string memory svg = _generateSVG(tokenId);
        string memory svgBase64 = Base64.encode(bytes(svg));

        string memory json = string(abi.encodePacked(
            '{"name":"Synthia Reputation #', Strings.toString(tokenId),
            '","description":"Soulbound reputation NFT powered by ASI Alliance agents and verified on Hedera. This badge represents on-chain reputation analysis using MeTTa symbolic reasoning.",',
            '"image":"data:image/svg+xml;base64,', svgBase64,
            '","attributes":[',
            '{"trait_type":"Score","value":', Strings.toString(data.score), '},',
            '{"trait_type":"Tier","value":"', data.tier, '"},',
            '{"trait_type":"Total Updates","value":', Strings.toString(data.totalUpdates), '},',
            '{"trait_type":"Last Updated","display_type":"date","value":', Strings.toString(data.lastUpdated), '},',
            '{"trait_type":"First Minted","display_type":"date","value":', Strings.toString(data.firstMinted), '},',
            '{"trait_type":"Powered By","value":"ASI Alliance + Hedera"}',
            ']}'
        ));

        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }
}