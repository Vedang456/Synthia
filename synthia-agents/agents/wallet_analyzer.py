"""
Synthia ASI Wallet Analyzer Agent
ASI-compatible agent for wallet analysis and reputation scoring
"""

import asyncio
import os
import hashlib
from datetime import datetime
from typing import Dict, Any
from uagents import Agent, Context, Model, Protocol
from uagents.setup import fund_agent_if_low

# Import message models from orchestrator (ASI-compatible)
class ScoreRequest(Model):
    user_address: str
    request_id: str
    timestamp: int
    source: str = "dashboard"

class ScoreAnalysis(Model):
    user_address: str
    analysis_id: str
    reputation_score: int
    analysis_data: Dict[str, Any]
    agent_signature: str
    timestamp: int

class AgentStatus(Model):
    agent_address: str
    status: str
    metrics: Dict[str, Any]
    protocols: list
    timestamp: int

# Define ASI protocols (must match orchestrator)
score_protocol = Protocol("synthia_score_protocol", version="1.0.0")
verification_protocol = Protocol("synthia_verification_protocol", version="1.0.0")

# Create ASI Wallet Analyzer Agent
wallet_analyzer = Agent(
    name="synthia-wallet-analyzer",
    seed=os.getenv("WALLET_ANALYZER_SEED", "synthia-wallet-analyzer-secret-seed"),
    port=8001,
    endpoint=["http://localhost:8001"]
)

# Include protocols
wallet_analyzer.include(score_protocol)
wallet_analyzer.include(verification_protocol)

# Agent state for ASI operations
analyzer_state = {
    "analyses_performed": 0,
    "cache": {},
    "metrics": {
        "total_analyses": 0,
        "cache_hits": 0,
        "cache_size": 0
    }
}

@wallet_analyzer.on_event("startup")
async def analyzer_startup(ctx: Context):
    """Initialize ASI wallet analyzer"""
    ctx.logger.info("🔍 ASI Wallet Analyzer starting up...")
    ctx.logger.info(f"📍 Agent Address: {ctx.agent.address}")

    # Ensure agent has funds for ASI operations
    await fund_agent_if_low(ctx.wallet.address())

    ctx.logger.info("✅ ASI Wallet Analyzer ready")

@wallet_analyzer.on_message(model=ScoreRequest)
async def handle_analysis_request(ctx: Context, sender: str, msg: ScoreRequest):
    """Handle ASI-compatible wallet analysis requests"""
    ctx.logger.info(f"🔍 ASI Analysis request: {msg.user_address}")

    try:
        # Perform ASI-compatible wallet analysis
        analysis_result = await perform_asi_wallet_analysis(ctx, msg.user_address)

        # Create ASI-compatible analysis response
        analysis = ScoreAnalysis(
            user_address=msg.user_address,
            analysis_id=analysis_result["analysis_id"],
            reputation_score=analysis_result["score"],
            analysis_data=analysis_result["data"],
            agent_signature=sign_asi_analysis(analysis_result),
            timestamp=int(datetime.now().timestamp())
        )

        # Send back through ASI protocols
        await ctx.send(sender, analysis)

        analyzer_state["analyses_performed"] += 1
        analyzer_state["metrics"]["total_analyses"] += 1

        ctx.logger.info(f"✅ ASI Analysis complete: {msg.user_address} -> {analysis.reputation_score}")

    except Exception as e:
        ctx.logger.error(f"❌ ASI Analysis failed: {e}")

@wallet_analyzer.on_interval(period=600.0)  # Every 10 minutes
async def cleanup_cache(ctx: Context):
    """Clean up old analysis cache"""
    current_time = datetime.now().timestamp()

    # Remove entries older than 1 hour
    to_remove = []
    for address, data in analyzer_state["cache"].items():
        if current_time - data["timestamp"] > 3600:
            to_remove.append(address)

    for address in to_remove:
        del analyzer_state["cache"][address]
        ctx.logger.info(f"🧹 Cleaned cache for: {address}")

    analyzer_state["metrics"]["cache_size"] = len(analyzer_state["cache"])

