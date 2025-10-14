import { network } from "hardhat";

async function main() {
  // Connect to the testnet network
  const { ethers } = await network.connect({
    network: "hederaTestnet"
  });

  // Use the actual deployed contract addresses
  const synthiaAddress = "0x6186cA1D1EE5A697891e249A30b3fF714B2C3f4E";
  const nftAddress = "0x6dd7d08fb195578AAf9ED13Fe1FEFa0b1746d8Ee";

  console.log("Testing Synthia contracts on Hedera testnet...");
  console.log("Synthia address:", synthiaAddress);
  console.log("NFT address:", nftAddress);

  // Get signers
  const [deployer, user1, user2] = await ethers.getSigners();

  // Get contract instances with signers
  const synthiaContract = await ethers.getContractAt("Synthia", synthiaAddress, deployer);
  const nftContract = await ethers.getContractAt("SynthiaNFT", nftAddress, deployer);

  console.log("\n=== Testing Basic Functionality ===");

  // Test 1: Check ASI agent
  const asiAgent = await synthiaContract.asiAgent();
  console.log("Current ASI Agent:", asiAgent);

  // Test 2: User requests score update (using deployer as test user for now)
  console.log("\nUser requesting score update...");
  const tx1 = await synthiaContract.requestScoreUpdate();
  await tx1.wait();
  console.log("✅ Score update requested");

  // Test 3: Check pending update for deployer
  const isPending1 = await synthiaContract.pendingUpdates(deployer.address);
  console.log("Deployer has pending update:", isPending1);

  // Test 4: ASI agent updates score for deployer (test user)
  console.log("\nASI agent updating deployer score to 750...");
  const tx2 = await synthiaContract.updateScore(deployer.address, 750);
  await tx2.wait();
  console.log("✅ Score updated for deployer");

  // Test 5: Check deployer score
  const [score1, lastUpdated1] = await synthiaContract.getUserScore(deployer.address);
  console.log(`Deployer score: ${score1}, last updated: ${new Date(Number(lastUpdated1) * 1000)}`);

  // Test 6: Check NFT token ID for deployer
  const tokenId1 = await nftContract.getTokenId(deployer.address);
  console.log("Deployer token ID:", tokenId1);

  // Test 7: Check NFT reputation data
  if (tokenId1 > 0) {
    const [nftScore1, nftLastUpdated1] = await nftContract.getReputationData(tokenId1);
    console.log(`NFT score for token ${tokenId1}: ${nftScore1}, last updated: ${new Date(Number(nftLastUpdated1) * 1000)}`);
  }

  // Test 8: Test high score for achievement (update deployer to 850)
  console.log("\nUpdating deployer score to 850 (should trigger achievement)...");
  const tx3 = await synthiaContract.updateScore(deployer.address, 850);
  await tx3.wait();
  console.log("✅ High score updated (achievement should be unlocked)");

  // Test 9: Verify high score
  const [score2, lastUpdated2] = await synthiaContract.getUserScore(deployer.address);
  console.log(`Deployer high score: ${score2}, last updated: ${new Date(Number(lastUpdated2) * 1000)}`);

  // Test 10: Check updated NFT data
  const tokenId2 = await nftContract.getTokenId(deployer.address);
  console.log("Updated deployer token ID:", tokenId2);

  if (tokenId2 > 0) {
    const [nftScore2, nftLastUpdated2] = await nftContract.getReputationData(tokenId2);
    console.log(`Updated NFT score for token ${tokenId2}: ${nftScore2}, last updated: ${new Date(Number(nftLastUpdated2) * 1000)}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Testing failed:", error);
    process.exit(1);
  });
