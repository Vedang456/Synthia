# BLOCKCHAIN AGENT - Two-Phase System with Detailed Error Reporting

from uagents import Agent, Context, Protocol, Model
from typing import Optional, List
import os
import json
from web3 import Web3
from eth_account import Account
import time

# ============================================
# MESSAGE MODELS
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
# CONFIGURATION
# ============================================

ORCHESTRATOR_ADDRESS = os.getenv("ORCHESTRATOR_ADDRESS", "")
SYNTHIA_CONTRACT_ADDRESS = os.getenv("SYNTHIA_CONTRACT_ADDRESS", "")
BLOCKCHAIN_EVM_PRIVATE_KEY = os.getenv("BLOCKCHAIN_EVM_PRIVATE_KEY", "")
RPC_URL = os.getenv("RPC_URL", "https://testnet.hashio.io/api")
HCS_AUDIT_TOPIC_ID = os.getenv("HCS_AUDIT_TOPIC_ID", "")

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

# Load EVM account
if BLOCKCHAIN_EVM_PRIVATE_KEY:
    evm_account = Account.from_key(BLOCKCHAIN_EVM_PRIVATE_KEY)
    print(f"✅ Blockchain Agent EVM Address: {evm_account.address}")
else:
    evm_account = None
    print("⚠️ No EVM private key configured")

# Contract ABI with hasRole
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
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "role", "type": "bytes32"},
            {"internalType": "address", "name": "account", "type": "address"}
        ],
        "name": "hasRole",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }
]

