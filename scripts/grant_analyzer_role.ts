import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "testnet"
});

async function main() {
  console.log("🎯 Granting ANALYZER_ROLE to Specific Address");
  console.log("=" .repeat(60));

  // Contract address from your deployment
  const SYNTHIA_CONTRACT_ADDRESS = "0x88FF715f1c23C2061133994cFd58c1E35A05beA2";
  const TARGET_ADDRESS = "0x509773c61012620fCBb8bED0BccAE44f1A93AD0C";

  console.log(`📋 Contract: ${SYNTHIA_CONTRACT_ADDRESS}`);
  console.log(`🏷️  Target Address: ${TARGET_ADDRESS}\n`);

  // Get contract instance
  const Synthia = await ethers.getContractAt("Synthia", SYNTHIA_CONTRACT_ADDRESS);

  // ============================================
  // 1. DEFINE ANALYZER_ROLE
  // ============================================
  const ANALYZER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ANALYZER_ROLE"));

  console.log("📜 Role Hash:");
  console.log(`   ANALYZER_ROLE: ${ANALYZER_ROLE}\n`);

  // ============================================
  // 2. GRANT ANALYZER_ROLE TO TARGET ADDRESS
  // ============================================
  console.log("📝 Granting ANALYZER_ROLE to target address...");

  try {
    const tx = await Synthia.registerAgent(TARGET_ADDRESS, ANALYZER_ROLE);
    console.log(`   Transaction submitted: ${tx.hash}`);
    console.log(`   Waiting for confirmation...`);
    await tx.wait();
    console.log("   ✅ ANALYZER_ROLE granted successfully!\n");
  } catch (error: any) {
    if (error.message.includes("already")) {
      console.log("   ⚠️  Address already has ANALYZER_ROLE (or another role)\n");
    } else {
      console.error("   ❌ Failed:", error.message);
      process.exit(1);
    }
  }

  // ============================================
  // 3. VERIFY REGISTRATION
  // ============================================
  console.log("🔍 Verifying Registration...");

  try {
    const totalAgents = await Synthia.totalAgentsRegistered();
    console.log(`   Total agents registered: ${totalAgents}`);

    // Check if the address has the ANALYZER_ROLE
    const hasRole = await Synthia.hasRole(ANALYZER_ROLE, TARGET_ADDRESS);
    console.log(`   Address ${TARGET_ADDRESS} has ANALYZER_ROLE: ${hasRole}\n`);

  } catch (error: any) {
    console.error("   ❌ Verification failed:", error.message);
  }

  console.log("=" .repeat(60));
  console.log("✅ Role Grant Complete!");
  console.log("📋 Summary:");
  console.log(`   Contract: ${SYNTHIA_CONTRACT_ADDRESS}`);
  console.log(`   Address: ${TARGET_ADDRESS}`);
  console.log(`   Role: ANALYZER_ROLE`);
  console.log(`   Status: ✅ Granted`);
  console.log("=" .repeat(60) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
