# CHAT AGENT - ASI:One Compatible (Based on Official Docs)

from datetime import datetime
from uuid import uuid4
import os
import re
from typing import Optional, Dict, List

from uagents import Context, Protocol, Agent, Model
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    EndSessionContent,
    TextContent,
    chat_protocol_spec,
)

# ============================================
# MESSAGE MODELS
# ============================================

class ScoreRequest(Model):
    wallet_address: str
    request_id: str
    requester: Optional[str] = None

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

ORCHESTRATOR_ADDRESS = os.getenv("ORCHESTRATOR_ADDRESS", "")

# ============================================
# HELPERS
# ============================================

def extract_wallet(text: str) -> Optional[str]:
    pattern = r'0x[a-fA-F0-9]{40}'
    matches = re.findall(pattern, text)
    return matches[0] if matches else None

def format_score_emoji(score: int) -> tuple:
    if score >= 90:
        return "🌟", "Exceptional"
    elif score >= 80:
        return "⭐", "Excellent"
    elif score >= 70:
        return "👍", "Very Good"
    elif score >= 60:
        return "✅", "Good"
    elif score >= 40:
        return "📊", "Moderate"
    else:
        return "⚠️", "Developing"

# ============================================
# AGENT
# ============================================

agent = Agent(
    asi_one_api_key="sk_b9168c0d549b45f49785e6e8aba1d00b9bd6e35865364862bd43edc2f76a3dc4"
)

# ============================================
# CHAT PROTOCOL (For ASI:One)
# ============================================

chat_protocol = Protocol(spec=chat_protocol_spec)

