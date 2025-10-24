# ORCHESTRATOR - WORKING STORAGE (Synchronous)

from uagents import Context, Protocol, Agent, Model
from typing import Optional, Dict, List
import time
import os

# ============================================
# MESSAGE MODELS
# ============================================

class ScoreRequest(Model):
    wallet_address: str
    request_id: str
    requester: Optional[str] = None

class ScoreAnalysis(Model):
    request_id: str
    wallet_address: str
    score: int
    analyzer_id: str
    transaction_score: int
    defi_score: int
    security_score: int
    social_score: int
    reputation_level: str
    reasoning_explanation: str
    metta_rules_applied: List[str]
    score_adjustments: int
    analysis_data: dict
    timestamp: int

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

class AnalysisComplete(Model):
    request_id: str
    wallet_address: str
    score: int
    reputation_level: str
    reasoning_explanation: str
    transaction_score: int
    defi_score: int
    security_score: int
    social_score: int
    metta_rules_applied: List[str]
    timestamp: int

class BlockchainStatus(Model):
    request_id: str
    wallet_address: str
    status: str
    tx_hash: Optional[str] = None
    error: Optional[str] = None

# ============================================
# CONFIGURATION
# ============================================

ASI_ONE_CHAT = os.getenv("ASI_ONE_CHAT_ADDRESS", "")
WALLET_ANALYZER = os.getenv("WALLET_ANALYZER_ADDRESS", "")
BLOCKCHAIN = os.getenv("BLOCKCHAIN_ADDRESS", "")

# ============================================
# AGENT
# ============================================

agent = Agent(
    name="orchestrator",
    seed="synthia-orchestrator-v1-production-seed"
)

# ============================================
# STORAGE HELPERS (Synchronous)
# ============================================

def store_request(ctx: Context, request_id: str, data: dict):
    """Store request using context storage"""
    key = f"req_{request_id}"
    ctx.storage.set(key, data)
    ctx.logger.info(f"✅ Stored: {key}")

def get_request(ctx: Context, request_id: str) -> Optional[dict]:
    """Get request from context storage"""
    key = f"req_{request_id}"
    data = ctx.storage.get(key)
    if data:
        ctx.logger.info(f"✅ Found: {key}")
    else:
        ctx.logger.error(f"❌ Not found: {key}")
    return data

def delete_request(ctx: Context, request_id: str):
    """Delete request from storage"""
    key = f"req_{request_id}"
    if ctx.storage.get(key):
        ctx.storage.set(key, None)  # Delete by setting to None
        ctx.logger.info(f"✅ Deleted: {key}")

# ============================================
# REQUEST PROTOCOL
# ============================================

request_protocol = Protocol("OrchestratorRequest")

@request_protocol.on_message(model=ScoreRequest)
async def handle_score_request(ctx: Context, sender: str, msg: ScoreRequest):
    """Receive analysis request"""
    
    ctx.logger.info("=" * 70)
    ctx.logger.info(f"📥 NEW REQUEST")
    ctx.logger.info("=" * 70)
    ctx.logger.info(f"Wallet: {msg.wallet_address}")
    ctx.logger.info(f"Request ID: {msg.request_id}")
    ctx.logger.info(f"From: {sender[:40]}...")
    
    # Store request
    request_data = {
        "request_id": msg.request_id,
        "wallet_address": msg.wallet_address,
        "requester_agent": sender,
        "created_at": time.time(),
        "status": "analyzing"
    }
    
    store_request(ctx, msg.request_id, request_data)
    
    ctx.logger.info("=" * 70)
    
    # Send to analyzer
    if WALLET_ANALYZER:
        ctx.logger.info(f"🔀 Routing to analyzer...")
        try:
            await ctx.send(WALLET_ANALYZER, ScoreRequest(
                wallet_address=msg.wallet_address,
                request_id=msg.request_id,
                requester=str(ctx.agent.address)
            ))
            ctx.logger.info(f"✅ Sent to analyzer")
        except Exception as e:
            ctx.logger.error(f"❌ Send failed: {str(e)}")
    else:
        ctx.logger.error("❌ Analyzer not configured!")

