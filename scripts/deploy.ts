import { network } from "hardhat";

async function main() {
  // Connect to the testnet network
  const { ethers } = await network.connect({
    network: "hederaTestnet"
  });

  console.log("Deploying Synthia contracts to Hedera testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy SynthiaNFT first
  console.log("Deploying SynthiaNFT...");
  const SynthiaNFT = await ethers.getContractFactory("SynthiaNFT", deployer);
  const nftContract = await SynthiaNFT.deploy();
  await nftContract.waitForDeployment();
  const nftAddress = await nftContract.getAddress();
  console.log("SynthiaNFT deployed to:", nftAddress);

  // Deploy Synthia main contract (deployer becomes initial ASI agent)
  console.log("Deploying Synthia...");
  const Synthia = await ethers.getContractFactory("Synthia", deployer);
  const synthiaContract = await Synthia.deploy(deployer.address);
  await synthiaContract.waitForDeployment();
  const synthiaAddress = await synthiaContract.getAddress();
  console.log("Synthia deployed to:", synthiaAddress);

  // Verify NFT contract ownership
  const nftOwner = await nftContract.owner();
  console.log("NFT contract owner:", nftOwner);
  console.log("Synthia contract address:", synthiaAddress);

  if (nftOwner.toLowerCase() !== synthiaAddress.toLowerCase()) {
    console.log("Warning: NFT contract ownership not properly transferred!");
    console.log("You may need to manually call setSynthiaContract on the NFT contract");
  }

  // Display deployment information
  console.log("\n=== Deployment Summary ===");
  console.log("Network: Hedera Testnet");
  console.log("SynthiaNFT Contract:", nftAddress);
  console.log("Synthia Contract:", synthiaAddress);
  console.log("Initial ASI Agent:", deployer.address);

  // Save addresses for frontend configuration
  console.log("\nAdd these to your .env file:");
  console.log(`VITE_SYNTHIA_CONTRACT_ADDRESS=${synthiaAddress}`);
  console.log(`VITE_SYNTHIA_NFT_CONTRACT_ADDRESS=${nftAddress}`);
  console.log(`VITE_HEDERA_NETWORK=testnet`);

  console.log("\nDeployment completed successfully! ✅");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
