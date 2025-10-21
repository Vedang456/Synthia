# FILE: wallet_analyzer.py
# Integrated version with embedded MeTTa reasoning for Agentverse

from uagents import Agent, Context, Model, Protocol
from messages import ScoreRequest, ScoreAnalysis
import os
import time
from typing import Optional, Dict, List, Any
from dataclasses import dataclass

# ============= EMBEDDED METTA REASONING ENGINE =============
@dataclass
class MeTTaRule:
    name: str
    description: str
    conditions: List[str]
    conclusions: List[str]
    priority: int

class MeTTaReasoningEngine:
    """
    Embedded MeTTa Knowledge Graph Engine
    """
    
    def __init__(self):
        self.rules: List[MeTTaRule] = []
        self.facts: Dict[str, Any] = {}
        self.initialize_rules()
    
    def initialize_rules(self):
        """Initialize reputation reasoning rules"""
        
        # RULE 1: Elite DeFi User
        self.rules.append(MeTTaRule(
            name="elite_defi_user",
            description="Identifies power users in DeFi ecosystem",
            conditions=[
                "defi_protocols >= 10",
                "defi_tvl > 100000",
                "defi_consistency > 0.8"
            ],
            conclusions=[
                "user_type = EliteDeFiUser",
                "score_bonus = +100",
                "trust_level = VeryHigh",
                "recommendation = Premier DeFi participant with extensive protocol experience"
            ],
            priority=10
        ))
        
        # RULE 2: Excellent Reputation
        self.rules.append(MeTTaRule(
            name="excellent_reputation",
            description="High overall reputation across all dimensions",
            conditions=[
                "score > 800",
                "wallet_age_days > 365",
                "security_incidents == 0",
                "failed_tx_ratio < 0.05"
            ],
            conclusions=[
                "reputation_level = Excellent",
                "score_bonus = +50",
                "recommendation = Highly trusted wallet with long-term reliability"
            ],
            priority=9
        ))
        
        # RULE 3: Security Risk Detection
        self.rules.append(MeTTaRule(
            name="security_risk",
            description="Detects potential security concerns",
            conditions=[
                "failed_tx_ratio > 0.3",
                "scam_interactions > 0"
            ],
            conclusions=[
                "risk_level = High",
                "score_penalty = -200",
                "warning = Suspicious activity detected",
                "recommendation = Exercise extreme caution"
            ],
            priority=10
        ))
        
        # RULE 4: Social Proof Verified
        self.rules.append(MeTTaRule(
            name="social_proof_verified",
            description="Strong social verification signals",
            conditions=[
                "has_ens == True",
                "github_verified == True",
                "social_score > 80"
            ],
            conclusions=[
                "social_tier = Verified",
                "score_bonus = +40",
                "recommendation = Socially verified identity adds trust"
            ],
            priority=7
        ))
        
        # RULE 5: Emerging User
        self.rules.append(MeTTaRule(
            name="emerging_user",
            description="New but promising wallet",
            conditions=[
                "wallet_age_days < 90",
                "transaction_count >= 20",
                "transaction_count < 100",
                "score >= 400",
                "security_incidents == 0"
            ],
            conclusions=[
                "user_type = EmergingUser",
                "reputation_level = Moderate",
                "recommendation = Promising new wallet showing good early behavior"
            ],
            priority=5
        ))
        
        # Additional rules (6-10) continue...
        self.rules.extend([
            MeTTaRule(
                name="old_wallet_bonus",
                description="Rewards long-term existence",
                conditions=["wallet_age_days > 730"],
                conclusions=[
                    "age_tier = Veteran",
                    "score_bonus = +30",
                    "recommendation = Long-term wallet presence indicates stability"
                ],
                priority=6
            ),
            MeTTaRule(
                name="high_volume_trader",
                description="Active trading behavior",
                conditions=["transaction_count > 500", "avg_tx_value > 1000"],
                conclusions=[
                    "activity_tier = HighVolume",
                    "score_bonus = +25",
                    "recommendation = Active participant with substantial transaction history"
                ],
                priority=6
            ),
            MeTTaRule(
                name="nft_collector",
                description="Active in NFT ecosystem",
                conditions=["nft_count > 50", "nft_collections > 10"],
                conclusions=[
                    "collector_tier = NFTEnthusiast",
                    "score_bonus = +20",
                    "recommendation = Active NFT collector with diverse portfolio"
                ],
                priority=5
            ),
            MeTTaRule(
                name="low_activity",
                description="Insufficient on-chain activity",
                conditions=["transaction_count < 10", "wallet_age_days > 180"],
                conclusions=[
                    "activity_level = Low",
                    "score_penalty = -50",
                    "warning = Insufficient activity for reliable assessment",
                    "recommendation = Increase on-chain engagement to build reputation"
                ],
                priority=7
            ),
            MeTTaRule(
                name="diverse_interactions",
                description="Interacts with many quality contracts",
                conditions=["unique_contracts > 25", "contract_quality_avg > 0.7"],
                conclusions=[
                    "interaction_tier = Diverse",
                    "score_bonus = +35",
                    "recommendation = Engages with wide variety of quality protocols"
                ],
                priority=6
            )
        ])
    
    def evaluate_condition(self, condition: str, wallet_data: Dict) -> bool:
        """Evaluate a single condition"""
        try:
            for op in [" >= ", " <= ", " > ", " < ", " == ", " != "]:
                if op in condition:
                    left, right = condition.split(op)
                    left = left.strip()
                    right = right.strip()
                    
                    left_val = wallet_data.get(left, 0)
                    
                    if right in ["True", "False"]:
                        right_val = (right == "True")
                    else:
                        try:
                            right_val = float(right)
                        except:
                            right_val = right
                    
                    op = op.strip()
                    if op == ">=": return left_val >= right_val
                    elif op == "<=": return left_val <= right_val
                    elif op == ">": return left_val > right_val
                    elif op == "<": return left_val < right_val
                    elif op == "==": return left_val == right_val
                    elif op == "!=": return left_val != right_val
            
            return False
        except:
            return False
    
    def reason(self, wallet_data: Dict) -> Dict:
        """Apply MeTTa reasoning to wallet data"""
        
        sorted_rules = sorted(self.rules, key=lambda r: r.priority, reverse=True)
        
        results = {
            "timestamp": int(time.time()),
            "wallet": wallet_data.get('wallet_address', 'unknown'),
            "base_score": wallet_data.get('score', 0),
            "applied_rules": [],
            "rule_details": [],
            "conclusions": {},
            "score_adjustments": 0,
            "bonuses": [],
            "penalties": [],
            "warnings": [],
            "recommendations": [],
            "final_score": 0,
            "reputation_level": "Unknown",
            "trust_signals": []
        }
        
        for rule in sorted_rules:
            conditions_met = all(
                self.evaluate_condition(cond, wallet_data)
                for cond in rule.conditions
            )
            
            if conditions_met:
                results["applied_rules"].append(rule.name)
                results["rule_details"].append({
                    "name": rule.name,
                    "description": rule.description,
                    "priority": rule.priority
                })
                
                for conclusion in rule.conclusions:
                    if " = " in conclusion:
                        key, value = conclusion.split(" = ", 1)
                        key = key.strip()
                        value = value.strip()
                        
                        if key == "score_bonus":
                            bonus = int(value.replace("+", ""))
                            results["score_adjustments"] += bonus
                            results["bonuses"].append({
                                "rule": rule.name,
                                "amount": bonus,
                                "reason": rule.description
                            })
                        elif key == "score_penalty":
                            penalty = int(value)
                            results["score_adjustments"] += penalty
                            results["penalties"].append({
                                "rule": rule.name,
                                "amount": penalty,
                                "reason": rule.description
                            })
                        elif key == "recommendation":
                            results["recommendations"].append(value)
                        elif key == "warning":
                            results["warnings"].append(value)
                        elif key == "trust_level":
                            results["trust_signals"].append(value)
                        else:
                            results["conclusions"][key] = value
        
        final_score = max(0, min(1000, results["base_score"] + results["score_adjustments"]))
        results["final_score"] = final_score
        
        if final_score >= 900:
            results["reputation_level"] = "Exceptional"
        elif final_score >= 800:
            results["reputation_level"] = "Excellent"
        elif final_score >= 700:
            results["reputation_level"] = "Very Good"
        elif final_score >= 600:
            results["reputation_level"] = "Good"
        elif final_score >= 400:
            results["reputation_level"] = "Moderate"
        else:
            results["reputation_level"] = "Developing"
        
        return results
    
    def generate_explanation(self, results: Dict) -> str:
        """Generate human-readable explanation"""
        
        explanation = f"""MeTTa Symbolic Reasoning Analysis
Wallet: {results['wallet'][:10]}...
Base Score: {results['base_score']}/1000
Adjustments: {results['score_adjustments']:+d} points
Final Score: {results['final_score']}/1000
Reputation Level: {results['reputation_level']}

Applied Rules ({len(results['applied_rules'])}):\n"""
        
        for rule_detail in results['rule_details']:
            explanation += f"- {rule_detail['name']} (Priority {rule_detail['priority']}): {rule_detail['description']}\n"
        
        if results['bonuses']:
            explanation += f"\nScore Bonuses:\n"
            for bonus in results['bonuses']:
                explanation += f"- +{bonus['amount']} points: {bonus['reason']}\n"
        
        if results['penalties']:
            explanation += f"\nScore Penalties:\n"
            for penalty in results['penalties']:
                explanation += f"- {penalty['amount']} points: {penalty['reason']}\n"
        
        if results['warnings']:
            explanation += f"\nWarnings:\n"
            for warning in results['warnings']:
                explanation += f"- {warning}\n"
        
        if results['recommendations']:
            explanation += f"\nRecommendations:\n"
            for rec in results['recommendations']:
                explanation += f"- {rec}\n"
        
        explanation += f"\nSummary: Applied {len(results['applied_rules'])} rules out of {len(self.rules)} total rules."
        
        return explanation

