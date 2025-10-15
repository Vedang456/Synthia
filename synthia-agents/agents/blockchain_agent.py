"""
Synthia ASI Blockchain Agent
ASI-compatible agent for blockchain interactions and MetaMask integration
"""

import asyncio
import os
from datetime import datetime
from typing import Dict, Any
from uagents import Agent, Context, Model, Protocol
from uagents.setup import fund_agent_if_low

# Import ASI-compatible message models
class ScoreAnalysis(Model):
    user_address: str
    analysis_id: str
    reputation_score: int
    analysis_data: Dict[str, Any]
    agent_signature: str
    timestamp: int

class ScoreUpdate(Model):
    user_address: str
    score: int
    analysis_id: str
    transaction_hash: str
    verification_proof: Dict[str, Any]
    timestamp: int

class AgentStatus(Model):
    agent_address: str
    status: str
    metrics: Dict[str, Any]
    protocols: list
    timestamp: int

# Define ASI protocols
score_protocol = Protocol("synthia_score_protocol", version="1.0.0")
verification_protocol = Protocol("synthia_verification_protocol", version="1.0.0")

# Create ASI Blockchain Agent
blockchain_agent = Agent(
    name="synthia-blockchain-agent",
    seed=os.getenv("BLOCKCHAIN_AGENT_SEED", "synthia-blockchain-agent-secret-seed"),
    port=8002,
    endpoint=["http://localhost:8002"]
)

# Include protocols
blockchain_agent.include(score_protocol)
blockchain_agent.include(verification_protocol)

# Blockchain configuration
CONTRACT_ADDRESS = os.getenv("SYNTHIA_CONTRACT_ADDRESS", "")
RPC_URL = os.getenv("RPC_URL", "https://sepolia.infura.io/v3/YOUR_INFURA_KEY")

# Agent state
blockchain_state = {
    "transactions_sent": 0,
    "successful_updates": 0,
    "failed_updates": 0,
    "metrics": {
        "total_transactions": 0,
        "success_rate": 0.0,
        "gas_used": 0
    }
}

@blockchain_agent.on_event("startup")
async def blockchain_startup(ctx: Context):
    """Initialize ASI blockchain agent"""
    print("⛓️ ASI Blockchain Agent starting up...")
    print(f"📍 Agent Address: {ctx.agent.address}")

    # Try to ensure agent has funds for blockchain operations
    try:
        await fund_agent_if_low(ctx.address)

        print("✅ Agent funding successful")
    except Exception as e:
        print(f"⚠️ Agent funding failed (continuing anyway): {e}")

    print("✅ ASI Blockchain Agent ready")

    # Verify contract address is configured
    if not CONTRACT_ADDRESS or CONTRACT_ADDRESS == "0x0000000000000000000000000000000000000000":
        print("❌ Contract address not configured")
        return

    print("✅ ASI Blockchain Agent ready for blockchain operations")

@blockchain_agent.on_message(model=ScoreAnalysis)
async def handle_blockchain_update(ctx: Context, sender: str, msg: ScoreAnalysis):
    """Handle ASI-compatible blockchain score updates"""
    print(f"⛓️ ASI Blockchain update request: {msg.user_address} -> {msg.reputation_score}")

    blockchain_state["transactions_sent"] += 1

    try:
        # Execute ASI-compatible blockchain transaction
        tx_hash = await execute_asi_blockchain_update(ctx, msg.user_address, msg.reputation_score)

        # Create ASI-compatible update confirmation
        update = ScoreUpdate(
            user_address=msg.user_address,
            score=msg.reputation_score,
            analysis_id=msg.analysis_id,
            transaction_hash=tx_hash,
            verification_proof=generate_asi_verification_proof(msg, tx_hash),
            timestamp=int(datetime.now().timestamp())
        )

        # Send confirmation back through ASI protocols
        await ctx.send(sender, update)

        blockchain_state["successful_updates"] += 1
        blockchain_state["metrics"]["total_transactions"] += 1

        # Update success rate
        total = blockchain_state["successful_updates"] + blockchain_state["failed_updates"]
        blockchain_state["metrics"]["success_rate"] = (
            blockchain_state["successful_updates"] / total * 100 if total > 0 else 0
        )

        ctx.logger.info(f"✅ ASI Blockchain update complete: {tx_hash}")

    except Exception as e:
        ctx.logger.error(f"❌ ASI Blockchain update failed: {e}")
        blockchain_state["failed_updates"] += 1

@blockchain_agent.on_interval(period=300.0)  # Every 5 minutes
async def blockchain_health_check(ctx: Context):
    """ASI-compatible blockchain health monitoring"""
    ctx.logger.info("💚 ASI Blockchain health check")

    success_rate = blockchain_state["metrics"]["success_rate"]
    ctx.logger.info(f"📊 Success rate: {success_rate:.1f}% ({blockchain_state['successful_updates']}/{blockchain_state['transactions_sent']})")

async def execute_asi_blockchain_update(ctx: Context, user_address: str, score: int) -> str:
    """Execute ASI-compatible blockchain transaction"""

    # In a real implementation, this would:
    # 1. Use the agent's wallet to sign transactions
    # 2. Interact with the Synthia smart contract
    # 3. Handle MetaMask integration for user approval
    # 4. Wait for blockchain confirmation

    # For demo purposes, simulate blockchain interaction
    import hashlib

    # Simulate transaction hash generation
    tx_data = f"{user_address}_{score}_{datetime.now().timestamp()}"
    tx_hash = hashlib.sha256(tx_data.encode()).hexdigest()

    # Simulate blockchain delay
    await asyncio.sleep(2)

    # Simulate gas usage tracking
    blockchain_state["metrics"]["gas_used"] += 21000  # Standard ETH tx gas

    return f"0x{tx_hash[:64]}"  # Return mock transaction hash

def generate_asi_verification_proof(analysis: ScoreAnalysis, tx_hash: str) -> Dict[str, Any]:
    """Generate ASI-compatible verification proof"""
    proof_data = {
        "analysis_id": analysis.analysis_id,
        "user_address": analysis.user_address,
        "score": analysis.reputation_score,
        "transaction_hash": tx_hash,
        "agent_address": blockchain_agent.address,
        "timestamp": analysis.timestamp,
        "blockchain_verified": True
    }

    # In production, this would create proper cryptographic proofs
    import hashlib
    proof_hash = hashlib.sha256(str(proof_data).encode()).hexdigest()

    return {
        "proof_type": "asi_blockchain_signature",
        "proof_hash": proof_hash,
        "blockchain_agent": blockchain_agent.address,
        "verification_timestamp": int(datetime.now().timestamp()),
        "asi_compatible": True
    }

def run():
    """Run the blockchain agent"""
    try:
        blockchain_agent.run()
    except KeyboardInterrupt:
        print("\n🛑 ASI Blockchain Agent shutting down...")
    except Exception as e:
        print(f"❌ ASI Blockchain Agent failed: {e}")
        raise

if __name__ == "__main__":
    run()
