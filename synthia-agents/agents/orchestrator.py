from uagents import Context, Protocol, Agent, Model
from typing import Optional, Dict, List
import time
import asyncio
from dataclasses import dataclass, field
from enum import Enum
import os

# ============================================
# MESSAGE MODELS (Inline for Agentverse)
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

class FinalResult(Model):
    request_id: str
    wallet_address: str
    score: int
    reputation_level: str
    reasoning_explanation: str
    tx_hash: str
    nft_token_id: Optional[str] = None
    hcs_sequence: Optional[int] = None
    timestamp: int
    transaction_score: Optional[int] = None
    defi_score: Optional[int] = None
    security_score: Optional[int] = None
    social_score: Optional[int] = None

# ============================================
# REQUEST TRACKING
# ============================================

class RequestStatus(Enum):
    PENDING = "pending"
    ANALYZING = "analyzing"
    COMPLETED = "completed"
    FAILED = "failed"

@dataclass
class RequestTracker:
    request_id: str
    wallet_address: str
    status: RequestStatus
    created_at: float
    requester_agent: Optional[str] = None
    analyzer_results: Dict = field(default_factory=dict)
    final_score: Optional[int] = None
    metta_reasoning: Optional[str] = None
    blockchain_tx: Optional[str] = None
    error: Optional[str] = None

# ============================================
# GLOBAL STATE
# ============================================

active_requests: Dict[str, RequestTracker] = {}
total_requests = 0
successful_analyses = 0
failed_analyses = 0

# Agent addresses from secrets
ASI_ONE_CHAT = os.getenv("ASI_ONE_CHAT_ADDRESS", "")
WALLET_ANALYZER = os.getenv("WALLET_ANALYZER_ADDRESS", "")
BLOCKCHAIN = os.getenv("BLOCKCHAIN_ADDRESS", "")

# ============================================
# AGENT SETUP
# ============================================

agent = Agent(
    name="orchestrator",
    seed="synthia-orchestrator-v1-production-seed"
)

# ============================================
# REQUEST PROTOCOL
# ============================================

request_protocol = Protocol("OrchestratorRequest")

@request_protocol.on_message(model=ScoreRequest)
async def handle_score_request(ctx: Context, sender: str, msg: ScoreRequest):
    """Receive analysis request and coordinate workflow"""
    global active_requests, total_requests
    
    ctx.logger.info(f"📥 Request: {msg.wallet_address}")
    ctx.logger.info(f"   Request ID: {msg.request_id}")
    ctx.logger.info(f"   From: {sender[:40]}...")
    
    # Track request - STORE IT BEFORE SENDING
    tracker = RequestTracker(
        request_id=msg.request_id,
        wallet_address=msg.wallet_address,
        status=RequestStatus.ANALYZING,
        created_at=time.time(),
        requester_agent=sender
    )
    active_requests[msg.request_id] = tracker
    total_requests += 1
    
    ctx.logger.info(f"✅ Request stored: {msg.request_id}")
    ctx.logger.info(f"🔀 Routing to analyzer...")
    
    if WALLET_ANALYZER:
        try:
            await ctx.send(WALLET_ANALYZER, ScoreRequest(
                wallet_address=msg.wallet_address,
                request_id=msg.request_id,
                requester=str(ctx.agent.address)
            ))
            ctx.logger.info(f"✅ Sent to analyzer: {WALLET_ANALYZER[:20]}...")
        except Exception as e:
            ctx.logger.error(f"❌ Failed to send to analyzer: {str(e)}")
    else:
        ctx.logger.error("❌ Wallet analyzer not configured!")

@request_protocol.on_message(model=ScoreAnalysis)
async def handle_analysis_result(ctx: Context, sender: str, msg: ScoreAnalysis):
    """Receive analysis from analyzer agents"""
    global active_requests
    
    ctx.logger.info(f"📊 Analysis from {msg.analyzer_id}")
    ctx.logger.info(f"   Request ID: {msg.request_id}")
    ctx.logger.info(f"   Score: {msg.score}/1000")
    
    # Check if we have this request
    tracker = active_requests.get(msg.request_id)
    if not tracker:
        ctx.logger.warning(f"⚠️ Unknown request: {msg.request_id}")
        ctx.logger.warning(f"   Active requests: {list(active_requests.keys())}")
        
        # CREATE tracker if missing (recovery mechanism)
        ctx.logger.info(f"🔧 Creating tracker for orphaned request")
        tracker = RequestTracker(
            request_id=msg.request_id,
            wallet_address=msg.wallet_address,
            status=RequestStatus.ANALYZING,
            created_at=time.time(),
            requester_agent=ASI_ONE_CHAT  # Default to chat agent
        )
        active_requests[msg.request_id] = tracker
    
    # Store analyzer result
    tracker.analyzer_results[msg.analyzer_id] = msg
    tracker.final_score = msg.score
    tracker.metta_reasoning = msg.reasoning_explanation
    
    ctx.logger.info(f"✅ Score stored: {tracker.final_score}/1000")
    
    # Send to blockchain agent
    if BLOCKCHAIN:
        ctx.logger.info(f"📤 Sending to blockchain agent...")
        try:
            await ctx.send(BLOCKCHAIN, BlockchainUpdate(
                request_id=msg.request_id,
                wallet_address=tracker.wallet_address,
                score=msg.score,
                metta_rules_applied=msg.metta_rules_applied,
                score_adjustment=msg.score_adjustments,
                analysis_data=msg.analysis_data
            ))
            ctx.logger.info(f"✅ Sent to blockchain: {BLOCKCHAIN[:20]}...")
        except Exception as e:
            ctx.logger.error(f"❌ Failed to send to blockchain: {str(e)}")
    else:
        ctx.logger.warning("⚠️ Blockchain not configured - skipping on-chain write")
        # Still send result back to chat agent
        await send_final_result_to_chat(ctx, tracker, msg, "0x0000000000000000000000000000000000000000")