@chat_protocol.on_message(ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle messages from ASI:One users - CRITICAL: Use ctx.session"""
    
    # Send acknowledgement immediately
    await ctx.send(
        sender,
        ChatAcknowledgement(
            timestamp=datetime.now(), 
            acknowledged_msg_id=msg.msg_id
        ),
    )
    
    # Extract text
    text = ''
    for item in msg.content:
        if isinstance(item, TextContent):
            text += item.text
    
    ctx.logger.info(f"💬 User message: {text[:50]}...")
    
    # Extract wallet
    wallet = extract_wallet(text)
    
    if wallet:
        await handle_analysis_request(ctx, sender, msg.msg_id, wallet)
    elif any(word in text.lower() for word in ["help", "how", "what", "explain"]):
        await send_chat_response(ctx, sender, get_help_text(), end_session=True)
    else:
        await send_chat_response(ctx, sender, get_greeting_text(), end_session=True)

@chat_protocol.on_message(ChatAcknowledgement)
async def handle_chat_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass

async def handle_analysis_request(ctx: Context, sender: str, msg_id: str, wallet: str):
    """Handle wallet analysis request"""
    
    request_id = f"{msg_id}_{wallet[:10]}"
    
    # CRITICAL: Store using ctx.session for ASI:One compatibility
    ctx.storage.set(f"req_{request_id}_sender", sender)
    ctx.storage.set(f"req_{request_id}_wallet", wallet)
    ctx.storage.set(f"req_{request_id}_time", datetime.now().isoformat())
    
    ctx.logger.info(f"🔍 Analysis request: {wallet}")
    ctx.logger.info(f"   Request ID: {request_id}")
    ctx.logger.info(f"   Session: {ctx.session}")
    
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
        ctx.logger.info("✅ Sent to orchestrator")
    
    # Send analyzing message (NO EndSessionContent - keeps session open)
    analyzing_text = f"""🔍 **Analyzing Wallet**

`{wallet[:8]}...{wallet[-6:]}`

🤖 Multi-agent system working:
✓ Transaction history
✓ DeFi interactions  
✓ Security evaluation
✓ MeTTa reasoning

⏱️ Takes 10-15 seconds...

_Powered by ASI Alliance 🤖_"""
    
    await send_chat_response(ctx, sender, analyzing_text, end_session=False)

async def send_chat_response(ctx: Context, sender: str, text: str, end_session: bool):
    """Send response via chat protocol"""
    
    content = [TextContent(type="text", text=text)]
    
    if end_session:
        content.append(EndSessionContent(type="end-session"))
    
    await ctx.send(
        sender, 
        ChatMessage(
            timestamp=datetime.utcnow(),
            msg_id=uuid4(),
            content=content
        )
    )

def get_greeting_text() -> str:
    return """👋 **Welcome to Synthia!**

AI-powered wallet reputation analyst!

🤖 **Powered by:**
- ASI Alliance multi-agent system
- MeTTa symbolic reasoning
- Hedera blockchain

**Try:** "Analyze 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

Just paste any Ethereum address! 🚀"""

def get_help_text() -> str:
    return """📚 **How Synthia Works**

**Two-Phase Analysis:**
1️⃣ AI analysis & scoring (10s)
2️⃣ Blockchain verification (5s)

**Reputation Tiers:**
- 90+ = Exceptional 🌟
- 80+ = Excellent ⭐
- 70+ = Very Good 👍
- 60+ = Good ✅
- 40+ = Moderate 📊

Paste an Ethereum address!"""

# ============================================
# AGENT PROTOCOL (For orchestrator messages)
# ============================================

agent_protocol = Protocol("SynthiaAgentMessages")

@agent_protocol.on_message(model=AnalysisComplete)
async def handle_analysis_complete(ctx: Context, sender: str, msg: AnalysisComplete):
    """PHASE 1: Receive analysis"""
    
    ctx.logger.info("=" * 50)
    ctx.logger.info(f"📊 PHASE 1 RECEIVED")
    ctx.logger.info(f"   Request: {msg.request_id}")
    ctx.logger.info(f"   Score: {msg.score}/100")
    ctx.logger.info("=" * 50)
    
    # Get stored sender
    original_sender = ctx.storage.get(f"req_{msg.request_id}_sender")
    
    if not original_sender:
        ctx.logger.warning(f"⚠️ No sender for {msg.request_id}")
        return
    
    emoji, rating = format_score_emoji(msg.score)
    
    response_text = f"""{emoji} **Analysis Complete!**

**Wallet:** `{msg.wallet_address[:8]}...{msg.wallet_address[-6:]}`
**Score:** {msg.score}/100 ({rating})
**Level:** {msg.reputation_level}

📊 **Breakdown:**
• Transactions: {msg.transaction_score}/100
• DeFi: {msg.defi_score}/100
• Security: {msg.security_score}/100
• Social: {msg.social_score}/100

🧠 **MeTTa Reasoning:**
{msg.reasoning_explanation[:250]}...

⏳ **Blockchain Verification:**
⚙️ Writing to Hedera...
🔄 Waiting for confirmation...

_Score calculated! Blockchain in progress..._"""
    
    # Keep session open - NO EndSessionContent
    await send_chat_response(ctx, original_sender, response_text, end_session=False)
    
    ctx.logger.info("✅ PHASE 1 sent (session open)")

@agent_protocol.on_message(model=BlockchainStatus)
async def handle_blockchain_status(ctx: Context, sender: str, msg: BlockchainStatus):
    """PHASE 2: Receive blockchain status"""
    
    ctx.logger.info("=" * 50)
    ctx.logger.info(f"⛓️ PHASE 2 RECEIVED")
    ctx.logger.info(f"   Request: {msg.request_id}")
    ctx.logger.info(f"   Status: {msg.status}")
    ctx.logger.info("=" * 50)
    
    # Get stored sender
    original_sender = ctx.storage.get(f"req_{msg.request_id}_sender")
    
    if not original_sender:
        ctx.logger.warning(f"⚠️ No sender for {msg.request_id}")
        return
    
    if msg.status == "success":
        response_text = f"""✅ **Blockchain Verified!**

⛓️ **Hedera Confirmation:**
✅ Score recorded on-chain
🔗 **TX:** `{msg.tx_hash[:10]}...{msg.tx_hash[-8:]}`
📍 [View](https://hashscan.io/testnet/transaction/{msg.tx_hash})

🎉 Reputation immutably stored!

_Powered by ASI Alliance 🤖 | Hedera ⛓️_"""
        
    else:
        error_msg = msg.error or "Transaction reverted"
        response_text = f"""⚠️ **Blockchain Verification Failed**

❌ **Status:** Transaction reverted
📝 **Reason:** {error_msg[:150]}

**Your Analysis:**
✅ Score calculated
✅ AI analysis complete
❌ On-chain verification pending

_Score valid! Sync will retry._

_Powered by ASI Alliance 🤖 | Hedera ⛓️_"""
    
    # NOW end session
    await send_chat_response(ctx, original_sender, response_text, end_session=True)
    
    # Cleanup
    ctx.storage.set(f"req_{msg.request_id}_sender", None)
    ctx.storage.set(f"req_{msg.request_id}_wallet", None)
    ctx.storage.set(f"req_{msg.request_id}_time", None)
    
    ctx.logger.info("✅ PHASE 2 sent, session ended")

# ============================================
# STARTUP
# ============================================

@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info("=" * 50)
    ctx.logger.info("🤖 CHAT AGENT (ASI:One Compatible)")
    ctx.logger.info("=" * 50)
    ctx.logger.info(f"Address: {ctx.agent.address}")
    ctx.logger.info(f"Orch: {ORCHESTRATOR_ADDRESS[:20] if ORCHESTRATOR_ADDRESS else '❌'}...")
    ctx.logger.info("=" * 50)

# ============================================
# INCLUDE PROTOCOLS
# ============================================

agent.include(chat_protocol, publish_manifest=True)
agent.include(agent_protocol, publish_manifest=True)