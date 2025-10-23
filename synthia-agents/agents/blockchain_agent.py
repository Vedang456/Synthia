from uagents import Agent, Context, Protocol, Model
from typing import Optional, List
import os
import json
from web3 import Web3
from eth_account import Account
import time

# ============================================
# MESSAGE MODELS (Inline for Agentverse)
# ============================================

class BlockchainUpdate(Model):
    request_id: str
    wallet_address: str
    score: int
    metta_rules_applied: List[str]
    score_adjustment: int
    analysis_data: dict

class BlockchainConfirmation(Model):
    request_id: str
    status: str
    tx_hash: Optional[str] = None
    hcs_sequence: Optional[int] = None
    contract_address: Optional[str] = None
    nft_token_id: Optional[str] = None
    error: Optional[str] = None

# ============================================
# CONFIGURATION FROM SECRETS
# ============================================

ORCHESTRATOR_ADDRESS = os.getenv("ORCHESTRATOR_ADDRESS", "")
SYNTHIA_CONTRACT_ADDRESS = os.getenv("SYNTHIA_CONTRACT_ADDRESS", "")
NFT_CONTRACT_ADDRESS = os.getenv("NFT_CONTRACT_ADDRESS", "")
HEDERA_ACCOUNT_ID = os.getenv("HEDERA_ACCOUNT_ID", "")
HCS_AUDIT_TOPIC_ID = os.getenv("HCS_AUDIT_TOPIC_ID", "")
HTS_REPUTATION_TOKEN_ID = os.getenv("HTS_REPUTATION_TOKEN_ID", "")
BLOCKCHAIN_EVM_PRIVATE_KEY = os.getenv("BLOCKCHAIN_EVM_PRIVATE_KEY", "")
RPC_URL = os.getenv("RPC_URL", "https://testnet.hashio.io/api")




agent = Agent(
    name="blockchain_agent",
    seed="nk4ZGCuw23caNWwAYwPheCkAMHPgYHdtngFXW451xtU",
    port=8003,
    endpoint=["http://localhost:8003/submit"]
)


# ============================================
# WEB3 SETUP
# ============================================

w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Load EVM account from private key
if BLOCKCHAIN_EVM_PRIVATE_KEY:
    evm_account = Account.from_key(BLOCKCHAIN_EVM_PRIVATE_KEY)
    print(f"✅ Blockchain Agent EVM Address: {evm_account.address}")
else:
    evm_account = None
    print("⚠️ No EVM private key configured")

# Synthia Contract ABI (minimal - only what we need)
SYNTHIA_ABI = [
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
    }
]

# Contract instance
if SYNTHIA_CONTRACT_ADDRESS and w3.is_connected():
    synthia_contract = w3.eth.contract(
        address=Web3.to_checksum_address(SYNTHIA_CONTRACT_ADDRESS),
        abi=SYNTHIA_ABI
    )
else:
    synthia_contract = None


# ============================================
# BLOCKCHAIN PROTOCOL
# ============================================

blockchain_protocol = Protocol("BlockchainWriter")