# Initialize MeTTa engine
metta_engine = MeTTaReasoningEngine()

# ============= WALLET ANALYZER AGENT =============
class WalletAnalyzer:
    """
    Wallet Analyzer Agent with Embedded MeTTa Reasoning
    """
    
    def __init__(self):
        self.agent = Agent(
            name="synthia_wallet_analyzer",
            seed=os.getenv("ANALYZER_SEED", "analyzer_seed_default"),
            port=8001
        )
        
        # Add mailbox if configured
        mailbox_key = os.getenv("WALLET_ANALYZER_MAILBOX_KEY")
        if mailbox_key:
            self.agent.mailbox = f"{mailbox_key}@https://agentverse.ai"
        
        self.setup_protocols()
    
    def setup_protocols(self):
        """Setup analyzer protocols"""
        
        analysis_protocol = Protocol("WalletAnalysis")
        
        @analysis_protocol.on_message(model=ScoreRequest)
        async def analyze_wallet_with_metta(ctx: Context, sender: str, msg: ScoreRequest):
            """Enhanced wallet analysis with MeTTa reasoning"""
            
            ctx.logger.info(f"🔍 Analyzing {msg.wallet_address} with MeTTa reasoning")
            
            # Step 1: Perform analysis
            raw_analysis = await perform_analysis(ctx, msg.wallet_address)
            
            # Step 2: Apply MeTTa reasoning
            metta_results = metta_engine.reason(raw_analysis)
            
            # Step 3: Generate explanation
            reasoning_explanation = metta_engine.generate_explanation(metta_results)
            
            # Step 4: Combine results
            final_analysis = ScoreAnalysis(
                request_id=msg.request_id,
                wallet_address=msg.wallet_address,
                score=metta_results["final_score"],
                analyzer_id=str(ctx.agent.address),
                transaction_score=raw_analysis["transaction_score"],
                defi_score=raw_analysis["defi_score"],
                security_score=raw_analysis["security_score"],
                social_score=raw_analysis["social_score"],
                reputation_level=metta_results["reputation_level"],
                reasoning_explanation=reasoning_explanation,
                metta_rules_applied=metta_results["applied_rules"],
                score_adjustments=metta_results["score_adjustments"],
                analysis_data=raw_analysis,
                timestamp=int(time.time())
            )
            
            # Step 5: Send to orchestrator
            await ctx.send(sender, final_analysis)
            
            ctx.logger.info(f"✅ Analysis complete: {final_analysis.score}/1000 ({final_analysis.reputation_level})")
        
        async def perform_analysis(ctx: Context, wallet_address: str) -> dict:
            """
            Perform comprehensive wallet analysis
            """
            
            ctx.logger.info(f"📊 Fetching on-chain data for {wallet_address}")
            
            # Mock analysis for demo - replace with real blockchain data
            # In production, integrate with Etherscan, Covalent, etc.
            
            # Generate varied data based on wallet address hash
            import hashlib
            addr_hash = int(hashlib.md5(wallet_address.encode()).hexdigest()[:8], 16)
            
            # Use hash to generate deterministic but varied mock data
            base_score = 400 + (addr_hash % 400)  # 400-800 range
            tx_count = 10 + (addr_hash % 500)
            
            raw_analysis = {
                "wallet_address": wallet_address,
                "score": base_score,
                
                # Transaction metrics
                "transaction_count": tx_count,
                "transaction_score": 50 + (addr_hash % 50),
                "avg_tx_value": 500 + (addr_hash % 3000),
                "failed_tx_ratio": (addr_hash % 20) / 100.0,
                
                # DeFi metrics
                "defi_protocols": addr_hash % 15,
                "defi_score": 40 + (addr_hash % 60),
                "defi_tvl": 10000 + (addr_hash % 200000),
                "defi_consistency": 0.5 + ((addr_hash % 50) / 100.0),
                
                # Security metrics
                "security_score": 60 + (addr_hash % 40),
                "security_incidents": 0 if addr_hash % 10 > 2 else 1,
                "scam_interactions": 0 if addr_hash % 20 > 1 else 1,
                
                # Social metrics
                "social_score": 30 + (addr_hash % 70),
                "has_ens": addr_hash % 3 > 0,
                "github_verified": addr_hash % 4 > 1,
                
                # Wallet age
                "wallet_age_days": 30 + (addr_hash % 1000),
                
                # Contract interactions
                "unique_contracts": 5 + (addr_hash % 50),
                "contract_quality_avg": 0.5 + ((addr_hash % 40) / 100.0),
                
                # NFT activity
                "nft_count": addr_hash % 100,
                "nft_collections": addr_hash % 30,
            }
            
            return raw_analysis
        
        self.agent.include(analysis_protocol, publish_manifest=True)
    
    def run(self):
        """Start the analyzer agent"""
        print(f"""
╔═══════════════════════════════════════════╗
║     SYNTHIA WALLET ANALYZER v2.0         ║
╚═══════════════════════════════════════════╝

🔍 AGENT INITIALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Address: {self.agent.address}
🌐 Port: 8001
🧠 MeTTa: Enabled (10 reasoning rules)
⚙️ Mode: {'Production' if os.getenv('ORCHESTRATOR_ADDRESS') else 'Standalone'}

📊 ANALYSIS CAPABILITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Transaction Pattern Analysis
✅ DeFi Protocol Participation
✅ Security Posture Evaluation
✅ Social Proof Verification
✅ MeTTa Symbolic Reasoning
✅ Explainable AI Decisions

Ready to analyze wallet reputations! 🚀
        """)
        self.agent.run()

if __name__ == "__main__":
    analyzer = WalletAnalyzer()
    analyzer.run()