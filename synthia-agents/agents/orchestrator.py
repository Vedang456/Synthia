"""
Synthia ASI Orchestrator Agent
Properly implements ASI-compatible uAgents following Fetch.ai patterns
"""

import asyncio
import os
from datetime import datetime
from typing import Dict, Any
from uagents import Agent, Context, Model, Protocol
from uagents.setup import fund_agent_if_low

# Define ASI-compatible message models
class ScoreRequest(Model):
    """ASI-compatible score request message"""
    user_address: str
    request_id: str
    timestamp: int
    source: str = "dashboard"

class ScoreAnalysis(Model):
    """ASI-compatible analysis result message"""
    user_address: str
    analysis_id: str
    reputation_score: int
    analysis_data: Dict[str, Any]
    agent_signature: str
    timestamp: int

class ScoreUpdate(Model):
    """ASI-compatible blockchain update message"""
    user_address: str
    score: int
    analysis_id: str
    transaction_hash: str
    verification_proof: Dict[str, Any]
    timestamp: int

class AgentStatus(Model):
    """ASI-compatible status message"""
    agent_address: str
    status: str
    metrics: Dict[str, Any]
    protocols: list
    timestamp: int

# Define ASI protocols
score_protocol = Protocol("synthia_score_protocol", version="1.0.0")
verification_protocol = Protocol("synthia_verification_protocol", version="1.0.0")

# Create the ASI Orchestrator Agent using proper decorator pattern
agent = Agent(
    name="synthia-orchestrator",
    seed=os.getenv("ORCHESTRATOR_SEED", "synthia-orchestrator-secret-seed"),
    port=8000,
    endpoint=["http://localhost:8000"]
)

# Include protocols
agent.include(score_protocol)
agent.include(verification_protocol)

# Agent state
agent_state = {
    "pending_requests": {},
    "active_analyses": set(),
    "metrics": {
        "total_requests": 0,
        "successful_updates": 0,
        "failed_updates": 0
    }
}

@agent.on_event("startup")
async def startup_handler(ctx: Context):
    """Initialize the orchestrator agent"""
    # Ensure agent has funds
    await fund_agent_if_low(ctx.address)


    print(f"🚀 Starting Synthia ASI Orchestrator: {ctx.agent.address}")
    print("📡 Endpoint:", agent.endpoint)

    # Register with Almanac for ASI compatibility
    try:
        # This would register the agent with the Fetch.ai Almanac
        print("📋 Registering with Fetch.ai Almanac...")
        # Almanac registration would happen here in production
    except Exception as e:
        print(f"⚠️ Almanac registration failed: {e}")

    print("✅ ASI Orchestrator ready for ASI operations")

@agent.on_message(model=ScoreRequest)
async def handle_score_request(ctx: Context, sender: str, msg: ScoreRequest):
    """Handle ASI-compatible score requests"""
    print(f"📨 ASI Score request: {msg.user_address} from {sender}")

    agent_state["metrics"]["total_requests"] += 1
    agent_state["pending_requests"][msg.request_id] = {
        "user_address": msg.user_address,
        "timestamp": msg.timestamp,
        "source": msg.source
    }

    try:
        # In ASI-compatible implementation, we would:
        # 1. Query Almanac for wallet analyzer agent
        # 2. Send request through proper ASI channels
        # 3. Wait for response via ASI protocols

        # For now, simulate ASI workflow
        print("🔄 Processing via ASI protocols...")

        # Simulate forwarding to wallet analyzer (in real ASI, this uses Almanac)
        wallet_analyzer_address = os.getenv("WALLET_ANALYZER_ADDRESS")

        if wallet_analyzer_address:
            # Send to wallet analyzer via Almanac routing
            await ctx.send(wallet_analyzer_address, msg)
            print(f"📤 Forwarded to wallet analyzer: {wallet_analyzer_address}")
        else:
            print("⚠️ Wallet analyzer address not configured")

        # Send immediate acknowledgment
        status = AgentStatus(
            agent_address=ctx.agent.address,
            status="processing",
            metrics=agent_state["metrics"],
            protocols=["score_protocol", "verification_protocol"],
            timestamp=int(datetime.now().timestamp())
        )

        await ctx.send(sender, status)

    except Exception as e:
        print(f"❌ Score request handling failed: {e}")
        agent_state["metrics"]["failed_updates"] += 1

