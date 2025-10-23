from uagents import Context, Protocol, Model
from typing import Optional, Dict, List
import time
import asyncio
from dataclasses import dataclass, field
from enum import Enum

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


agent = Agent(
    name="orchestrator",
    seed="favLCrQrip3Z4s5zM7ZqOi_wlokr33UqoQsmpzmRtcw",
    port=8002,
    endpoint=["http://localhost:8002/submit"]
)


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

import os

active_requests: Dict[str, RequestTracker] = {}
total_requests = 0
successful_analyses = 0
failed_analyses = 0

# Agent addresses from secrets
ASI_ONE_CHAT = os.getenv("ASI_ONE_ADDRESS", "")
WALLET_ANALYZER = os.getenv("ANALYZER_ADDRESS", "")
BLOCKCHAIN = os.getenv("BLOCKCHAIN_ADDRESS", "")

# ============================================
# REQUEST PROTOCOL
# ============================================

request_protocol = Protocol("OrchestratorRequest")

@request_protocol.on_message(model=ScoreRequest)
async def handle_score_request(ctx: Context, sender: str, msg: ScoreRequest):
    """Receive analysis request and coordinate workflow"""
    global active_requests, total_requests
    
    ctx.logger.info(f"📥 Request: {msg.wallet_address}")
    
    # Track request
    tracker = RequestTracker(
        request_id=msg.request_id,
        wallet_address=msg.wallet_address,
        status=RequestStatus.ANALYZING,
        created_at=time.time(),
        requester_agent=sender
    )
    active_requests[msg.request_id] = tracker
    total_requests += 1
    
    ctx.logger.info(f"🔀 Routing to analyzer...")
    
    if WALLET_ANALYZER:
        await ctx.send(WALLET_ANALYZER, ScoreRequest(
            wallet_address=msg.wallet_address,
            request_id=msg.request_id,
            requester=str(ctx.agent.address)
        ))
        ctx.logger.info(f"✅ Sent to analyzer: {WALLET_ANALYZER[:20]}...")
    else:
        ctx.logger.error("❌ Wallet analyzer not configured!")

@request_protocol.on_message(model=ScoreAnalysis)
async def handle_analysis_result(ctx: Context, sender: str, msg: ScoreAnalysis):
    """Receive analysis from analyzer agents"""
    global active_requests
    
    ctx.logger.info(f"📊 Analysis from {msg.analyzer_id}")
    
    tracker = active_requests.get(msg.request_id)
    if not tracker:
        ctx.logger.warning(f"Unknown request: {msg.request_id}")
        return
    
    # Store analyzer result
    tracker.analyzer_results[msg.analyzer_id] = msg
    tracker.final_score = msg.score
    tracker.metta_reasoning = msg.reasoning_explanation
    
    ctx.logger.info(f"✅ Score: {tracker.final_score}/1000")
    
    # Send to blockchain agent
    if BLOCKCHAIN:
        await ctx.send(BLOCKCHAIN, BlockchainUpdate(
            request_id=msg.request_id,
            wallet_address=tracker.wallet_address,
            score=msg.score,
            metta_rules_applied=msg.metta_rules_applied,
            score_adjustment=msg.score_adjustments,
            analysis_data=msg.analysis_data
        ))
        ctx.logger.info(f"✅ Sent to blockchain: {BLOCKCHAIN[:20]}...")
    else:
        ctx.logger.warning("⚠️ Blockchain not configured")

@request_protocol.on_message(model=BlockchainConfirmation)
async def handle_blockchain_confirmation(ctx: Context, sender: str, msg: BlockchainConfirmation):
    """Receive confirmation from blockchain agent"""
    global active_requests, successful_analyses, failed_analyses
    
    if msg.status == "success":
        request_id = msg.request_id
        if request_id not in active_requests:
            ctx.logger.warning(f"Unknown request in confirmation: {request_id}")
            return
        
        tracker = active_requests[request_id]
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
        if tracker.requester_agent and ASI_ONE_CHAT:
            final_result = FinalResult(
                request_id=request_id,
                wallet_address=tracker.wallet_address,
                score=tracker.final_score or 0,
                reputation_level=analysis.reputation_level if analysis else "Unknown",
                reasoning_explanation=tracker.metta_reasoning if tracker.metta_reasoning else "Analysis completed",
                tx_hash=msg.tx_hash or "",
                nft_token_id=msg.nft_token_id,
                hcs_sequence=msg.hcs_sequence,
                timestamp=int(time.time()),
                transaction_score=analysis.transaction_score if analysis else None,
                defi_score=analysis.defi_score if analysis else None,
                security_score=analysis.security_score if analysis else None,
                social_score=analysis.social_score if analysis else None
            )
            
            await ctx.send(ASI_ONE_CHAT, final_result)
            ctx.logger.info(f"✅ Sent FinalResult to chat!")
        
        # Cleanup after 5 minutes
        await asyncio.sleep(300)
        if request_id in active_requests:
            del active_requests[request_id]
    
    elif msg.status == "error":
        failed_analyses += 1
        ctx.logger.error(f"❌ Blockchain failed: {msg.error}")

# ============================================
# HEALTH PROTOCOL
# ============================================

health_protocol = Protocol("OrchestratorHealth")

@health_protocol.on_interval(period=60.0)
async def health_check(ctx: Context):
    """Periodic health monitoring"""
    global active_requests, total_requests, successful_analyses, failed_analyses
    
    active_count = len(active_requests)
    
    # Cleanup stale requests (>5 minutes old)
    current_time = time.time()
    stale_requests = [
        req_id for req_id, tracker in active_requests.items()
        if current_time - tracker.created_at > 300
    ]
    
    for req_id in stale_requests:
        ctx.logger.warning(f"🧹 Cleaning up: {req_id}")
        del active_requests[req_id]
    
    success_rate = (successful_analyses / total_requests * 100) if total_requests > 0 else 0
    
    ctx.logger.info(f"""
📊 Health:
   Active: {active_count}
   Total: {total_requests}
   Success: {success_rate:.1f}%
   Failed: {failed_analyses}
    """)

# ============================================
# INCLUDE PROTOCOLS
# ============================================

agent.include(request_protocol, publish_manifest=True)
agent.include(health_protocol, publish_manifest=False)