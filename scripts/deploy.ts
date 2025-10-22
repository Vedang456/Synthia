import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "testnet"
});

async function main() {
  // Get the signer of the tx and address for deploying the contract
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Synthia contract with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy the Synthia contract
  // The constructor takes an orchestrator agent address - we'll use the deployer for now
  const Synthia = await ethers.getContractFactory("Synthia", deployer);
  const synthia = await Synthia.deploy(deployer.address);

  await synthia.waitForDeployment();

  const synthiaAddress = await synthia.getAddress();
  console.log("Synthia contract deployed at:", synthiaAddress);

  // Get the SynthiaNFT address that was deployed internally
  const synthiaNFTAddress = await synthia.synthiaNFT();
  console.log("SynthiaNFT contract deployed at:", synthiaNFTAddress);

  // Verify deployment by checking some initial values
  console.log("\n=== Deployment Verification ===");
  console.log("Total agents registered:", await synthia.totalAgentsRegistered());
  console.log("Total analyses completed:", await synthia.totalAnalysesCompleted());
  
  // Check if deployer has ORCHESTRATOR_ROLE
  const ORCHESTRATOR_ROLE = await synthia.ORCHESTRATOR_ROLE();
  const hasOrchestratorRole = await synthia.hasRole(ORCHESTRATOR_ROLE, deployer.address);
  console.log("Deployer has ORCHESTRATOR_ROLE:", hasOrchestratorRole);

  // Check NFT contract details
  const nftContract = await ethers.getContractAt("SynthiaNFT", synthiaNFTAddress);
  console.log("NFT name:", await nftContract.name());
  console.log("NFT symbol:", await nftContract.symbol());
  console.log("Synthia contract set in NFT:", await nftContract.synthiaContract());

  console.log("\n=== Deployment Complete ===");
  console.log("You can now:");
  console.log("1. Register additional agents using registerAgent()");
  console.log("2. Set HCS topic ID using setHCSAuditTopic()");
  console.log("3. Set HTS token address using setHTSReputationToken()");
  console.log("4. Request score updates using requestScoreUpdate()");
}

main().catch(console.error);
