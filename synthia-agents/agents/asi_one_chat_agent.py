from datetime import datetime
from uuid import uuid4
import os
import re
from typing import Optional, Dict

from uagents import Context, Protocol, Agent, Model
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    EndSessionContent,
    TextContent,
    chat_protocol_spec,
)

# ============================================
# INTERNAL MESSAGE MODELS
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

# ============================================
# CONFIGURATION
# ============================================

ORCHESTRATOR_ADDRESS = os.getenv("ORCHESTRATOR_ADDRESS", "")
pending_requests: Dict[str, Dict] = {}

# Synthia's subject matter
subject_matter = "Ethereum wallet reputation analysis and blockchain trust scoring"

# ============================================
# HELPER FUNCTIONS
# ============================================

def extract_wallet(text: str) -> Optional[str]:
    """Extract Ethereum address from text"""
    pattern = r'0x[a-fA-F0-9]{40}'
    matches = re.findall(pattern, text)
    return matches[0] if matches else None

# ============================================
# AGENT SETUP
# ============================================

agent = Agent(
    name="synthia_chat",
    seed="RfB-bT1Fs6rqm-U6QJsNh6L2Tc5uxpc8hrf5CaZMNqA",
    asi_one_api_key="sk_b9168c0d549b45f49785e6e8aba1d00b9bd6e35865364862bd43edc2f76a3dc4"
)

# Create protocol compatible with chat protocol spec
protocol = Protocol(spec=chat_protocol_spec)

# ============================================
# CHAT PROTOCOL HANDLER
# ============================================

@protocol.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle messages from ASI:One users"""
    
    # Send acknowledgement
    await ctx.send(
        sender,
        ChatAcknowledgement(
            timestamp=datetime.now(), 
            acknowledged_msg_id=msg.msg_id
        ),
    )
    
    # Collect text from message
    text = ''
    for item in msg.content:
        if isinstance(item, TextContent):
            text += item.text
    
    ctx.logger.info(f"💬 ASI:One User: {text[:50]}...")
    
    # Extract wallet address
    wallet = extract_wallet(text)
    
    if wallet:
        # Request wallet analysis
        await request_analysis(ctx, sender, msg.msg_id, wallet, text)
    elif any(word in text.lower() for word in ["help", "how", "what", "explain"]):
        # Send help
        await send_response(ctx, sender, get_help_text())
    else:
        # Send greeting
        await send_response(ctx, sender, get_greeting_text())

@protocol.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements (not used in this example)"""
    pass

# ============================================
# HELPER FUNCTIONS
# ============================================

async def request_analysis(ctx: Context, sender: str, msg_id: str, wallet: str, original_text: str):
    """Request wallet analysis from orchestrator"""
    
    request_id = f"{msg_id}_{wallet[:10]}"
    
    # Store pending request
    pending_requests[request_id] = {
        "sender": sender,
        "wallet": wallet,
        "timestamp": datetime.now().isoformat()
    }
    
    ctx.logger.info(f"🔍 Analyzing: {wallet}")
    
    # Send to orchestrator
    if ORCHESTRATOR_ADDRESS:
        await ctx.send(
            ORCHESTRATOR_ADDRESS,
            ScoreRequest(
                wallet_address=wallet,
                request_id=request_id,
                requester=str(ctx.agent.address)
            )
        )
    
    # Send analyzing message to user
    analyzing_text = f"""🔍 **Analyzing {wallet[:8]}...{wallet[-6:]}**

My AI agents are working on:
✓ Transaction history analysis
✓ DeFi protocol interactions
✓ Security posture check
✓ MeTTa reasoning engine

⏱️ This usually takes 10-15 seconds..."""
    
    await send_response(ctx, sender, analyzing_text)

async def send_response(ctx: Context, sender: str, text: str):
    """Send response back to user"""
    await ctx.send(
        sender, 
        ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=[
                TextContent(type="text", text=text),
                EndSessionContent(type="end-session"),
            ]
        )
    )

