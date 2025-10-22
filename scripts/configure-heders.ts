import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "testnet"
});

async function main() {
  console.log("🔧 Configuring Hedera Services in Synthia Contract");
  console.log("=" .repeat(60));

  // Replace these with your actual values
  const SYNTHIA_CONTRACT_ADDRESS = "0x842f6A891496d7dE99736834A9E942904E5b538A"; // Your deployed contract address
  const HCS_AUDIT_TOPIC_ID = "0.0.xxx"; // Replace with your HCS topic ID
  const HTS_REPUTATION_TOKEN_ID = "0.0.xx"; // Replace with your HTS token ID

  // Validate
  if (HCS_AUDIT_TOPIC_ID.includes("YOUR_")) {
    console.error("❌ Please update HCS_AUDIT_TOPIC_ID with your actual HCS topic ID");
    process.exit(1);
  }
  if (HTS_REPUTATION_TOKEN_ID.includes("YOUR_")) {
    console.error("❌ Please update HTS_REPUTATION_TOKEN_ID with your actual HTS token ID");
    process.exit(1);
  }

  console.log("\n📋 Configuration:");
  console.log(`   Contract: ${SYNTHIA_CONTRACT_ADDRESS}`);
  console.log(`   HCS Topic: ${HCS_AUDIT_TOPIC_ID}`);
  console.log(`   HTS Token: ${HTS_REPUTATION_TOKEN_ID}\n`);

  // Get contract instance
  const Synthia = await ethers.getContractAt("Synthia", SYNTHIA_CONTRACT_ADDRESS);

  // ============================================
  // 1. SET HCS AUDIT TOPIC
  // ============================================
  console.log("📝 Step 1: Setting HCS Audit Topic...");

  // Convert "0.0.7100561" to bytes32
  const topicParts = HCS_AUDIT_TOPIC_ID.split(".");
  const topicNum = BigInt(topicParts[2]);
  const topicBytes32 = ethers.zeroPadValue(ethers.toBeHex(topicNum), 32);

  console.log(`   Converting ${HCS_AUDIT_TOPIC_ID} to bytes32...`);

  try {
    const tx1 = await Synthia.setHCSAuditTopic(topicBytes32);
    console.log(`   Transaction submitted: ${tx1.hash}`);
    console.log(`   Waiting for confirmation...`);
    await tx1.wait();
    console.log("   ✅ HCS Topic set successfully!\n");
  } catch (error: any) {
    if (error.message.includes("already set")) {
      console.log("   ⚠️  HCS Topic already set (skipping)\n");
    } else {
      console.error("   ❌ Failed:", error.message);
      process.exit(1);
    }
  }

  // ============================================
  // 2. SET HTS REPUTATION TOKEN
  // ============================================
  console.log("🎨 Step 2: Setting HTS Reputation Token...");

  // Convert "0.0.7100548" to EVM address
  const tokenParts = HTS_REPUTATION_TOKEN_ID.split(".");
  const shard = BigInt(tokenParts[0]);
  const realm = BigInt(tokenParts[1]);
  const tokenNum = BigInt(tokenParts[2]);

  // Hedera Token ID to Solidity Address Conversion
  const tokenAddress = ethers.getAddress(
    "0x" +
      shard.toString(16).padStart(8, "0") +
      realm.toString(16).padStart(16, "0") +
      tokenNum.toString(16).padStart(16, "0")
  );

  console.log(`   Converting ${HTS_REPUTATION_TOKEN_ID} to EVM address...`);
  console.log(`   Token Address: ${tokenAddress}`);

  try {
    const tx2 = await Synthia.setHTSReputationToken(tokenAddress);
    console.log(`   Transaction submitted: ${tx2.hash}`);
    console.log(`   Waiting for confirmation...`);
    await tx2.wait();
    console.log("   ✅ HTS Token set successfully!\n");
  } catch (error: any) {
    if (error.message.includes("already set")) {
      console.log("   ⚠️  HTS Token already set (skipping)\n");
    } else {
      console.error("   ❌ Failed:", error.message);
      process.exit(1);
    }
  }

  // ============================================
  // 3. VERIFY CONFIGURATION
  // ============================================
  console.log("🔍 Step 3: Verifying Configuration...");

  try {
    const setTopicId = await Synthia.hcsAuditTopicId();
    const setTokenAddress = await Synthia.htsReputationToken();

    console.log(`   HCS Topic (bytes32): ${setTopicId}`);
    console.log(`   HTS Token Address: ${setTokenAddress}`);

    // Check if they match
    const topicMatch = setTopicId === topicBytes32;
    const tokenMatch = setTokenAddress.toLowerCase() === tokenAddress.toLowerCase();

    if (topicMatch && tokenMatch) {
      console.log("\n✅ Configuration verified successfully!");
    } else {
      console.log("\n⚠️  Configuration mismatch detected:");
      if (!topicMatch) console.log("   - HCS Topic mismatch");
      if (!tokenMatch) console.log("   - HTS Token mismatch");
    }
  } catch (error: any) {
    console.error("   ❌ Verification failed:", error.message);
  }

  // ============================================
  // 4. SUMMARY
  // ============================================
  console.log("\n" + "=".repeat(60));
  console.log("📊 Configuration Summary");
  console.log("=".repeat(60));
  console.log(`Contract Address: ${SYNTHIA_CONTRACT_ADDRESS}`);
  console.log(`HCS Topic ID: ${HCS_AUDIT_TOPIC_ID}`);
  console.log(`HTS Token ID: ${HTS_REPUTATION_TOKEN_ID}`);
  console.log(`HTS EVM Address: ${tokenAddress}`);
  console.log("=".repeat(60));

  console.log("\n🎯 Next Steps:");
  console.log("   1. Verify on HashScan:");
  console.log(`      https://hashscan.io/testnet/contract/${SYNTHIA_CONTRACT_ADDRESS}`);
  console.log("   2. Run register-agents.ts to register agent EVM addresses");
  console.log("   3. Configure Agentverse secrets for all agents");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });