# FILE: agents/asi_one_chat_agent.py

from uagents import Agent, Context, Model, Protocol
from typing import Optional
import os
import re
import time

# Message Models (define them here since protocols/messages.py might not exist yet)
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

class ChatQuery(Model):
    message: str
    session_id: str
    wallet_address: Optional[str] = None

class ChatResponse(Model):
    message: str
    session_id: str
    actions: list[str]
    data: Optional[dict] = None

# Create ASI:One Chat Agent
asi_one_agent = Agent(
    name="synthia_asi_one_chat",
    seed=os.getenv("ASI_ONE_SEED"),
    mailbox=f"{os.getenv('ASI_ONE_MAILBOX_KEY')}@https://agentverse.ai",
    port=8004
)

# Store orchestrator address
ORCHESTRATOR_ADDRESS = os.getenv("ORCHESTRATOR_ADDRESS")

# Pending requests (waiting for analysis)
pending_requests = {}

# Chat Protocol
chat_protocol = Protocol("ASIOneChat", "1.0.0")

@chat_protocol.on_message(model=ChatQuery)
async def handle_chat(ctx: Context, sender: str, msg: ChatQuery):
    """Handle natural language chat from ASI:One"""
    ctx.logger.info(f"💬 Chat message: {msg.message}")
    
    # Parse intent
    intent = parse_intent(msg.message)
    ctx.logger.info(f"🎯 Detected intent: {intent}")
    
    if intent == "analyze":
        wallet = extract_wallet(msg.message) or msg.wallet_address
        if wallet:
            response = await handle_analysis(ctx, wallet, msg.session_id)
        else:
            response = {
                "message": "I'd love to analyze a wallet! Please provide an Ethereum address (0x...).",
                "actions": ["prompt_for_address"],
                "data": None
            }
    elif intent == "explain":
        response = explain_system()
    elif intent == "compare":
        wallets = extract_multiple_wallets(msg.message)
        if len(wallets) >= 2:
            response = await handle_comparison(ctx, wallets[:2], msg.session_id)
        else:
            response = {
                "message": "To compare wallets, provide two addresses like:\n'Compare 0x123... and 0x456...'",
                "actions": ["prompt_for_comparison"],
                "data": None
            }
    else:
        response = {
            "message": """👋 Hi! I'm Synthia, your AI reputation analyst powered by ASI Alliance!

I can help you with:
- **Analyze** a wallet: "Check reputation of 0x..."
- **Compare** wallets: "Compare 0x... and 0x..."
- **Explain** system: "How does Synthia work?"

Try: "Analyze 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
""",
            "actions": ["greeting"],
            "data": None
        }
    
    # Send response
    await ctx.send(sender, ChatResponse(
        message=response["message"],
        session_id=msg.session_id,
        actions=response["actions"],
        data=response.get("data")
    ))

def parse_intent(message: str) -> str:
    """Parse user intent from message"""
    msg_lower = message.lower()
    
    if any(word in msg_lower for word in ["analyze", "check", "score", "reputation", "look up"]):
        return "analyze"
    elif any(word in msg_lower for word in ["compare", "versus", "vs", "difference"]):
        return "compare"
    elif any(word in msg_lower for word in ["how", "what", "explain", "about"]):
        return "explain"
    else:
        return "general"

def extract_wallet(text: str) -> Optional[str]:
    """Extract Ethereum address from text"""
    pattern = r'0x[a-fA-F0-9]{40}'
    matches = re.findall(pattern, text)
    return matches[0] if matches else None

def extract_multiple_wallets(text: str) -> list[str]:
    """Extract multiple Ethereum addresses"""
    pattern = r'0x[a-fA-F0-9]{40}'
    return re.findall(pattern, text)

async def handle_analysis(ctx: Context, wallet: str, session_id: str) -> dict:
    """Request wallet analysis from orchestrator"""
    
    # Send request to orchestrator
    request_id = f"{session_id}_{wallet[:10]}"
    await ctx.send(ORCHESTRATOR_ADDRESS, ScoreRequest(
        wallet_address=wallet,
        request_id=request_id,
        requester=str(ctx.agent.address)  # FIXED: Added requester
    ))
    
    # Store pending request
    pending_requests[request_id] = {
        "wallet": wallet,
        "session_id": session_id,
        "timestamp": int(time.time())  # FIXED: Use time.time() instead of ctx.timestamp
    }
    
    return {
        "message": f"""🔍 **Analyzing wallet {wallet[:8]}...{wallet[-6:]}**

My AI agents are working on:
✓ Transaction history analysis
✓ DeFi protocol interactions
✓ Security posture check
✓ Social proof verification
✓ MeTTa reasoning engine

⏱️ This usually takes 10-15 seconds...""",
        "actions": ["analysis_started"],
        "data": {"wallet": wallet, "status": "pending"}
    }

