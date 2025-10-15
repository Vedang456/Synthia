# FILE: agents/orchestrator.py
from protocols.messages import ScoreRequest, ScoreAnalysis, BlockchainUpdate
from uagents import Agent, Context, Model, Protocol
from typing import Optional, Dict
import time
import asyncio
import os
from dataclasses import dataclass, field
from enum import Enum

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
    metta_reasoning: Optional[Dict] = None
    blockchain_tx: Optional[str] = None
    error: Optional[str] = None

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
    metta_rules_applied: list[str]
    score_adjustments: int
    analysis_data: dict
    timestamp: int

class BlockchainUpdate(Model):
    request_id: str
    wallet_address: str
    score: int
    metta_rules_applied: list[str]  # FIXED: Changed from metta_rules
    score_adjustment: int
    analysis_data: dict

class OrchestratorAgent:
    """
    🎯 ORCHESTRATOR - The brain of Synthia
    Coordinates ALL agents and manages request lifecycle
    """
    
    def __init__(self):
        self.agent = Agent(
            name="synthia_orchestrator",
            seed=os.getenv("ORCHESTRATOR_SEED"),
            mailbox=f"{os.getenv('ORCHESTRATOR_MAILBOX_KEY')}@https://agentverse.ai",
            port=8000
        )
        
        # Track all requests
        self.active_requests: Dict[str, RequestTracker] = {}
        
        # Agent addresses (populated after deployment)
        self.ASI_ONE_CHAT = os.getenv("ASI_ONE_CHAT_ADDRESS")
        self.WALLET_ANALYZER = os.getenv("WALLET_ANALYZER_ADDRESS")  # FIXED: Only one analyzer for now
        self.BLOCKCHAIN = os.getenv("BLOCKCHAIN_ADDRESS")
        self.MARKETPLACE = os.getenv("MARKETPLACE_ADDRESS")
        
        # Metrics
        self.total_requests = 0
        self.successful_analyses = 0
        self.failed_analyses = 0
        
        self.setup_protocols()
    
    def setup_protocols(self):
        """Setup all orchestrator protocols"""
        
        # Main request protocol
        request_protocol = Protocol("OrchestratorRequest")
        
        @request_protocol.on_message(model=ScoreRequest)
        async def handle_score_request(ctx: Context, sender: str, msg: ScoreRequest):
            """Receive analysis request and coordinate workflow"""
            ctx.logger.info(f"📥 Request received: {msg.wallet_address}")
            
            # Track request
            tracker = RequestTracker(
                request_id=msg.request_id,
                wallet_address=msg.wallet_address,
                status=RequestStatus.PENDING,
                created_at=time.time(),
                requester_agent=sender
            )
            self.active_requests[msg.request_id] = tracker
            self.total_requests += 1
            
            # Update status
            tracker.status = RequestStatus.ANALYZING
            
            # Send to analyzer
            ctx.logger.info(f"🔀 Routing to analyzer...")
            
            if self.WALLET_ANALYZER:
                await ctx.send(self.WALLET_ANALYZER, ScoreRequest(
                    wallet_address=msg.wallet_address,
                    request_id=msg.request_id,
                    requester=str(ctx.agent.address)
                ))
            else:
                ctx.logger.error("❌ Wallet analyzer not configured!")
        
        @request_protocol.on_message(model=ScoreAnalysis)
        async def handle_analysis_result(ctx: Context, sender: str, msg: ScoreAnalysis):
            """Receive analysis from analyzer agents"""
            ctx.logger.info(f"📊 Analysis received from {msg.analyzer_id}")
            
            tracker = self.active_requests.get(msg.request_id)
            if not tracker:
                ctx.logger.warning(f"Unknown request: {msg.request_id}")
                return
            
            # Store analyzer result
            tracker.analyzer_results[msg.analyzer_id] = msg
            tracker.final_score = msg.score
            tracker.metta_reasoning = msg.reasoning_explanation
            
            ctx.logger.info(f"✅ Analysis complete: {tracker.final_score}/1000")
            
            # Send to blockchain agent for on-chain update
            if self.BLOCKCHAIN:
                await ctx.send(self.BLOCKCHAIN, BlockchainUpdate(
                    request_id=msg.request_id,
                    wallet_address=tracker.wallet_address,
                    score=msg.score,
                    metta_rules_applied=msg.metta_rules_applied,
                    score_adjustment=msg.score_adjustments,
                    analysis_data=msg.analysis_data
                ))
            else:
                ctx.logger.warning("⚠️  Blockchain agent not configured")
        
        @request_protocol.on_message(model=Model)
        async def handle_blockchain_confirmation(ctx: Context, sender: str, msg: Model):
            """Receive confirmation from blockchain agent"""
            if not hasattr(msg, 'status'):
                return
            
            if msg.status == "success":
                request_id = getattr(msg, 'request_id', None)
                if request_id and request_id in self.active_requests:
                    tracker = self.active_requests[request_id]
                    tracker.status = RequestStatus.COMPLETED
                    tracker.blockchain_tx = getattr(msg, 'tx_hash', None)
                    
                    self.successful_analyses += 1
                    
                    ctx.logger.info(f"🎉 Request {request_id} completed!")
                    ctx.logger.info(f"   Score: {tracker.final_score}/1000")
                    ctx.logger.info(f"   TX: {tracker.blockchain_tx}")
                    
                    # Notify requester if applicable
                    if tracker.requester_agent and tracker.requester_agent != str(ctx.agent.address):
                        await ctx.send(tracker.requester_agent, Model(
                            status="completed",
                            request_id=request_id,
                            score=tracker.final_score,
                            tx_hash=tracker.blockchain_tx
                        ))
                    
                    # Cleanup after 5 minutes
                    await asyncio.sleep(300)
                    if request_id in self.active_requests:
                        del self.active_requests[request_id]
            
            elif msg.status == "error":
                self.failed_analyses += 1
                ctx.logger.error(f"❌ Blockchain update failed: {getattr(msg, 'error', 'Unknown')}")
        
        self.agent.include(request_protocol)
        
        # Health check protocol
        health_protocol = Protocol("OrchestratorHealth")
        
        @health_protocol.on_interval(period=60.0)
        async def health_check(ctx: Context):
            """Periodic health monitoring"""
            active_count = len(self.active_requests)
            
            # Cleanup stale requests (>5 minutes old)
            current_time = time.time()
            stale_requests = [
                req_id for req_id, tracker in self.active_requests.items()
                if current_time - tracker.created_at > 300
            ]
            
            for req_id in stale_requests:
                ctx.logger.warning(f"🧹 Cleaning up stale request: {req_id}")
                del self.active_requests[req_id]
            
            ctx.logger.info(f"""
📊 Orchestrator Health:
   Active Requests: {active_count}
   Total Processed: {self.total_requests}
   Success Rate: {(self.successful_analyses / self.total_requests * 100) if self.total_requests > 0 else 0:.1f}%
   Failed: {self.failed_analyses}
            """)
        
        self.agent.include(health_protocol)
    
    def run(self):
        """Start orchestrator"""
        print(f"""
🎯 SYNTHIA ORCHESTRATOR STARTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Address: {self.agent.address}
🌐 Port: 8000
🔗 Mailbox: Active

Connected Agents:
  • ASI:One Chat: {self.ASI_ONE_CHAT or 'Not configured'}
  • Wallet Analyzer: {self.WALLET_ANALYZER or 'Not configured'}
  • Blockchain: {self.BLOCKCHAIN or 'Not configured'}
  • Marketplace: {self.MARKETPLACE or 'Not configured'}

Ready to coordinate reputation analyses! 🚀
        """)
        self.agent.run()

if __name__ == "__main__":
    orchestrator = OrchestratorAgent()
    orchestrator.run()