// scripts/deploy_enhanced.js
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying Enhanced Synthia Contracts...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    // Get orchestrator agent address from environment
    const ORCHESTRATOR_ADDRESS = process.env.ORCHESTRATOR_AGENT_ADDRESS;
    
    if (!ORCHESTRATOR_ADDRESS) {
        throw new Error("ORCHESTRATOR_AGENT_ADDRESS not set in .env");
    }
    
    // Deploy Synthia
    const Synthia = await ethers.getContractFactory("Synthia");
    const synthia = await Synthia.deploy(ORCHESTRATOR_ADDRESS);
    await synthia.waitForDeployment();
    
    const synthiaAddress = await synthia.getAddress();
    console.log("✅ Synthia deployed to:", synthiaAddress);
    
    // Get NFT address
    const nftAddress = await synthia.synthiaNFT();
    console.log("✅ SynthiaNFT deployed to:", nftAddress);
    
    // Register agents
    console.log("\n📝 Registering agents...");
    
    const ANALYZER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ANALYZER_ROLE"));
    const BLOCKCHAIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("BLOCKCHAIN_ROLE"));
    const MARKETPLACE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MARKETPLACE_ROLE"));
    
    if (process.env.ANALYZER_AGENT_ADDRESS) {
        await synthia.registerAgent(process.env.ANALYZER_AGENT_ADDRESS, ANALYZER_ROLE);
        console.log("✅ Analyzer agent registered");
    }
    
    if (process.env.BLOCKCHAIN_AGENT_ADDRESS) {
        await synthia.registerAgent(process.env.BLOCKCHAIN_AGENT_ADDRESS, BLOCKCHAIN_ROLE);
        console.log("✅ Blockchain agent registered");
    }
    
    if (process.env.MARKETPLACE_AGENT_ADDRESS) {
        await synthia.registerAgent(process.env.MARKETPLACE_AGENT_ADDRESS, MARKETPLACE_ROLE);
        console.log("✅ Marketplace agent registered");
    }
    
    // Verify contracts on Hashscan
    console.log("\n🔍 Verifying contracts on Hashscan...");
    
    try {
        await hre.run("verify:verify", {
            address: synthiaAddress,
            constructorArguments: [ORCHESTRATOR_ADDRESS],
            contract: "contracts/Synthia.sol:Synthia"
        });
        console.log("✅ Synthia verified on Hashscan");
    } catch (error: unknown) {
        console.log("⚠️  Verification error:", error instanceof Error ? error.message : String(error));
    }
    
    // Save deployment info
    const deployment = {
        synthia: synthiaAddress,
        nft: nftAddress,
        orchestrator: ORCHESTRATOR_ADDRESS,
        network: "hedera-testnet",
        timestamp: new Date().toISOString()
    };
    
    require('fs').writeFileSync(
        'deployment.json',
        JSON.stringify(deployment, null, 2)
    );
    
    console.log("\n💾 Deployment info saved to deployment.json");
    console.log("\n🎉 Deployment complete!");
    console.log("\n📋 Next steps:");
    console.log("1. Update agent .env files with contract addresses");
    console.log("2. Set HCS topic ID: await synthia.setHCSAuditTopic()");
    console.log("3. Deploy agents to Agentverse");
    console.log("4. Test end-to-end flow");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
