# FILE: blockchain_hedera_agent.py
# Production-ready Blockchain Agent for Synthia on Hedera

from uagents import Agent, Context, Model, Protocol
import json
import os
import hashlib
import time
from typing import Dict, Any, Optional, List

# Try to import Web3, but provide fallback if not available
try:
    from web3 import Web3
    from eth_account import Account
    WEB3_AVAILABLE = True
except ImportError:
    WEB3_AVAILABLE = False
    print("⚠️  Web3 not available - running in simulation mode")

# Import Hedera services
try:
    from hedera_services_integration import HederaServicesIntegration
except ImportError:
    print("⚠️  Creating inline Hedera services integration...")
    # Inline minimal version if import fails
    class HederaServicesIntegration:
        def __init__(self):
            self.audit_topic_id = os.getenv("HCS_AUDIT_TOPIC_ID", "0.0.123456")
            self.reputation_token_id = os.getenv("HTS_REPUTATION_TOKEN_ID", "0.0.789012")
            self._sequence_counter = 1
            self._serial_counter = 1
            
        async def ensure_initialized(self):
            pass
            
        async def log_analysis_to_hcs(self, wallet: str, analysis: dict) -> int:
            self._sequence_counter += 1
            print(f"📝 HCS Log: Sequence #{self._sequence_counter}")
            return self._sequence_counter
            
        async def mint_reputation_nft(self, wallet: str, score: int, metadata: dict) -> Optional[int]:
            self._serial_counter += 1
            print(f"🎨 NFT Minted: Serial #{self._serial_counter}")
            return self._serial_counter

# ============= MESSAGE MODELS =============
class BlockchainUpdate(Model):
    """Message for blockchain score updates"""
    request_id: str
    wallet_address: str
    score: int
    score_adjustment: int
    metta_rules_applied: list  # List of MeTTa rules applied
    analysis_data: dict

class BlockchainConfirmation(Model):
    """Confirmation message for blockchain operations"""
    request_id: str
    status: str
    tx_hash: str = ""
    hcs_sequence: int = 0
    contract_address: str = ""
    nft_token_id: str = ""
    error: str = ""

class BatchUpdateRequest(Model):
    """Request for batch score updates"""
    request_id: str
    updates: List[Dict[str, Any]]  # List of {wallet, score, metta_rules}

class AgentRegistrationRequest(Model):
    """Request to register a new agent"""
    agent_address: str
    role: str  # "ANALYZER", "BLOCKCHAIN", "MARKETPLACE"