@request_protocol.on_message(model=BlockchainConfirmation)
async def handle_blockchain_confirmation(ctx: Context, sender: str, msg: BlockchainConfirmation):
    """Receive confirmation from blockchain agent"""
    global active_requests, successful_analyses, failed_analyses
    
    ctx.logger.info(f"⛓️ Blockchain confirmation received")
    ctx.logger.info(f"   Request ID: {msg.request_id}")
    ctx.logger.info(f"   Status: {msg.status}")
    
    if msg.status == "success":
        request_id = msg.request_id
        tracker = active_requests.get(request_id)
        
        if not tracker:
            ctx.logger.warning(f"⚠️ Unknown request in confirmation: {request_id}")
            return
        
        tracker.status = RequestStatus.COMPLETED
        tracker.blockchain_tx = msg.tx_hash
        successful_analyses += 1
        
        # Get analysis data
        analysis_key = list(tracker.analyzer_results.keys())[0] if tracker.analyzer_results else None
        analysis = tracker.analyzer_results.get(analysis_key) if analysis_key else None
        
        ctx.logger.info(f"🎉 Request {request_id} completed!")
        ctx.logger.info(f"   Score: {tracker.final_score}/1000")
        ctx.logger.info(f"   TX: {tracker.blockchain_tx}")
        
        # Send FinalResult back to chat agent
        await send_final_result_to_chat(ctx, tracker, analysis, msg.tx_hash or "0x0")
        
    elif msg.status == "error":
        failed_analyses += 1
        ctx.logger.error(f"❌ Blockchain failed: {msg.error}")

async def send_final_result_to_chat(ctx: Context, tracker: RequestTracker, analysis, tx_hash: str):
    """Send final result back to chat agent"""
    if tracker.requester_agent and ASI_ONE_CHAT:
        ctx.logger.info(f"📤 Sending final result to chat agent...")
        
        final_result = FinalResult(
            request_id=tracker.request_id,
            wallet_address=tracker.wallet_address,
            score=tracker.final_score or 0,
            reputation_level=analysis.reputation_level if analysis else "Unknown",
            reasoning_explanation=tracker.metta_reasoning if tracker.metta_reasoning else "Analysis completed",
            tx_hash=tx_hash,
            nft_token_id=None,
            hcs_sequence=None,
            timestamp=int(time.time()),
            transaction_score=analysis.transaction_score if analysis else None,
            defi_score=analysis.defi_score if analysis else None,
            security_score=analysis.security_score if analysis else None,
            social_score=analysis.social_score if analysis else None
        )
        
        try:
            await ctx.send(ASI_ONE_CHAT, final_result)
            ctx.logger.info(f"✅ Sent FinalResult to chat!")
        except Exception as e:
            ctx.logger.error(f"❌ Failed to send to chat: {str(e)}")

# ============================================
# HEALTH PROTOCOL
# ============================================

health_protocol = Protocol("OrchestratorHealth")

@health_protocol.on_interval(period=60.0)
async def health_check(ctx: Context):
    """Periodic health monitoring"""
    global active_requests, total_requests, successful_analyses, failed_analyses
    
    active_count = len(active_requests)
    success_rate = (successful_analyses / total_requests * 100) if total_requests > 0 else 0
    
    ctx.logger.info(f"""
📊 Health:
   Active: {active_count}
   Total: {total_requests}
   Success: {success_rate:.1f}%
   Failed: {failed_analyses}
    """)
    
    if active_count > 0:
        ctx.logger.info(f"   Active request IDs: {list(active_requests.keys())[:3]}")

# ============================================
# STARTUP
# ============================================

@agent.on_event("startup")
async def startup(ctx: Context):
    """Startup handler"""
    ctx.logger.info(f"🚀 Orchestrator Starting...")
    ctx.logger.info(f"   My Address: {ctx.agent.address}")
    ctx.logger.info(f"=" * 50)
    ctx.logger.info(f"CONFIGURED ADDRESSES:")
    ctx.logger.info(f"   Chat: {ASI_ONE_CHAT[:40] if ASI_ONE_CHAT else '❌ NOT SET'}")
    ctx.logger.info(f"   Analyzer: {WALLET_ANALYZER[:40] if WALLET_ANALYZER else '❌ NOT SET'}")
    ctx.logger.info(f"   Blockchain: {BLOCKCHAIN[:40] if BLOCKCHAIN else '❌ NOT SET'}")
    ctx.logger.info(f"=" * 50)

# ============================================
# INCLUDE PROTOCOLS
# ============================================

agent.include(request_protocol, publish_manifest=True)
agent.include(health_protocol, publish_manifest=False)