async def perform_asi_wallet_analysis(ctx: Context, address: str) -> Dict[str, Any]:
    """Perform ASI-compatible comprehensive wallet analysis"""

    # Check cache first (ASI optimization)
    if address in analyzer_state["cache"]:
        cached = analyzer_state["cache"][address]
        if datetime.now().timestamp() - cached["timestamp"] < 300:  # 5 minutes
            analyzer_state["metrics"]["cache_hits"] += 1
            ctx.logger.info(f"📋 Using cached ASI analysis for {address}")
            return cached

    # Generate unique ASI analysis ID
    analysis_id = f"asi_analysis_{address}_{int(datetime.now().timestamp())}"

    # Perform multi-dimensional ASI analysis
    analysis_data = {
        "transaction_metrics": await analyze_transaction_activity(address),
        "contract_interactions": await analyze_contract_interactions(address),
        "defi_activity": await analyze_defi_activity(address),
        "security_score": await calculate_security_score(address),
        "social_activity": await analyze_social_activity(address)
    }

    # Calculate ASI reputation score
    reputation_score = calculate_asi_reputation_score(analysis_data)

    result = {
        "analysis_id": analysis_id,
        "address": address,
        "score": reputation_score,
        "data": analysis_data,
        "timestamp": datetime.now().timestamp()
    }

    # Cache the result (ASI optimization)
    analyzer_state["cache"][address] = result
    analyzer_state["metrics"]["cache_size"] = len(analyzer_state["cache"])

    return result

async def analyze_transaction_activity(address: str) -> Dict[str, Any]:
    """Analyze transaction patterns (ASI-compatible)"""
    # This would integrate with blockchain APIs
    # For demo, return mock ASI-compatible data
    return {
        "transaction_count": 150,
        "total_value_transferred": "2.5",
        "unique_counterparties": 45,
        "average_tx_value": "0.016",
        "activity_score": 750
    }

async def analyze_contract_interactions(address: str) -> Dict[str, Any]:
    """Analyze smart contract interactions (ASI-compatible)"""
    return {
        "unique_contracts": 25,
        "defi_contracts": 12,
        "nft_contracts": 3,
        "dex_interactions": 8,
        "lending_protocols": 4,
        "contract_diversity_score": 680
    }

async def analyze_defi_activity(address: str) -> Dict[str, Any]:
    """Analyze DeFi participation (ASI-compatible)"""
    return {
        "total_value_locked": "1.2",
        "protocols_used": 5,
        "yield_farming": True,
        "liquidity_provided": True,
        "staking_positions": 2,
        "defi_score": 720
    }

async def analyze_social_activity(address: str) -> Dict[str, Any]:
    """Analyze social/web3 presence (ASI-compatible)"""
    return {
        "ens_name": None,
        "social_profiles": 0,
        "github_activity": False,
        "forum_participation": False,
        "social_score": 500
    }

async def calculate_security_score(address: str) -> int:
    """Calculate security assessment (ASI-compatible)"""
    # This would use security APIs and analysis
    return 750

def calculate_asi_reputation_score(data: Dict[str, Any]) -> int:
    """Calculate ASI-compatible reputation score"""
    # Multi-factor scoring algorithm
    weights = {
        "transaction_activity": 0.25,
        "contract_interactions": 0.25,
        "defi_engagement": 0.20,
        "social_proof": 0.15,
        "security_score": 0.15
    }

    score = 0

    # Transaction activity score (0-250 points)
    tx_score = min(data["transaction_metrics"]["activity_score"] // 3, 250)
    score += tx_score * weights["transaction_activity"]

    # Contract diversity score (0-250 points)
    contract_score = min(data["contract_interactions"]["contract_diversity_score"] // 3, 250)
    score += contract_score * weights["contract_interactions"]

    # DeFi engagement score (0-200 points)
    defi_score = min(data["defi_activity"]["defi_score"] // 4, 200)
    score += defi_score * weights["defi_engagement"]

    # Social proof score (0-150 points)
    social_score = min(data["social_activity"]["social_score"] // 3, 150)
    score += social_score * weights["social_proof"]

    # Security score (0-150 points)
    security_score = min(data["security_score"] // 5, 150)
    score += security_score * weights["security_score"]

    return min(int(score), 1000)

def sign_asi_analysis(analysis: Dict[str, Any]) -> str:
    """Sign analysis with ASI agent credentials"""
    # In production, this would use proper cryptographic signing
    analysis_str = f"{analysis['analysis_id']}_{analysis['address']}_{analysis['score']}"
    signature = hashlib.sha256(analysis_str.encode()).hexdigest()
    return f"asi_signature_{signature[:16]}"

async def main():
    """Main entry point for ASI wallet analyzer"""
    print("🚀 Starting Synthia ASI Wallet Analyzer...")

    try:
        await wallet_analyzer.run()
    except KeyboardInterrupt:
        print("🛑 ASI Wallet Analyzer shutting down...")
    except Exception as e:
        print(f"❌ ASI Wallet Analyzer failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