ANALYZER_ROLE = "0x6d8b58e8ac4e6e69a91e7d344dd37ffeef065ce7e2b5428efca0ffc57aac9667"

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
    
    ctx.logger.info("=" * 70)
    ctx.logger.info(f"📥 Received blockchain update")
    ctx.logger.info(f"   Wallet: {msg.wallet_address}")
    ctx.logger.info(f"   Score: {msg.score}/100")
    ctx.logger.info(f"   Request ID: {msg.request_id}")
    
    # Validate configuration
    if not evm_account:
        error_msg = "EVM account not configured"
        ctx.logger.error(f"❌ {error_msg}")
        await send_error(ctx, msg.request_id, error_msg)
        return
    
    if not synthia_contract:
        error_msg = "Contract not configured"
        ctx.logger.error(f"❌ {error_msg}")
        await send_error(ctx, msg.request_id, error_msg)
        return
    
    try:
        # Check ANALYZER_ROLE
        ctx.logger.info("🔐 Checking ANALYZER_ROLE...")
        
        try:
            has_role = synthia_contract.functions.hasRole(
                bytes.fromhex(ANALYZER_ROLE[2:]),
                Web3.to_checksum_address(evm_account.address)
            ).call()
            
            ctx.logger.info(f"   Has Role: {has_role}")
            
            if not has_role:
                error_msg = "Agent missing ANALYZER_ROLE. Please grant role in contract: registerAgent(0x509773c61012620fCBb8bED0BccAE44f1A93AD0C, 0x7804d923f43a17d325d77e781528e0793b2edd9890ab45fc64efd7b4b427744c)"
                
                ctx.logger.error("")
                ctx.logger.error("=" * 70)
                ctx.logger.error("❌ MISSING ANALYZER_ROLE!")
                ctx.logger.error("=" * 70)
                ctx.logger.error(f"Contract: {SYNTHIA_CONTRACT_ADDRESS}")
                ctx.logger.error(f"Agent: {evm_account.address}")
                ctx.logger.error("")
                ctx.logger.error("GO TO:")
                ctx.logger.error(f"https://hashscan.io/testnet/contract/{SYNTHIA_CONTRACT_ADDRESS}")
                ctx.logger.error("")
                ctx.logger.error("CALL: registerAgent()")
                ctx.logger.error(f"  agent: {evm_account.address}")
                ctx.logger.error(f"  role: {ANALYZER_ROLE}")
                ctx.logger.error("=" * 70)
                
                await send_error(ctx, msg.request_id, error_msg)
                return
            
            ctx.logger.info("   ✅ Role verified!")
            
        except Exception as role_error:
            ctx.logger.warning(f"   Could not verify role: {role_error}")
            ctx.logger.warning("   Attempting transaction anyway...")
        
        # Build transaction
        ctx.logger.info("📝 Writing to Synthia contract...")
        
        metta_rules_hash = Web3.keccak(
            text=",".join(msg.metta_rules_applied)
        ) if msg.metta_rules_applied else Web3.keccak(text="default")
        
        ctx.logger.info(f"   User: {msg.wallet_address}")
        ctx.logger.info(f"   Score: {msg.score}")
        ctx.logger.info(f"   Adjustment: {msg.score_adjustment}")
        
        nonce = w3.eth.get_transaction_count(evm_account.address)
        gas_price = w3.eth.gas_price
        
        tx = synthia_contract.functions.updateScore(
            Web3.to_checksum_address(msg.wallet_address),
            msg.score,
            metta_rules_hash,
            msg.score_adjustment
        ).build_transaction({
            'from': evm_account.address,
            'nonce': nonce,
            'gas': 500000,
            'gasPrice': gas_price,
            'chainId': 296
        })
        
        ctx.logger.info("   ✅ Transaction built")
        
        # Sign
        signed_tx = evm_account.sign_transaction(tx)
        ctx.logger.info("   ✅ Transaction signed")
        
        # Send
        ctx.logger.info("📤 Sending transaction...")
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        tx_hash_hex = tx_hash.hex()
        
        ctx.logger.info(f"   TX Hash: {tx_hash_hex}")
        ctx.logger.info(f"   https://hashscan.io/testnet/transaction/{tx_hash_hex}")
        
        # Wait for receipt
        ctx.logger.info("⏳ Waiting for confirmation...")
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        
        ctx.logger.info(f"   Status: {tx_receipt['status']}")
        ctx.logger.info(f"   Gas Used: {tx_receipt['gasUsed']}")
        
        if tx_receipt['status'] == 1:
            # SUCCESS!
            ctx.logger.info("")
            ctx.logger.info("=" * 70)
            ctx.logger.info("🎉 TRANSACTION SUCCESSFUL!")
            ctx.logger.info("=" * 70)
            ctx.logger.info(f"TX: {tx_hash_hex}")
            ctx.logger.info(f"Block: {tx_receipt['blockNumber']}")
            ctx.logger.info("=" * 70)
            
            # HCS submission
            hcs_sequence = None
            if HCS_AUDIT_TOPIC_ID:
                hcs_sequence = await submit_to_hcs(ctx, msg)
            
            # Send success confirmation
            confirmation = BlockchainConfirmation(
                request_id=msg.request_id,
                status="success",
                tx_hash=tx_hash_hex,
                hcs_sequence=hcs_sequence,
                contract_address=SYNTHIA_CONTRACT_ADDRESS,
                nft_token_id=str(msg.wallet_address),
                error=None
            )
            
            await ctx.send(ORCHESTRATOR_ADDRESS, confirmation)
            ctx.logger.info("✅ Success confirmation sent")
            
        else:
            # FAILED!
            ctx.logger.error("")
            ctx.logger.error("=" * 70)
            ctx.logger.error("❌ TRANSACTION FAILED (Status: 0)")
            ctx.logger.error("=" * 70)
            ctx.logger.error(f"TX: {tx_hash_hex}")
            
            # Get revert reason
            error_message = "Transaction reverted"
            
            try:
                w3.eth.call({
                    'from': evm_account.address,
                    'to': tx['to'],
                    'data': tx['data']
                }, tx_receipt['blockNumber'] - 1)
            except Exception as revert_error:
                error_str = str(revert_error)
                ctx.logger.error(f"Revert: {error_str}")
                
                if "AccessControl" in error_str or "missing role" in error_str.lower():
                    error_message = "Access denied - Agent needs ANALYZER_ROLE. Grant role using: registerAgent(0x509773c61012620fCBb8bED0BccAE44f1A93AD0C, 0x7804d923f43a17d325d77e781528e0793b2edd9890ab45fc64efd7b4b427744c)"
                elif "Invalid score" in error_str:
                    error_message = "Invalid score value sent to contract"
                else:
                    error_message = f"Contract rejected transaction: {error_str[:100]}"
            
            ctx.logger.error("=" * 70)
            
            await send_error(ctx, msg.request_id, error_message)
            
    except Exception as e:
        ctx.logger.error("=" * 70)
        ctx.logger.error(f"❌ UNEXPECTED ERROR")
        ctx.logger.error("=" * 70)
        ctx.logger.error(f"Error: {str(e)}")
        ctx.logger.error(f"Type: {type(e).__name__}")
        ctx.logger.error("=" * 70)
        
        await send_error(ctx, msg.request_id, str(e))