# ============= CONTRACT ABIS =============
def get_synthia_abi():
    """Get Synthia contract ABI"""
    return [
        {
            "inputs": [
                {"internalType": "address", "name": "agent", "type": "address"},
                {"internalType": "bytes32", "name": "role", "type": "bytes32"}
            ],
            "name": "registerAgent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "address", "name": "user", "type": "address"},
                {"internalType": "uint256", "name": "score", "type": "uint256"},
                {"internalType": "bytes32", "name": "mettaRulesHash", "type": "bytes32"},
                {"internalType": "int256", "name": "scoreAdjustment", "type": "int256"}
            ],
            "name": "updateScore",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "address[]", "name": "users", "type": "address[]"},
                {"internalType": "uint256[]", "name": "scores", "type": "uint256[]"},
                {"internalType": "bytes32[]", "name": "mettaRulesHashes", "type": "bytes32[]"}
            ],
            "name": "batchUpdateScores",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "address", "name": "user", "type": "address"},
                {"internalType": "bytes32", "name": "hcsMessageId", "type": "bytes32"}
            ],
            "name": "logToHCS",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
            "name": "getUserReputation",
            "outputs": [
                {"internalType": "uint256", "name": "score", "type": "uint256"},
                {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                {"internalType": "address", "name": "analyzer", "type": "address"},
                {"internalType": "bytes32", "name": "mettaRules", "type": "bytes32"},
                {"internalType": "uint256", "name": "version", "type": "uint256"},
                {"internalType": "uint256", "name": "nftTokenId", "type": "uint256"}
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

def get_nft_abi():
    """Get SynthiaNFT contract ABI"""
    return [
        {
            "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
            "name": "getTokenId",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
            "name": "tokenURI",
            "outputs": [{"internalType": "string", "name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function"
        }
    ]

# ============= MAIN BLOCKCHAIN AGENT =============
class BlockchainAgent:
    """Production blockchain agent for Synthia on Hedera"""
    
    def __init__(self):
        # Initialize agent
        self.agent = Agent(
            name="synthia_blockchain_agent",
            seed=os.getenv("BLOCKCHAIN_SEED", "synthia_blockchain_seed_2025"),
            port=8002
        )
        
        # Add mailbox if key is provided
        mailbox_key = os.getenv("BLOCKCHAIN_MAILBOX_KEY")
        if mailbox_key:
            self.agent.mailbox = f"{mailbox_key}@https://agentverse.ai"
        
        # Contract addresses (PRODUCTION)
        self.synthia_address = "0x6186cA1D1EE5A697891e249A30b3fF714B2C3f4E"
        self.nft_address = "0x6dd7d08fb195578AAf9ED13Fe1FEFa0b1746d8Ee"
        
        # Initialize Web3 connection
        self.w3 = None
        self.account = None
        self.synthia_contract = None
        self.nft_contract = None
        
        if WEB3_AVAILABLE:
            try:
                self.setup_web3()
            except Exception as e:
                print(f"⚠️  Web3 setup failed: {e}")
                print("   Continuing in simulation mode...")
        
        # Initialize Hedera services
        self.hedera_services = HederaServicesIntegration()
        
        # Role constants
        self.ROLES = {
            "ANALYZER": Web3.keccak(text="ANALYZER_ROLE").hex() if WEB3_AVAILABLE else "0x" + "0"*64,
            "BLOCKCHAIN": Web3.keccak(text="BLOCKCHAIN_ROLE").hex() if WEB3_AVAILABLE else "0x" + "0"*64,
            "MARKETPLACE": Web3.keccak(text="MARKETPLACE_ROLE").hex() if WEB3_AVAILABLE else "0x" + "0"*64
        }
        
        # Setup protocols
        self.setup_protocols()
    
    def setup_web3(self):
        """Setup Web3 and contract connections"""
        # Connect to Hedera's EVM-compatible endpoint
        self.w3 = Web3(Web3.HTTPProvider('https://testnet.hashio.io/api'))
        
        if not self.w3.is_connected():
            raise Exception("Failed to connect to Hedera testnet")
        
        print(f"✅ Connected to Hedera testnet")
        
        # Setup account
        private_key = os.getenv('HEDERA_PRIVATE_KEY')
        if private_key:
            # Ensure private key has 0x prefix
            if not private_key.startswith('0x'):
                private_key = '0x' + private_key
            self.account = Account.from_key(private_key)
            print(f"✅ Using account: {self.account.address}")
        else:
            # Generate temporary account for testing
            self.account = Account.create()
            print(f"⚠️  No private key provided - using temporary account: {self.account.address}")
            print(f"   Set HEDERA_PRIVATE_KEY in environment to use your account")
        
        # Setup contracts
        self.synthia_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(self.synthia_address),
            abi=get_synthia_abi()
        )
        
        self.nft_contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(self.nft_address),
            abi=get_nft_abi()
        )
        
        print(f"✅ Contracts loaded:")
        print(f"   - Synthia: {self.synthia_address}")
        print(f"   - NFT: {self.nft_address}")
    
    def setup_protocols(self):
        """Setup blockchain protocols"""
        
        blockchain_protocol = Protocol("BlockchainOperations")
        
        @blockchain_protocol.on_message(model=BlockchainUpdate)
        async def handle_score_update(ctx: Context, sender: str, msg: BlockchainUpdate):
            """Update score on smart contract with MeTTa reasoning"""
            ctx.logger.info(f"⛓️  Updating score for {msg.wallet_address}")
            ctx.logger.info(f"   Score: {msg.score}, Adjustment: {msg.score_adjustment}")
            ctx.logger.info(f"   MeTTa Rules: {msg.metta_rules_applied[:3]}...")  # Show first 3 rules
            
            try:
                # 1. Calculate MeTTa rules hash
                metta_hash = self.hash_metta_rules(msg.metta_rules_applied)
                ctx.logger.info(f"   MeTTa Hash: {metta_hash[:16]}...")
                
                # 2. Update score on chain
                if self.synthia_contract and self.account:
                    tx_hash = await self.update_score_on_chain(
                        msg.wallet_address,
                        msg.score,
                        metta_hash,
                        msg.score_adjustment
                    )
                    ctx.logger.info(f"✅ Score updated on-chain: {tx_hash}")
                    
                    # Get NFT token ID
                    try:
                        token_id = self.nft_contract.functions.getTokenId(
                            Web3.to_checksum_address(msg.wallet_address)
                        ).call()
                        nft_token_id = str(token_id) if token_id > 0 else ""
                        ctx.logger.info(f"   NFT Token ID: {nft_token_id}")
                    except:
                        nft_token_id = ""
                else:
                    # Simulation mode
                    tx_hash = "0x" + hashlib.sha256(
                        f"{msg.wallet_address}{msg.score}{time.time()}".encode()
                    ).hexdigest()
                    nft_token_id = ""
                    ctx.logger.info(f"✅ Score updated (simulated): {tx_hash}")
                
                # 3. Log to HCS
                hcs_sequence = await self.hedera_services.log_analysis_to_hcs(
                    msg.wallet_address, 
                    msg.analysis_data
                )
                ctx.logger.info(f"✅ Logged to HCS: Sequence #{hcs_sequence}")
                
                # 4. Log HCS reference to contract
                if self.synthia_contract and self.account:
                    try:
                        await self.log_hcs_to_contract(msg.wallet_address, hcs_sequence)
                        ctx.logger.info(f"✅ HCS reference logged to contract")
                    except Exception as e:
                        ctx.logger.warning(f"⚠️ HCS logging to contract skipped: {e}")
                
                # 5. Achievement check (for NFT minting)
                if msg.score >= 600:
                    try:
                        nft_serial = await self.hedera_services.mint_reputation_nft(
                            msg.wallet_address,
                            msg.score,
                            msg.analysis_data
                        )
                        ctx.logger.info(f"🏆 Achievement NFT minted: Serial #{nft_serial}")
                    except Exception as e:
                        ctx.logger.warning(f"⚠️ Achievement NFT skipped: {e}")
                
                # 6. Send confirmation
                await ctx.send(sender, BlockchainConfirmation(
                    request_id=msg.request_id,
                    status="success",
                    tx_hash=tx_hash,
                    hcs_sequence=hcs_sequence,
                    contract_address=self.synthia_address,
                    nft_token_id=nft_token_id
                ))
                
            except Exception as e:
                ctx.logger.error(f"❌ Blockchain update failed: {e}")
                await ctx.send(sender, BlockchainConfirmation(
                    request_id=msg.request_id,
                    status="error",
                    error=str(e)
                ))
        
        @blockchain_protocol.on_message(model=BatchUpdateRequest)
        async def handle_batch_update(ctx: Context, sender: str, msg: BatchUpdateRequest):
            """Handle batch score updates for gas optimization"""
            ctx.logger.info(f"⛓️  Processing batch update: {len(msg.updates)} scores")
            
            try:
                if self.synthia_contract and self.account:
                    # Prepare batch data
                    users = []
                    scores = []
                    metta_hashes = []
                    
                    for update in msg.updates[:50]:  # Max 50 per batch
                        users.append(Web3.to_checksum_address(update['wallet']))
                        scores.append(update['score'])
                        metta_hash = self.hash_metta_rules(update.get('metta_rules', []))
                        metta_hashes.append(bytes.fromhex(metta_hash[2:]))
                    
                    # Call batch update
                    tx_hash = await self.batch_update_scores_on_chain(
                        users, scores, metta_hashes
                    )
                    ctx.logger.info(f"✅ Batch update completed: {tx_hash}")
                    
                    # Log each to HCS
                    for update in msg.updates:
                        await self.hedera_services.log_analysis_to_hcs(
                            update['wallet'],
                            update.get('analysis_data', {})
                        )
                else:
                    tx_hash = "0x" + hashlib.sha256(f"batch_{time.time()}".encode()).hexdigest()
                    ctx.logger.info(f"✅ Batch update (simulated): {tx_hash}")
                
                await ctx.send(sender, BlockchainConfirmation(
                    request_id=msg.request_id,
                    status="success",
                    tx_hash=tx_hash,
                    contract_address=self.synthia_address
                ))
                
            except Exception as e:
                ctx.logger.error(f"❌ Batch update failed: {e}")
                await ctx.send(sender, BlockchainConfirmation(
                    request_id=msg.request_id,
                    status="error",
                    error=str(e)
                ))
        
        @blockchain_protocol.on_message(model=AgentRegistrationRequest)
        async def handle_agent_registration(ctx: Context, sender: str, msg: AgentRegistrationRequest):
            """Register new agent with contract (orchestrator only)"""
            ctx.logger.info(f"📝 Registering agent: {msg.agent_address} as {msg.role}")
            
            try:
                if self.synthia_contract and self.account:
                    role_bytes = self.ROLES.get(msg.role.upper())
                    if not role_bytes:
                        raise Exception(f"Invalid role: {msg.role}")
                    
                    tx_hash = await self.register_agent_on_chain(
                        msg.agent_address,
                        role_bytes
                    )
                    ctx.logger.info(f"✅ Agent registered: {tx_hash}")
                else:
                    tx_hash = "0x" + hashlib.sha256(
                        f"register_{msg.agent_address}_{msg.role}".encode()
                    ).hexdigest()
                    ctx.logger.info(f"✅ Agent registered (simulated): {tx_hash}")
                
                await ctx.send(sender, BlockchainConfirmation(
                    request_id=f"reg_{msg.agent_address}",
                    status="success",
                    tx_hash=tx_hash
                ))
                
            except Exception as e:
                ctx.logger.error(f"❌ Agent registration failed: {e}")
        
        # Include the protocol
        self.agent.include(blockchain_protocol, publish_manifest=True)
    
    def hash_metta_rules(self, rules):
        """Create bytes32 hash of MeTTa rules"""
        if isinstance(rules, list):
            rules_str = ",".join(sorted([str(r) for r in rules]))
        else:
            rules_str = str(rules)
        
        hash_bytes = hashlib.sha256(rules_str.encode()).digest()
        return "0x" + hash_bytes.hex()
    
    async def update_score_on_chain(self, user_address: str, score: int, metta_hash: str, score_adjustment: int) -> str:
        """Call smart contract updateScore function"""
        
        if not self.synthia_contract or not self.account:
            raise Exception("Smart contract not available")
        
        # Build transaction
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        # Estimate gas
        try:
            gas_estimate = self.synthia_contract.functions.updateScore(
                Web3.to_checksum_address(user_address),
                score,
                bytes.fromhex(metta_hash[2:]),
                score_adjustment
            ).estimate_gas({'from': self.account.address})
            gas_limit = int(gas_estimate * 1.2)  # Add 20% buffer
        except:
            gas_limit = 500000  # Fallback gas limit
        
        tx = self.synthia_contract.functions.updateScore(
            Web3.to_checksum_address(user_address),
            score,
            bytes.fromhex(metta_hash[2:]),
            score_adjustment
        ).build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': gas_limit,
            'gasPrice': self.w3.eth.gas_price,
            'chainId': 296  # Hedera testnet chain ID
        })
        
        # Sign and send
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # Wait for confirmation
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=30)
        
        if receipt['status'] != 1:
            raise Exception(f"Transaction failed: {receipt}")
        
        return receipt['transactionHash'].hex()
    
    async def batch_update_scores_on_chain(self, users: list, scores: list, metta_hashes: list) -> str:
        """Call smart contract batchUpdateScores function"""
        
        if not self.synthia_contract or not self.account:
            raise Exception("Smart contract not available")
        
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        tx = self.synthia_contract.functions.batchUpdateScores(
            users, scores, metta_hashes
        ).build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 1000000,  # Higher gas for batch
            'gasPrice': self.w3.eth.gas_price,
            'chainId': 296
        })
        
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=30)
        
        if receipt['status'] != 1:
            raise Exception(f"Batch transaction failed: {receipt}")
        
        return receipt['transactionHash'].hex()
    
    async def log_hcs_to_contract(self, wallet_address: str, sequence_num: int):
        """Log HCS sequence to smart contract for reference"""
        
        if not self.synthia_contract or not self.account:
            return None
        
        hcs_message_id = sequence_num.to_bytes(32, byteorder='big')
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        tx = self.synthia_contract.functions.logToHCS(
            Web3.to_checksum_address(wallet_address),
            hcs_message_id
        ).build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 200000,
            'gasPrice': self.w3.eth.gas_price,
            'chainId': 296
        })
        
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        return tx_hash.hex()
    
    async def register_agent_on_chain(self, agent_address: str, role_bytes: str) -> str:
        """Register agent with contract (requires ORCHESTRATOR_ROLE)"""
        
        if not self.synthia_contract or not self.account:
            raise Exception("Smart contract not available")
        
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        tx = self.synthia_contract.functions.registerAgent(
            Web3.to_checksum_address(agent_address),
            bytes.fromhex(role_bytes[2:])
        ).build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 150000,
            'gasPrice': self.w3.eth.gas_price,
            'chainId': 296
        })
        
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=30)
        
        if receipt['status'] != 1:
            raise Exception(f"Registration failed: {receipt}")
        
        return receipt['transactionHash'].hex()
    
    def run(self):
        """Start the blockchain agent"""
        mode = "Production" if self.synthia_contract else "Simulation"
        web3_status = "✅ Web3 Connected" if WEB3_AVAILABLE else "⚠️  Web3 Not Available"
        
        print(f"""
╔═══════════════════════════════════════════════════╗
║       SYNTHIA BLOCKCHAIN AGENT v3.0              ║
║          ETHOnline 2025 Edition                  ║
╚═══════════════════════════════════════════════════╝

🚀 AGENT INITIALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Agent Address: {self.agent.address}
🌐 Port: 8002
⚡ Mode: {mode}
{web3_status}

⛓️  HEDERA BLOCKCHAIN CONFIG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 Network: Hedera Testnet (Chain ID: 296)
📄 Synthia Contract: {self.synthia_address[:8]}...{self.synthia_address[-6:]}
🎨 NFT Contract: {self.nft_address[:8]}...{self.nft_address[-6:]}
👤 Operator: {self.account.address if self.account else 'Not configured'}

📊 HEDERA SERVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 HCS Audit Trail: {self.hedera_services.audit_topic_id if hasattr(self.hedera_services, 'audit_topic_id') else 'Pending'}
🎨 HTS Reputation Token: {self.hedera_services.reputation_token_id if hasattr(self.hedera_services, 'reputation_token_id') else 'Pending'}

🤖 MULTI-AGENT ROLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ORCHESTRATOR: Coordinates analysis
✅ ANALYZER: Performs MeTTa reasoning
✅ BLOCKCHAIN: Writes to Hedera (this agent)
🔜 MARKETPLACE: A2A integration (coming soon)

Ready to write reputation scores to Hedera! ⚡
        """)
        
        self.agent.run()

if __name__ == "__main__":
    blockchain_agent = BlockchainAgent()
    blockchain_agent.run()