@request_protocol.on_message(model=ScoreAnalysis)
async def handle_analysis_result(ctx: Context, sender: str, msg: ScoreAnalysis):
    """Receive analysis - PHASE 1"""
    
    ctx.logger.info("=" * 70)
    ctx.logger.info(f"📊 ANALYSIS RECEIVED")
    ctx.logger.info("=" * 70)
    ctx.logger.info(f"From: {msg.analyzer_id}")
    ctx.logger.info(f"Request ID: {msg.request_id}")
    ctx.logger.info(f"Score: {msg.score}/100")
    
    # Get request
    request_data = get_request(ctx, msg.request_id)
    
    if not request_data:
        ctx.logger.error(f"❌ CRITICAL: Request not in storage!")
        ctx.logger.error(f"   Creating recovery...")
        
        # Recovery
        request_data = {
            "request_id": msg.request_id,
            "wallet_address": msg.wallet_address,
            "requester_agent": ASI_ONE_CHAT,
            "created_at": time.time(),
            "status": "analyzing"
        }
        store_request(ctx, msg.request_id, request_data)
    
    # Update request
    request_data["score"] = msg.score
    request_data["reputation_level"] = msg.reputation_level
    request_data["reasoning"] = msg.reasoning_explanation
    request_data["status"] = "analysis_complete"
    store_request(ctx, msg.request_id, request_data)
    
    ctx.logger.info(f"✅ Score: {msg.score}/100")
    ctx.logger.info("=" * 70)
    
    # PHASE 1: Send to chat
    ctx.logger.info("📤 PHASE 1: Sending to chat...")
    
    if ASI_ONE_CHAT:
        try:
            await ctx.send(ASI_ONE_CHAT, AnalysisComplete(
                request_id=msg.request_id,
                wallet_address=msg.wallet_address,
                score=msg.score,
                reputation_level=msg.reputation_level,
                reasoning_explanation=msg.reasoning_explanation,
                transaction_score=msg.transaction_score,
                defi_score=msg.defi_score,
                security_score=msg.security_score,
                social_score=msg.social_score,
                metta_rules_applied=msg.metta_rules_applied,
                timestamp=int(time.time())
            ))
            ctx.logger.info("✅ PHASE 1 sent!")
        except Exception as e:
            ctx.logger.error(f"❌ Phase 1 failed: {str(e)}")
    
    # PHASE 2: Send to blockchain
    request_data["status"] = "blockchain_pending"
    store_request(ctx, msg.request_id, request_data)
    
    if BLOCKCHAIN:
        ctx.logger.info("📤 PHASE 2: Sending to blockchain...")
        try:
            await ctx.send(BLOCKCHAIN, BlockchainUpdate(
                request_id=msg.request_id,
                wallet_address=msg.wallet_address,
                score=msg.score,
                metta_rules_applied=msg.metta_rules_applied,
                score_adjustment=msg.score_adjustments,
                analysis_data=msg.analysis_data
            ))
            ctx.logger.info("✅ Sent to blockchain")
        except Exception as e:
            ctx.logger.error(f"❌ Blockchain failed: {str(e)}")
            await send_blockchain_status_to_chat(ctx, request_data, "failed", None, str(e))
    else:
        ctx.logger.warning("⚠️ Blockchain not configured")
        await send_blockchain_status_to_chat(ctx, request_data, "failed", None, "Blockchain not configured")

@request_protocol.on_message(model=BlockchainConfirmation)
async def handle_blockchain_confirmation(ctx: Context, sender: str, msg: BlockchainConfirmation):
    """Receive blockchain confirmation - PHASE 2"""
    
    ctx.logger.info("=" * 70)
    ctx.logger.info(f"⛓️ BLOCKCHAIN CONFIRMATION")
    ctx.logger.info("=" * 70)
    ctx.logger.info(f"Request ID: {msg.request_id}")
    ctx.logger.info(f"Status: {msg.status}")
    
    # Get request
    request_data = get_request(ctx, msg.request_id)
    
    if not request_data:
        ctx.logger.error(f"❌ Request not found!")
        return
    
    if msg.status == "success":
        request_data["status"] = "completed"
        request_data["blockchain_tx"] = msg.tx_hash
        store_request(ctx, msg.request_id, request_data)
        
        ctx.logger.info(f"🎉 Completed! TX: {msg.tx_hash}")
        
        await send_blockchain_status_to_chat(ctx, request_data, "success", msg.tx_hash, None)
        
    elif msg.status == "error":
        request_data["status"] = "failed"
        request_data["error"] = msg.error
        store_request(ctx, msg.request_id, request_data)
        
        ctx.logger.error(f"❌ Failed: {msg.error}")
        
        await send_blockchain_status_to_chat(ctx, request_data, "failed", None, msg.error)
    
    ctx.logger.info("=" * 70)

async def send_blockchain_status_to_chat(ctx: Context, request_data: dict, status: str, tx_hash: Optional[str], error: Optional[str]):
    """Send status to chat"""
    
    if not ASI_ONE_CHAT:
        ctx.logger.warning("⚠️ Chat not configured")
        return
    
    ctx.logger.info(f"📤 Sending status ({status})...")
    
    try:
        await ctx.send(ASI_ONE_CHAT, BlockchainStatus(
            request_id=request_data["request_id"],
            wallet_address=request_data["wallet_address"],
            status=status,
            tx_hash=tx_hash,
            error=error
        ))
        ctx.logger.info("✅ Status sent!")
        
        # Cleanup
        delete_request(ctx, request_data["request_id"])
        
    except Exception as e:
        ctx.logger.error(f"❌ Status send failed: {str(e)}")

# ============================================
# HEALTH
# ============================================

@agent.on_interval(period=60.0)
async def health_check(ctx: Context):
    ctx.logger.info(f"""
📊 Health:
   Chat: {'✅' if ASI_ONE_CHAT else '❌'}
   Analyzer: {'✅' if WALLET_ANALYZER else '❌'}
   Blockchain: {'✅' if BLOCKCHAIN else '❌'}
    """)

# ============================================
# STARTUP
# ============================================

@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info("=" * 70)
    ctx.logger.info("🚀 ORCHESTRATOR (SYNC STORAGE)")
    ctx.logger.info("=" * 70)
    ctx.logger.info(f"Address: {ctx.agent.address}")
    ctx.logger.info("")
    ctx.logger.info("ADDRESSES:")
    ctx.logger.info(f"Chat: {ASI_ONE_CHAT[:40] if ASI_ONE_CHAT else '❌'}")
    ctx.logger.info(f"Analyzer: {WALLET_ANALYZER[:40] if WALLET_ANALYZER else '❌'}")
    ctx.logger.info(f"Blockchain: {BLOCKCHAIN[:40] if BLOCKCHAIN else '❌'}")
    ctx.logger.info("=" * 70)

# ============================================
# INCLUDE
# ============================================

agent.include(request_protocol, publish_manifest=True)