@blockchain_protocol.on_message(model=BlockchainUpdate)
async def handle_blockchain_update(ctx: Context, sender: str, msg: BlockchainUpdate):
    """Receive analysis and write to Hedera blockchain"""
    
    ctx.logger.info(f"📥 Received blockchain update for {msg.wallet_address}")
    ctx.logger.info(f"   Score: {msg.score}/1000")
    
    # Validate configuration
    if not evm_account:
        ctx.logger.error("❌ No EVM account configured")
        await send_error(ctx, sender, msg.request_id, "No EVM account")
        return
    
    if not synthia_contract:
        ctx.logger.error("❌ Contract not configured")
        await send_error(ctx, sender, msg.request_id, "Contract not configured")
        return
    
    try:
        # ============================================
        # 1. WRITE TO SMART CONTRACT
        # ============================================
        ctx.logger.info("📝 Writing to Synthia contract...")
        
        # Create MeTTa rules hash
        metta_rules_hash = Web3.keccak(
            text=",".join(msg.metta_rules_applied)
        ) if msg.metta_rules_applied else Web3.keccak(text="default")
        
        # Build transaction
        tx = synthia_contract.functions.updateScore(
            Web3.to_checksum_address(msg.wallet_address),
            msg.score,
            metta_rules_hash,
            msg.score_adjustment
        ).build_transaction({
            'from': evm_account.address,
            'nonce': w3.eth.get_transaction_count(evm_account.address),
            'gas': 500000,
            'gasPrice': w3.eth.gas_price,
            'chainId': 296  # Hedera testnet
        })
        
        # Sign transaction
        signed_tx = evm_account.sign_transaction(tx)
        
        # Send transaction
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        ctx.logger.info(f"   Transaction sent: {tx_hash.hex()}")
        
        # Wait for receipt
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        
        if tx_receipt['status'] == 1:
            ctx.logger.info(f"✅ Contract updated successfully!")
            ctx.logger.info(f"   TX: {tx_hash.hex()}")
            
            # ============================================
            # 2. SUBMIT TO HCS (Optional)
            # ============================================
            hcs_sequence = None
            if HCS_AUDIT_TOPIC_ID:
                hcs_sequence = await submit_to_hcs(ctx, msg)
            
            # ============================================
            # 3. SEND CONFIRMATION TO ORCHESTRATOR
            # ============================================
            confirmation = BlockchainConfirmation(
                request_id=msg.request_id,
                status="success",
                tx_hash=tx_hash.hex(),
                hcs_sequence=hcs_sequence,
                contract_address=SYNTHIA_CONTRACT_ADDRESS,
                nft_token_id=str(msg.wallet_address),  # Simplified
                error=None
            )
            
            await ctx.send(ORCHESTRATOR_ADDRESS, confirmation)
            ctx.logger.info("✅ Confirmation sent to orchestrator")
            
        else:
            ctx.logger.error("❌ Transaction failed")
            await send_error(ctx, sender, msg.request_id, "Transaction failed")
            
    except Exception as e:
        ctx.logger.error(f"❌ Error: {str(e)}")
        await send_error(ctx, sender, msg.request_id, str(e))

async def submit_to_hcs(ctx: Context, msg: BlockchainUpdate) -> Optional[int]:
    """Submit audit log to HCS (placeholder for now)"""
    try:
        ctx.logger.info("📝 Submitting to HCS...")
        
        # TODO: Implement actual HCS submission using Hedera SDK
        # For now, just log it
        audit_data = {
            "wallet": msg.wallet_address,
            "score": msg.score,
            "timestamp": int(time.time()),
            "rules": msg.metta_rules_applied
        }
        
        ctx.logger.info(f"   HCS Data: {json.dumps(audit_data)}")
        
        # Return mock sequence number
        return int(time.time())
        
    except Exception as e:
        ctx.logger.error(f"⚠️ HCS submission failed: {str(e)}")
        return None

async def send_error(ctx: Context, sender: str, request_id: str, error_msg: str):
    """Send error confirmation"""
    confirmation = BlockchainConfirmation(
        request_id=request_id,
        status="error",
        error=error_msg
    )
    await ctx.send(sender, confirmation)

# ============================================
# HEALTH CHECK
# ============================================

health_protocol = Protocol("BlockchainHealth")

@health_protocol.on_interval(period=60.0)
async def health_check(ctx: Context):
    """Periodic health check"""
    
    connected = w3.is_connected() if w3 else False
    has_account = evm_account is not None
    has_contract = synthia_contract is not None
    
    ctx.logger.info(f"""
📊 Blockchain Agent Health:
   RPC Connected: {connected}
   EVM Account: {has_account}
   Contract Loaded: {has_contract}
   Address: {evm_account.address if has_account else 'None'}
    """)

# ============================================
# INCLUDE PROTOCOLS
# ============================================

agent.include(blockchain_protocol, publish_manifest=True)
agent.include(health_protocol, publish_manifest=False)