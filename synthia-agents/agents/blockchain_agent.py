from uagents import Agent, Context, Model, Protocol
from web3 import Web3
from eth_account import Account
import json
import os
import hashlib
import time

# Import Hedera services
from hedera_services_integration import HederaServicesIntegration

# Import message models
from protocols.messages import BlockchainUpdate, BlockchainConfirmation

# Load contract ABIs
with open('artifacts/contracts/Synthia.sol/Synthia.json', 'r') as f:
    SYNTHIA_ABI = json.load(f)['abi']

class BlockchainAgent:
    """Enhanced blockchain agent with HCS logging and multi-role support"""
    
    def __init__(self):
        self.agent = Agent(
            name="synthia_blockchain_agent",
            seed=os.getenv("BLOCKCHAIN_SEED"),
            mailbox=f"{os.getenv('BLOCKCHAIN_MAILBOX_KEY')}@https://agentverse.ai",
            port=8002
        )
        
        # Hedera connection (EVM-compatible endpoint)
        self.w3 = Web3(Web3.HTTPProvider('https://testnet.hashio.io/api'))
        self.account = Account.from_key(os.getenv('HEDERA_PRIVATE_KEY'))
        
        # Contract setup
        self.synthia_address = os.getenv('SYNTHIA_CONTRACT_ADDRESS')
        self.synthia_contract = self.w3.eth.contract(
            address=self.synthia_address,
            abi=SYNTHIA_ABI
        )
        
        # Initialize Hedera services
        self.hedera_services = HederaServicesIntegration()
        
        self.setup_protocols()
    
    def setup_protocols(self):
        """Setup blockchain protocols"""
        
        blockchain_protocol = Protocol("BlockchainOperations")
        
        @blockchain_protocol.on_message(model=BlockchainUpdate)
        async def handle_score_update(ctx: Context, sender: str, msg: BlockchainUpdate):
            """Update score on smart contract with MeTTa reasoning"""
            ctx.logger.info(f"⛓️  Updating score for {msg.wallet_address}")
            
            try:
                # 1. Calculate MeTTa rules hash
                metta_hash = self.hash_metta_rules(msg.metta_rules_applied)
                
                # 2. Call smart contract
                tx_hash = await self.update_score_on_chain(
                    msg.wallet_address,
                    msg.score,
                    metta_hash,
                    msg.score_adjustment
                )
                
                ctx.logger.info(f"✅ Score updated: {tx_hash}")
                
                # 3. Log to HCS using hedera_services
                hcs_sequence = await self.hedera_services.log_analysis_to_hcs(
                    msg.wallet_address, 
                    msg.analysis_data
                )
                ctx.logger.info(f"✅ Logged to HCS: Sequence #{hcs_sequence}")
                
                # 4. Mint HTS NFT (optional, for bonus points)
                try:
                    nft_serial = await self.hedera_services.mint_reputation_nft(
                        msg.wallet_address,
                        msg.score,
                        msg.analysis_data
                    )
                    ctx.logger.info(f"✅ Minted NFT: Serial #{nft_serial}")
                except Exception as nft_error:
                    ctx.logger.warning(f"⚠️ NFT minting skipped: {nft_error}")
                
                # 5. Log HCS to contract
                await self.log_hcs_to_contract(msg.wallet_address, hcs_sequence)
                
                # 6. Send confirmation back to orchestrator
                await ctx.send(sender, BlockchainConfirmation(
                    request_id=msg.request_id,
                    status="success",
                    tx_hash=tx_hash,
                    hcs_sequence=hcs_sequence,
                    contract_address=self.synthia_address
                ))
                
            except Exception as e:
                ctx.logger.error(f"❌ Blockchain update failed: {e}")
                await ctx.send(sender, BlockchainConfirmation(
                    request_id=msg.request_id,
                    status="error",
                    error=str(e)
                ))
        
        self.agent.include(blockchain_protocol)
    
    def hash_metta_rules(self, rules: list[str]) -> str:
        """Create bytes32 hash of MeTTa rules"""
        rules_str = ",".join(sorted(rules))
        hash_bytes = hashlib.sha256(rules_str.encode()).digest()
        return "0x" + hash_bytes.hex()
    
    async def update_score_on_chain(
        self,
        user_address: str,
        score: int,
        metta_hash: str,
        score_adjustment: int
    ) -> str:
        """Call smart contract updateScore function"""
        
        # Build transaction
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        tx = self.synthia_contract.functions.updateScore(
            Web3.to_checksum_address(user_address),
            score,
            bytes.fromhex(metta_hash[2:]),  # Remove 0x prefix
            score_adjustment
        ).build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 500000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        # Sign and send
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # Wait for confirmation
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return receipt['transactionHash'].hex()
    
    async def log_hcs_to_contract(self, wallet_address: str, sequence_num: int):
        """Log HCS sequence to smart contract for reference"""
        
        # Convert sequence number to bytes32
        hcs_message_id = sequence_num.to_bytes(32, byteorder='big')
        
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        tx = self.synthia_contract.functions.logToHCS(
            Web3.to_checksum_address(wallet_address),
            hcs_message_id
        ).build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 200000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # Don't wait for this one, it's just logging
        return tx_hash.hex()
    
    def run(self):
        """Start the blockchain agent"""
        print(f"""
🚀 BLOCKCHAIN AGENT STARTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Address: {self.agent.address}
🌐 Port: 8002
⛓️ Contract: {self.synthia_address[:10]}...
🔗 Hedera: testnet.hashio.io

Ready to write to blockchain! ⚡
        """)
        self.agent.run()

if __name__ == "__main__":
    blockchain_agent = BlockchainAgent()
    blockchain_agent.run()