@chat_protocol.on_message(model=ScoreAnalysis)
async def receive_analysis(ctx: Context, sender: str, msg: ScoreAnalysis):
    """Receive analysis results from orchestrator"""
    ctx.logger.info(f"📊 Received analysis for {msg.wallet_address}")
    
    # Find pending request
    request_id = None
    for rid, req in pending_requests.items():
        if req["wallet"] == msg.wallet_address:
            request_id = rid
            break
    
    if not request_id:
        ctx.logger.warning(f"No pending request found for {msg.wallet_address}")
        return
    
    request_data = pending_requests.pop(request_id)
    
    # Format response
    response_text = format_analysis_response(msg)
    
    # Log completion
    ctx.logger.info(f"✅ Analysis complete: {msg.score}/1000")

def format_analysis_response(analysis: ScoreAnalysis) -> str:
    """Format analysis as natural language"""
    
    score = analysis.score
    wallet = analysis.wallet_address
    
    # Determine rating
    if score >= 900:
        emoji = "🌟"
        rating = "exceptional"
        comment = "This wallet demonstrates outstanding on-chain behavior!"
    elif score >= 800:
        emoji = "⭐"
        rating = "excellent"
        comment = "This is a highly trusted wallet with strong reputation!"
    elif score >= 700:
        emoji = "👍"
        rating = "very good"
        comment = "This wallet shows solid, reliable activity!"
    elif score >= 600:
        emoji = "✅"
        rating = "good"
        comment = "This wallet has decent reputation with room to grow."
    elif score >= 400:
        emoji = "📊"
        rating = "moderate"
        comment = "This wallet shows some activity but could improve."
    else:
        emoji = "⚠️"
        rating = "developing"
        comment = "This wallet needs more on-chain activity to build trust."
    
    response = f"""{emoji} **Reputation Analysis Complete!**

**Wallet:** `{wallet[:8]}...{wallet[-6:]}`
**Score:** {score}/1000 ({rating})

{comment}

**📊 Detailed Breakdown:**
- Transaction Activity: {analysis.transaction_score}/100
- DeFi Engagement: {analysis.defi_score}/100
- Security Posture: {analysis.security_score}/100
- Social Proof: {analysis.social_score}/100

**🧠 MeTTa AI Reasoning:**
{analysis.reasoning_explanation}

**🎁 Reputation NFT:**
{'✅ Ready to mint on Hedera!' if score >= 400 else '❌ Score too low (need 400+)'}

---
💡 **Next Steps:**
- Mint your reputation NFT badge
- Compare with another wallet
- Share your score on social media
"""
    
    return response

def explain_system() -> dict:
    """Explain how Synthia works"""
    return {
        "message": """🎯 **Welcome to Synthia!**

I'm an AI-powered reputation system that combines cutting-edge technologies:

**🤖 ASI Alliance (Fetch.ai)**
- Multi-agent AI system with 5 specialized agents
- Natural language understanding via ASI:One
- Autonomous agent coordination

**🧠 MeTTa Knowledge Graphs (SingularityNET)**
- Symbolic reasoning for trust analysis
- Rule-based inference engine
- Explainable AI decisions

**⛓️ Hedera Blockchain**
- 3-second finality, $0.0001 transactions
- HCS (Consensus Service) for audit trails
- HTS (Token Service) for reputation NFTs
- Smart contracts for score storage

**How it works:**
1️⃣ You provide a wallet address
2️⃣ My agents analyze 5 dimensions
3️⃣ MeTTa reasoning engine applies trust rules
4️⃣ Score verified on Hedera blockchain
5️⃣ You get a soulbound NFT badge!

Try me! Say: "Analyze 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
""",
        "actions": ["system_explained"],
        "data": None
    }

async def handle_comparison(ctx: Context, wallets: list[str], session_id: str) -> dict:
    """Handle wallet comparison request"""
    
    # Request analysis for both wallets
    for wallet in wallets:
        request_id = f"{session_id}_{wallet[:10]}"
        await ctx.send(ORCHESTRATOR_ADDRESS, ScoreRequest(
            wallet_address=wallet,
            request_id=request_id,
            requester=str(ctx.agent.address)
        ))
    
    return {
        "message": f"""🔍 **Comparing wallets...**

**Wallet A:** `{wallets[0][:8]}...{wallets[0][-6:]}`
**Wallet B:** `{wallets[1][:8]}...{wallets[1][-6:]}`

My agents are analyzing both wallets across all dimensions.
This will take about 20-30 seconds...

⏱️ Analyzing transaction history...
⏱️ Checking DeFi protocols...
⏱️ Running security checks...
⏱️ Applying MeTTa reasoning...
""",
        "actions": ["comparison_started"],
        "data": {"wallets": wallets, "status": "pending"}
    }

# Include protocol
asi_one_agent.include(chat_protocol)

# Run agent
if __name__ == "__main__":
    print(f"""
🤖 ASI:ONE CHAT AGENT STARTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Address: {asi_one_agent.address}
🌐 Port: 8004
💬 Chat Protocol: Active

Ready to chat with humans! 🚀
    """)
    asi_one_agent.run()