@agent.on_message(model=ScoreAnalysis)
async def handle_score_analysis(ctx: Context, sender: str, msg: ScoreAnalysis):
    """Handle ASI-compatible analysis results"""
    print(f"📊 ASI Analysis received: {msg.user_address} -> {msg.reputation_score}")

    # Mark analysis as active
    agent_state["active_analyses"].add(msg.analysis_id)

    try:
        # Forward to blockchain agent for execution
        blockchain_agent_address = os.getenv("BLOCKCHAIN_AGENT_ADDRESS")

        if blockchain_agent_address:
            await ctx.send(blockchain_agent_address, msg)
            print(f"📤 Forwarded to blockchain agent: {blockchain_agent_address}")
        else:
            print("⚠️ Blockchain agent address not configured")

    except Exception as e:
        print(f"❌ Analysis forwarding failed: {e}")

@agent.on_message(model=ScoreUpdate)
async def handle_score_update(ctx: Context, sender: str, msg: ScoreUpdate):
    """Handle ASI-compatible blockchain updates"""
    print(f"✅ ASI Score update confirmed: {msg.transaction_hash}")

    agent_state["metrics"]["successful_updates"] += 1
    agent_state["active_analyses"].discard(msg.analysis_id)

    # Clean up pending request
    for req_id, req_data in list(agent_state["pending_requests"].items()):
        if req_data["user_address"] == msg.user_address:
            del agent_state["pending_requests"][req_id]
            break

@agent.on_interval(period=300.0)  # Every 5 minutes
async def health_check(ctx: Context):
    """ASI-compatible health monitoring"""
    print("💚 ASI Health check - operational")

    # Clean up old pending requests (older than 1 hour)
    current_time = datetime.now().timestamp()
    to_remove = []

    for req_id, req_data in agent_state["pending_requests"].items():
        if current_time - req_data["timestamp"] > 3600:  # 1 hour
            to_remove.append(req_id)

    for req_id in to_remove:
        del agent_state["pending_requests"][req_id]
        print(f"🧹 Cleaned up stale request: {req_id}")

@agent.on_rest_get("/status", response=AgentStatus)
async def handle_status_get(ctx: Context):
    """Handle GET requests to /status endpoint"""
    return AgentStatus(
        agent_address=ctx.agent.address,
        status="active",
        metrics=agent_state["metrics"],
        protocols=["score_protocol", "verification_protocol"],
        timestamp=int(datetime.now().timestamp())
    )

# Remove the deprecated on_query handler

# Add protocol message handlers
@score_protocol.on_message(model=ScoreRequest)
async def score_protocol_handler(ctx: Context, sender: str, msg: ScoreRequest):
    """Handle score protocol messages"""
    await handle_score_request(ctx, sender, msg)

@verification_protocol.on_message(model=AgentStatus)
async def verification_protocol_handler(ctx: Context, sender: str, msg: AgentStatus):
    """Handle verification protocol messages"""
    status = AgentStatus(
        agent_address=ctx.agent.address,
        status="active",
        metrics=agent_state["metrics"],
        protocols=["score_protocol", "verification_protocol"],
        timestamp=int(datetime.now().timestamp())
    )

    await ctx.send(sender, status)
    print(f"📊 Status requested by: {sender}")

def run():
    """Run the orchestrator agent"""
    try:
        agent.run()
    except KeyboardInterrupt:
        print("\n🛑 ASI Orchestrator shutting down...")
    except Exception as e:
        print(f"❌ ASI Orchestrator failed: {e}")
        raise

if __name__ == "__main__":
    run()
