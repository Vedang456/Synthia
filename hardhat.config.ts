import type { HardhatUserConfig } from "hardhat/config";
import hashscanVerify from "hashscan-verify";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable } from "hardhat/config";


const config: HardhatUserConfig = {
  plugins: [hardhatToolboxMochaEthersPlugin, hashscanVerify],
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    mainnet: {
      type: "http",
      url: "https://mainnet.hashio.io/api",
      accounts: [configVariable("HEDERA_PRIVATE_KEY")]
    },
    testnet: {
      type: "http",
      url: "https://testnet.hashio.io/api", 
      accounts: [configVariable("HEDERA_PRIVATE_KEY")]
    },
    previewnet: {
      type: "http",
      url: "https://previewnet.hashio.io/api",
      accounts: [configVariable("HEDERA_PRIVATE_KEY")]
    },
    local: {
      type: "http",
      url: "http://localhost:7546",
      accounts: [configVariable("HEDERA_PRIVATE_KEY")]
    },
  },
};

export default config;
