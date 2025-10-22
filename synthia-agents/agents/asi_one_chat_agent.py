# FILE: asi_one_chat_agent.py (Agentverse Hosted - Simplified)

from uagents import Context, Model
from typing import Optional, Dict, List
import os
import re
import time

# ============================================
# MESSAGE MODELS
# ============================================

class ScoreRequest(Model):
    wallet_address: str
    request_id: str
    requester: Optional[str] = None

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

class ChatQuery(Model):
    message: str
    session_id: str
    wallet_address: Optional[str] = None

class ChatResponse(Model):
    message: str
    session_id: str
    actions: List[str]
    data: Optional[dict] = None

# ============================================
# CONFIGURATION
# ============================================

ORCHESTRATOR_ADDRESS = os.getenv("ORCHESTRATOR_ADDRESS", "")
pending_requests: Dict[str, Dict] = {}

# ============================================
# HELPER FUNCTIONS
# ============================================

def extract_wallet(text: str) -> Optional[str]:
    """Extract Ethereum address from text"""
    pattern = r'0x[a-fA-F0-9]{40}'
    matches = re.findall(pattern, text)
    return matches[0] if matches else None

# ============================================
# MESSAGE HANDLERS (Direct on agent)
# ============================================

@agent.on_message(model=ChatQuery)
async def handle_chat(ctx: Context, sender: str, msg: ChatQuery):
    """Handle chat messages"""
    ctx.logger.info(f"💬 Message: {msg.message[:50]}...")
    
    wallet = extract_wallet(msg.message) or msg.wallet_address
    
    if wallet:
        # Request analysis
        request_id = f"{msg.session_id}_{wallet[:10]}"
        
        pending_requests[request_id] = {
            "sender": sender,
            "wallet": wallet,
            "session_id": msg.session_id,
            "timestamp": int(time.time())
        }
        
        ctx.logger.info(f"🔍 Analyzing: {wallet}")
        
        if ORCHESTRATOR_ADDRESS:
            await ctx.send(
                ORCHESTRATOR_ADDRESS,
                ScoreRequest(
                    wallet_address=wallet,
                    request_id=request_id,
                    requester=str(ctx.agent.address)
                )
            )
        
        # Send response
        response_msg = f"""🔍 **Analyzing {wallet[:8]}...{wallet[-6:]}**

✓ Transaction analysis
✓ DeFi interactions
✓ Security checks
✓ MeTTa reasoning

⏱️ ~10-15 seconds..."""
        
        await ctx.send(
            sender,
            ChatResponse(
                message=response_msg,
                session_id=msg.session_id,
                actions=["analysis_started"],
                data={"wallet": wallet}
            )
        )
    else:
        # Send greeting
        await ctx.send(
            sender,
            ChatResponse(
                message="""👋 **Welcome to Synthia!**

I analyze Ethereum wallet reputations using:
🤖 ASI Alliance agents
🧠 MeTTa reasoning
⛓️ Hedera blockchain

**Try:** "Analyze 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"

Just paste any Ethereum address!""",
                session_id=msg.session_id,
                actions=["greeting"],
                data=None
            )
        )

@agent.on_message(model=FinalResult)
async def receive_final_result(ctx: Context, sender: str, msg: FinalResult):
    """Receive final results from orchestrator"""
    
    ctx.logger.info(f"📊 Result: {msg.score}/1000")
    
    # Find pending request
    request_data = None
    for req_id, data in list(pending_requests.items()):
        if data["wallet"] == msg.wallet_address:
            request_data = pending_requests.pop(req_id)
            break
    
    if not request_data:
        ctx.logger.warning("⚠️ No pending request")
        return
    
    original_sender = request_data["sender"]
    session_id = request_data["session_id"]
    
    # Format
    if msg.score >= 900:
        emoji, rating = "🌟", "Exceptional"
    elif msg.score >= 800:
        emoji, rating = "⭐", "Excellent"
    elif msg.score >= 700:
        emoji, rating = "👍", "Very Good"
    elif msg.score >= 600:
        emoji, rating = "✅", "Good"
    elif msg.score >= 400:
        emoji, rating = "📊", "Moderate"
    else:
        emoji, rating = "⚠️", "Developing"
    
    response = f"""{emoji} **Analysis Complete!**

**Wallet:** `{msg.wallet_address[:8]}...{msg.wallet_address[-6:]}`
**Score:** {msg.score}/1000 ({rating})
**Level:** {msg.reputation_level}

📊 **Breakdown:**
"""
    
    if msg.transaction_score:
        response += f"• Transactions: {msg.transaction_score}/100\n"
    if msg.defi_score:
        response += f"• DeFi: {msg.defi_score}/100\n"
    if msg.security_score:
        response += f"• Security: {msg.security_score}/100\n"
    if msg.social_score:
        response += f"• Social: {msg.social_score}/100\n"
    
    response += f"""
🧠 **MeTTa:** {msg.reasoning_explanation[:300]}...

⛓️ **Hedera:** TX {msg.tx_hash[:10]}...
"""
    
    if msg.nft_token_id:
        response += f"\n🎨 **NFT:** #{msg.nft_token_id}"
    
    response += "\n\nPowered by ASI Alliance 🤖"
    
    # Send to user
    await ctx.send(
        original_sender,
        ChatResponse(
            message=response,
            session_id=session_id,
            actions=["analysis_complete"],
            data={"score": msg.score}
        )
    )
    
    ctx.logger.info("✅ Sent to user!")

# ============================================
# HEALTH CHECK
# ============================================

@agent.on_interval(period=60.0)
async def health_check(ctx: Context):
    """Health check"""
    
    pending_count = len(pending_requests)
    has_orchestrator = bool(ORCHESTRATOR_ADDRESS)
    
    ctx.logger.info(f"📊 Health: Pending={pending_count}, Orch={has_orchestrator}")

# ============================================
# STARTUP
# ============================================

@agent.on_event("startup")
async def startup(ctx: Context):
    """Startup handler"""
    ctx.logger.info(f"🤖 Chat Agent Started")
    ctx.logger.info(f"   Address: {ctx.agent.address}")
    ctx.logger.info(f"   Orchestrator: {ORCHESTRATOR_ADDRESS[:20] if ORCHESTRATOR_ADDRESS else 'Not configured'}...")