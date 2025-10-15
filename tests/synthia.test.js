// test/Synthia.test.js - Comprehensive test suite

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Synthia Enhanced Contract", function () {
    let synthia, nft;
    let owner, orchestrator, analyzer, blockchain, marketplace, user;
    
    beforeEach(async function () {
        [owner, orchestrator, analyzer, blockchain, marketplace, user] = await ethers.getSigners();
        
        // Deploy Synthia
        const Synthia = await ethers.getContractFactory("Synthia");
        synthia = await Synthia.deploy(orchestrator.address);
        await synthia.waitForDeployment();
        
        // Get NFT contract
        const nftAddress = await synthia.synthiaNFT();
        nft = await ethers.getContractAt("SynthiaNFT", nftAddress);
        
        // Register agents
        const ANALYZER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ANALYZER_ROLE"));
        const BLOCKCHAIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("BLOCKCHAIN_ROLE"));
        const MARKETPLACE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MARKETPLACE_ROLE"));
        
        await synthia.connect(orchestrator).registerAgent(analyzer.address, ANALYZER_ROLE);
        await synthia.connect(orchestrator).registerAgent(blockchain.address, BLOCKCHAIN_ROLE);
        await synthia.connect(orchestrator).registerAgent(marketplace.address, MARKETPLACE_ROLE);
    });
    
    describe("Multi-Agent System", function () {
        it("Should register agents with correct roles", async function () {
            const stats = await synthia.getStatistics();
            expect(stats.totalAgents).to.equal(4); // orchestrator + 3 registered
        });
        
        it("Should allow only orchestrator to register agents", async function () {
            const ANALYZER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ANALYZER_ROLE"));
            
            await expect(
                synthia.connect(user).registerAgent(user.address, ANALYZER_ROLE)
            ).to.be.reverted;
        });
    });
    
    describe("Score Updates with MeTTa", function () {
        it("Should update score with MeTTa reasoning", async function () {
            // User requests
            await synthia.connect(user).requestScoreUpdate();
            
            // Analyzer updates with MeTTa hash
            const mettaRulesHash = ethers.keccak256(ethers.toUtf8Bytes("elite_defi_user,excellent_reputation"));
            const score = 875;
            const adjustment = 50;
            
            await expect(
                synthia.connect(analyzer).updateScore(
                    user.address,
                    score,
                    mettaRulesHash,
                    adjustment
                )
            ).to.emit(synthia, "ScoreUpdated")
              .and.to.emit(synthia, "MettaReasoningApplied");
            
            const [userScore, timestamp, analyzerAddr, mettaHash, version] = 
                await synthia.getUserReputation(user.address);
            
            expect(userScore).to.equal(score);
            expect(analyzerAddr).to.equal(analyzer.address);
            expect(mettaHash).to.equal(mettaRulesHash);
            expect(version).to.equal(1);
        });
        
        it("Should unlock achievements based on score", async function () {
            await synthia.connect(user).requestScoreUpdate();
            
            const mettaHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            
            // Test Diamond tier (900+)
            await expect(
                synthia.connect(analyzer).updateScore(user.address, 950, mettaHash, 0)
            ).to.emit(synthia, "AchievementUnlocked")
              .withArgs(user.address, "Elite Reputation", 950, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));
        });
    });
    
    describe("Batch Updates", function () {
        it("Should batch update multiple users efficiently", async function () {
            const users = [user.address, owner.address];
            const scores = [750, 850];
            const hashes = [
                ethers.keccak256(ethers.toUtf8Bytes("rule1")),
                ethers.keccak256(ethers.toUtf8Bytes("rule2"))
            ];
            
            // Request updates
            await synthia.connect(user).requestScoreUpdate();
            await synthia.connect(owner).requestScoreUpdate();
            
            // Batch update
            await expect(
                synthia.connect(analyzer).batchUpdateScores(users, scores, hashes)
            ).to.emit(synthia, "BatchScoresUpdated");
            
            const [score1] = await synthia.getUserReputation(user.address);
            const [score2] = await synthia.getUserReputation(owner.address);
            
            expect(score1).to.equal(750);
            expect(score2).to.equal(850);
        });
        
        it("Should reject batch that's too large", async function () {
            const users = new Array(51).fill(user.address);
            const scores = new Array(51).fill(750);
            const hashes = new Array(51).fill(ethers.keccak256(ethers.toUtf8Bytes("test")));
            
            await expect(
                synthia.connect(analyzer).batchUpdateScores(users, scores, hashes)
            ).to.be.revertedWith("Batch too large");
        });
    });
    
    describe("A2A/AP2 Integration", function () {
        it("Should handle A2A reputation request", async function () {
            const requestTx = await synthia.connect(marketplace).requestAnalysisViaA2A(
                user.address,
                10 // 10 HBAR max
            );
            
            const receipt = await requestTx.wait();
            const event = receipt.logs.find(log => {
                try {
                    return synthia.interface.parseLog(log).name === 'A2ARequestReceived';
                } catch {
                    return false;
                }
            });
            
            expect(event).to.not.be.undefined;
        });
        
        it("Should confirm AP2 payment", async function () {
            const requestId = ethers.keccak256(ethers.toUtf8Bytes("test-request"));
            const invoiceId = ethers.keccak256(ethers.toUtf8Bytes("invoice-123"));
            
            await expect(
                synthia.connect(marketplace).confirmAP2Payment(
                    requestId,
                    invoiceId,
                    5 // 5 HBAR
                )
            ).to.emit(synthia, "AP2PaymentReceived");
        });
    });
    
    describe("HCS Integration", function () {
        it("Should log to HCS", async function () {
            const hcsMessageId = ethers.keccak256(ethers.toUtf8Bytes("hcs-message-1"));
            
            await expect(
                synthia.connect(blockchain).logToHCS(user.address, hcsMessageId)
            ).to.emit(synthia, "HCSAuditLogged");
        });
        
        it("Should set HCS topic ID", async function () {
            const topicId = ethers.keccak256(ethers.toUtf8Bytes("0.0.12345"));
            await synthia.setHCSAuditTopic(topicId);
            
            expect(await synthia.hcsAuditTopicId()).to.equal(topicId);
        });
    });
    
    describe("NFT Enhancements", function () {
        it("Should create NFT with correct tier", async function () {
            await synthia.connect(user).requestScoreUpdate();
            
            const mettaHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await synthia.connect(analyzer).updateScore(user.address, 875, mettaHash, 0);
            
            const tokenId = await nft.getTokenId(user.address);
            const [score, lastUpdated, totalUpdates, firstMinted, tier] = 
                await nft.getFullReputationData(tokenId);
            
            expect(score).to.equal(875);
            expect(tier).to.equal("Platinum");
        });
        
        it("Should emit TierChanged when score crosses threshold", async function () {
            await synthia.connect(user).requestScoreUpdate();
            
            const mettaHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            
            // First update: Gold tier (750)
            await synthia.connect(analyzer).updateScore(user.address, 750, mettaHash, 0);
            
            // Second update: Platinum tier (875)
            await synthia.connect(user).requestScoreUpdate();
            
            await expect(
                synthia.connect(analyzer).updateScore(user.address, 875, mettaHash, 0)
            ).to.emit(nft, "TierChanged")
              .withArgs(user.address, await nft.getTokenId(user.address), "Gold", "Platinum");
        });
        
        it("Should generate valid SVG", async function () {
            await synthia.connect(user).requestScoreUpdate();
            
            const mettaHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await synthia.connect(analyzer).updateScore(user.address, 950, mettaHash, 0);
            
            const tokenId = await nft.getTokenId(user.address);
            const uri = await nft.tokenURI(tokenId);
            
            // Decode base64
            const base64Data = uri.split(',')[1];
            const jsonString = Buffer.from(base64Data, 'base64').toString();
            const metadata = JSON.parse(jsonString);
            
            expect(metadata.name).to.include("Synthia Reputation");
            expect(metadata.description).to.include("ASI Alliance");
            expect(metadata.image).to.include("data:image/svg+xml");
            
            // Check attributes
            const scoreAttr = metadata.attributes.find(a => a.trait_type === "Score");
            expect(scoreAttr.value).to.equal(950);
            
            const tierAttr = metadata.attributes.find(a => a.trait_type === "Tier");
            expect(tierAttr.value).to.equal("Diamond");
        });
    });
    
    describe("Gas Optimization", function () {
        it("Should have reasonable gas costs on Hedera", async function () {
            await synthia.connect(user).requestScoreUpdate();
            
            const mettaHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            const tx = await synthia.connect(analyzer).updateScore(
                user.address,
                750,
                mettaHash,
                0
            );
            
            const receipt = await tx.wait();
            console.log(`Gas used for score update: ${receipt.gasUsed}`);
            
            // On Hedera, gas costs are ~$0.0001, so even 500k gas is acceptable
            expect(receipt.gasUsed).to.be.lessThan(500000);
        });
    });
    
    describe("Security", function () {
        it("Should prevent unauthorized score updates", async function () {
            await synthia.connect(user).requestScoreUpdate();
            
            const mettaHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            
            await expect(
                synthia.connect(user).updateScore(user.address, 750, mettaHash, 0)
            ).to.be.reverted;
        });
        
        it("Should enforce soulbound property", async function () {
            await synthia.connect(user).requestScoreUpdate();
            
            const mettaHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await synthia.connect(analyzer).updateScore(user.address, 750, mettaHash, 0);
            
            const tokenId = await nft.getTokenId(user.address);
            
            await expect(
                nft.connect(user).transferFrom(user.address, owner.address, tokenId)
            ).to.be.revertedWith("Token is soulbound");
        });
    });
});