def get_greeting_text() -> str:
    """Get greeting message"""
    return """👋 **Welcome to Synthia!**

I'm your AI-powered wallet reputation analyst!

🤖 **Powered by:**
- ASI Alliance multi-agent system
- MeTTa symbolic reasoning
- Hedera blockchain verification

**Try:** "Analyze 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"

Just paste any Ethereum address! 🚀"""

def get_help_text() -> str:
    """Get help message"""
    return """📚 **How Synthia Works**

**Multi-Agent AI System:**
- Orchestrator coordinates workflow
- Analyzer examines on-chain data  
- Blockchain writes to Hedera

**MeTTa Reasoning:**
- 10+ symbolic trust rules
- Explainable AI decisions
- Transparent scoring

**Reputation Tiers:**
- 900+ = Exceptional 🌟
- 800+ = Excellent ⭐
- 700+ = Very Good 👍
- 600+ = Good ✅
- 400+ = Moderate 📊

Just paste an Ethereum address to analyze!"""

# ============================================
# INTERNAL PROTOCOL (For agent communication)
# ============================================

internal_protocol = Protocol("SynthiaInternal")

@internal_protocol.on_message(model=FinalResult)
async def receive_final_result(ctx: Context, sender: str, msg: FinalResult):
    """Receive final results from orchestrator"""
    
    ctx.logger.info(f"📊 Final Result: {msg.score}/1000")
    
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
    
    # Format response based on score
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
    
    response_text = f"""{emoji} **Analysis Complete!**

**Wallet:** `{msg.wallet_address[:8]}...{msg.wallet_address[-6:]}`
**Score:** {msg.score}/1000 ({rating})
**Level:** {msg.reputation_level}

📊 **Breakdown:**
"""
    
    if msg.transaction_score:
        response_text += f"• Transactions: {msg.transaction_score}/100\n"
    if msg.defi_score:
        response_text += f"• DeFi: {msg.defi_score}/100\n"
    if msg.security_score:
        response_text += f"• Security: {msg.security_score}/100\n"
    if msg.social_score:
        response_text += f"• Social: {msg.social_score}/100\n"
    
    response_text += f"""
🧠 **MeTTa Reasoning:**
{msg.reasoning_explanation[:300]}...

⛓️ **Hedera Blockchain:**
✅ Verified on-chain
🔗 TX: {msg.tx_hash[:10]}...{msg.tx_hash[-6:]}
"""
    
    if msg.nft_token_id:
        response_text += f"\n🎨 **NFT Minted:** Token #{msg.nft_token_id}"
    
    response_text += "\n\nPowered by ASI Alliance 🤖 | Hedera ⛓️"
    
    # Send to user
    await ctx.send(
        original_sender,
        ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=[
                TextContent(type="text", text=response_text),
                EndSessionContent(type="end-session"),
            ]
        )
    )
    
    ctx.logger.info("✅ Sent result to user!")

# ============================================
# HEALTH CHECK
# ============================================

@agent.on_interval(period=60.0)
async def health_check(ctx: Context):
    """Periodic health check"""
    pending_count = len(pending_requests)
    has_orchestrator = bool(ORCHESTRATOR_ADDRESS)
    
    ctx.logger.info(f"""
📊 Chat Agent Health:
   Pending Requests: {pending_count}
   Orchestrator: {has_orchestrator}
   Chat Protocol: Active ✅
    """)

# ============================================
# STARTUP
# ============================================

@agent.on_event("startup")
async def startup(ctx: Context):
    """Startup handler"""
    ctx.logger.info(f"🤖 ASI:One Chat Agent Started")
    ctx.logger.info(f"   Address: {ctx.agent.address}")
    ctx.logger.info(f"   Chat Protocol: ENABLED ✅")
    ctx.logger.info(f"   Orchestrator: {ORCHESTRATOR_ADDRESS[:20]}..." if ORCHESTRATOR_ADDRESS else "   Orchestrator: Not configured")

# ============================================
# INCLUDE PROTOCOLS
# ============================================

agent.include(protocol, publish_manifest=True)
agent.include(internal_protocol, publish_manifest=False)