async def submit_to_hcs(ctx: Context, msg: BlockchainUpdate) -> Optional[int]:
    """Submit audit log to HCS"""
    try:
        ctx.logger.info("📝 Submitting to HCS...")
        
        audit_data = {
            "wallet": msg.wallet_address,
            "score": msg.score,
            "timestamp": int(time.time()),
            "rules": msg.metta_rules_applied
        }
        
        ctx.logger.info(f"   HCS Data: {json.dumps(audit_data)}")
        
        return int(time.time())
        
    except Exception as e:
        ctx.logger.error(f"⚠️ HCS submission failed: {str(e)}")
        return None

async def send_error(ctx: Context, request_id: str, error_msg: str):
    """Send error confirmation"""
    confirmation = BlockchainConfirmation(
        request_id=request_id,
        status="error",
        error=error_msg
    )
    await ctx.send(ORCHESTRATOR_ADDRESS, confirmation)
    ctx.logger.info("📤 Error confirmation sent")

# ============================================
# HEALTH CHECK
# ============================================

@agent.on_interval(period=60.0)
async def health_check(ctx: Context):
    """Periodic health check"""
    
    connected = w3.is_connected() if w3 else False
    has_account = evm_account is not None
    has_contract = synthia_contract is not None
    
    status = "🟢" if (connected and has_account and has_contract) else "🔴"
    
    ctx.logger.info(f"""
{status} Blockchain Agent Health:
   RPC: {connected}
   Account: {evm_account.address if has_account else 'NOT SET'}
   Contract: {SYNTHIA_CONTRACT_ADDRESS if has_contract else 'NOT SET'}
    """)
    
    # Check role
    if connected and has_account and has_contract:
        try:
            has_role = synthia_contract.functions.hasRole(
                bytes.fromhex(ANALYZER_ROLE[2:]),
                Web3.to_checksum_address(evm_account.address)
            ).call()
            
            if has_role:
                ctx.logger.info(f"   ANALYZER_ROLE: ✅ GRANTED")
            else:
                ctx.logger.warning(f"   ANALYZER_ROLE: ❌ NOT GRANTED - Transactions will fail!")
                ctx.logger.warning(f"   Grant role at: https://hashscan.io/testnet/contract/{SYNTHIA_CONTRACT_ADDRESS}")
        except:
            pass

# ============================================
# STARTUP
# ============================================

@agent.on_event("startup")
async def startup(ctx: Context):
    """Startup handler"""
    ctx.logger.info("=" * 70)
    ctx.logger.info("🤖 BLOCKCHAIN AGENT STARTING (Two-Phase)")
    ctx.logger.info("=" * 70)
    ctx.logger.info(f"Agent: {ctx.agent.address}")
    
    if evm_account:
        ctx.logger.info(f"EVM Account: {evm_account.address}")
        
        if w3.is_connected():
            balance = w3.eth.get_balance(evm_account.address)
            ctx.logger.info(f"Balance: {w3.from_wei(balance, 'ether')} HBAR")
    
    if synthia_contract:
        ctx.logger.info(f"Contract: {SYNTHIA_CONTRACT_ADDRESS}")
    
    ctx.logger.info("=" * 70)

# ============================================
# INCLUDE PROTOCOLS
# ============================================

agent.include(blockchain_protocol, publish_manifest=True)