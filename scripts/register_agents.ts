import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "testnet"
});

async function main() {
  console.log("🤖 Registering Agent EVM Addresses");
  console.log("=" .repeat(60));

  // Contract address from deployment
  const SYNTHIA_CONTRACT_ADDRESS = "0x842f6A891496d7dE99736834A9E942904E5b538A";

  console.log(`\n📋 Contract: ${SYNTHIA_CONTRACT_ADDRESS}\n`);

  // Get contract instance
  const Synthia = await ethers.getContractAt("Synthia", SYNTHIA_CONTRACT_ADDRESS);

  // ============================================
  // 1. GENERATE EVM WALLETS FOR AGENTS
  // ============================================
  console.log("🔑 Step 1: Generating EVM Wallets for Agents...\n");

  const analyzerWallet = ethers.Wallet.createRandom();
  const blockchainWallet = ethers.Wallet.createRandom();

  console.log("Generated Addresses:");
  console.log(`   Analyzer:   ${analyzerWallet.address}`);
  console.log(`   Blockchain: ${blockchainWallet.address}\n`);

  // ============================================
  // 2. DEFINE ROLES
  // ============================================
  const ANALYZER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ANALYZER_ROLE"));
  const BLOCKCHAIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("BLOCKCHAIN_ROLE"));

  console.log("📜 Role Hashes:");
  console.log(`   ANALYZER_ROLE:   ${ANALYZER_ROLE}`);
  console.log(`   BLOCKCHAIN_ROLE: ${BLOCKCHAIN_ROLE}\n`);

  // ============================================
  // 3. REGISTER ANALYZER AGENT
  // ============================================
  console.log("📝 Step 2: Registering Analyzer Agent...");

  try {
    const tx1 = await Synthia.registerAgent(analyzerWallet.address, ANALYZER_ROLE);
    console.log(`   Transaction submitted: ${tx1.hash}`);
    console.log(`   Waiting for confirmation...`);
    await tx1.wait();
    console.log("   ✅ Analyzer agent registered!\n");
  } catch (error: any) {
    if (error.message.includes("already")) {
      console.log("   ⚠️  Analyzer already registered (skipping)\n");
    } else {
      console.error("   ❌ Failed:", error.message);
      process.exit(1);
    }
  }

  // ============================================
  // 4. REGISTER BLOCKCHAIN AGENT
  // ============================================
  console.log("📝 Step 3: Registering Blockchain Agent...");

  try {
    const tx2 = await Synthia.registerAgent(blockchainWallet.address, BLOCKCHAIN_ROLE);
    console.log(`   Transaction submitted: ${tx2.hash}`);
    console.log(`   Waiting for confirmation...`);
    await tx2.wait();
    console.log("   ✅ Blockchain agent registered!\n");
  } catch (error: any) {
    if (error.message.includes("already")) {
      console.log("   ⚠️  Blockchain agent already registered (skipping)\n");
    } else {
      console.error("   ❌ Failed:", error.message);
      process.exit(1);
    }
  }

  // ============================================
  // 5. VERIFY REGISTRATION
  // ============================================
  console.log("🔍 Step 4: Verifying Registration...");

  try {
    const totalAgents = await Synthia.totalAgentsRegistered();
    console.log(`   Total agents registered: ${totalAgents}\n`);
  } catch (error: any) {
    console.error("   ❌ Verification failed:", error.message);
  }

  // ============================================
  // 6. SAVE PRIVATE KEYS
  // ============================================
  console.log("=" .repeat(60));
  console.log("🔐 IMPORTANT: Agent EVM Private Keys");
  console.log("=".repeat(60));
  console.log(`\nAnalyzer Private Key: ${analyzerWallet.privateKey}`);
  console.log(`Blockchain Private Key: ${blockchainWallet.privateKey}`);
  
  console.log("\n" + "=".repeat(60));
  console.log("📋 Agent EVM Addresses Generated");
  console.log("=".repeat(60));
  console.log(`Analyzer Address: ${analyzerWallet.address}`);
  console.log(`Blockchain Address: ${blockchainWallet.address}`);
  console.log(`Synthia Contract: ${SYNTHIA_CONTRACT_ADDRESS}`);

  console.log("\n" + "=".repeat(60));
  console.log("🎯 Next Steps:");
  console.log("   1. Save the generated private keys securely");
  console.log("   2. Configure agents with these EVM addresses");
  console.log("   3. Test agent registration on Agentverse");
  console.log("=".repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });