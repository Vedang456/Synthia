# FILE: agents/hedera_services_integration.py

from hedera import (
    Client, 
    TopicCreateTransaction, 
    TopicMessageSubmitTransaction,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    TokenMintTransaction,
    AccountId
)
import json
import time
import os

class HederaServicesIntegration:
    """
    Full Hedera services integration:
    - HCS (Consensus Service) for audit trails
    - HTS (Token Service) for reputation tokens
    - EVM Smart Contracts for score storage
    """
    
    def __init__(self):
        self.client = Client.forTestnet()
        self.client.setOperator(
            AccountId.fromString(os.getenv("HEDERA_ACCOUNT_ID")),
            os.getenv("HEDERA_PRIVATE_KEY")
        )
        
        # Will be populated after initialization
        self.audit_topic_id = None
        self.reputation_token_id = None
        self._initialized = False
        
    async def ensure_initialized(self):
        """Ensure Hedera services are initialized"""
        if not self._initialized:
            await self.initialize_services()
            self._initialized = True
        
    async def initialize_services(self):
        """Initialize Hedera services"""
        
        # Check if already have topic/token IDs from environment
        self.audit_topic_id = os.getenv("HCS_AUDIT_TOPIC_ID")
        self.reputation_token_id = os.getenv("HTS_REPUTATION_TOKEN_ID")
        
        # Only create new ones if not already set
        if not self.audit_topic_id:
            self.audit_topic_id = await self.create_audit_topic()
            print(f"✅ HCS Topic created: {self.audit_topic_id}")
            print(f"⚠️  Save this to .env: HCS_AUDIT_TOPIC_ID={self.audit_topic_id}")
        else:
            print(f"✅ Using existing HCS Topic: {self.audit_topic_id}")
        
        if not self.reputation_token_id:
            self.reputation_token_id = await self.create_reputation_token()
            print(f"✅ HTS Token created: {self.reputation_token_id}")
            print(f"⚠️  Save this to .env: HTS_REPUTATION_TOKEN_ID={self.reputation_token_id}")
        else:
            print(f"✅ Using existing HTS Token: {self.reputation_token_id}")
    
    async def create_audit_topic(self) -> str:
        """Create HCS topic for immutable audit trail"""
        transaction = (
            TopicCreateTransaction()
            .setTopicMemo("Synthia Reputation Audit Trail")
            .setAdminKey(self.client.operatorPublicKey)
        )
        
        tx_response = await transaction.execute(self.client)
        receipt = await tx_response.getReceipt(self.client)
        
        return str(receipt.topicId)
    
    async def log_analysis_to_hcs(self, wallet: str, analysis: dict) -> int:
        """Log reputation analysis to HCS for transparency"""
        await self.ensure_initialized()
        
        audit_log = {
            "timestamp": int(time.time()),
            "wallet": wallet,
            "score": analysis.get('score', 0),
            "breakdown": {
                "transaction": analysis.get('transaction_score', 0),
                "defi": analysis.get('defi_score', 0),
                "security": analysis.get('security_score', 0),
                "social": analysis.get('social_score', 0)
            },
            "metta_reasoning": analysis.get('reasoning_explanation', ''),
            "reputation_level": analysis.get('reputation_level', ''),
            "agent_signature": self.sign_analysis(analysis)
        }
        
        transaction = (
            TopicMessageSubmitTransaction()
            .setTopicId(self.audit_topic_id)
            .setMessage(json.dumps(audit_log))
        )
        
        tx_response = await transaction.execute(self.client)
        receipt = await tx_response.getReceipt(self.client)
        
        # FIXED: Return sequence number instead of status
        return receipt.topicSequenceNumber
    
    async def create_reputation_token(self) -> str:
        """Create HTS token for reputation tiers"""
        
        transaction = (
            TokenCreateTransaction()
            .setTokenName("Synthia Reputation Badge")
            .setTokenSymbol("SYNREP")
            .setTokenType(TokenType.NON_FUNGIBLE_UNIQUE)
            .setSupplyType(TokenSupplyType.INFINITE)
            .setInitialSupply(0)
            .setTreasuryAccountId(self.client.operatorAccountId)
            .setAdminKey(self.client.operatorPublicKey)
            .setSupplyKey(self.client.operatorPublicKey)
        )
        
        tx_response = await transaction.execute(self.client)
        receipt = await tx_response.getReceipt(self.client)
        
        return str(receipt.tokenId)
    
    async def mint_reputation_nft(self, wallet: str, score: int, metadata: dict) -> int:
        """Mint reputation NFT on HTS"""
        await self.ensure_initialized()
        
        # Create metadata
        nft_metadata = {
            "name": f"Synthia Reputation #{score}",
            "description": f"Reputation score: {score}/1000",
            "image": self.generate_nft_image_url(score),
            "attributes": [
                {"trait_type": "Score", "value": score},
                {"trait_type": "Tier", "value": self.get_tier(score)},
                {"trait_type": "Analysis Date", "value": metadata.get('timestamp', int(time.time()))},
                {"trait_type": "Transaction Score", "value": metadata.get('transaction_score', 0)},
                {"trait_type": "DeFi Score", "value": metadata.get('defi_score', 0)},
                {"trait_type": "Security Score", "value": metadata.get('security_score', 0)},
                {"trait_type": "Social Score", "value": metadata.get('social_score', 0)},
            ]
        }
        
        # Mint NFT
        transaction = (
            TokenMintTransaction()
            .setTokenId(self.reputation_token_id)
            .addMetadata(json.dumps(nft_metadata).encode())
        )
        
        tx_response = await transaction.execute(self.client)
        receipt = await tx_response.getReceipt(self.client)
        
        return receipt.serials[0]
    
    def get_tier(self, score: int) -> str:
        """Determine tier based on score"""
        if score >= 900: return "Diamond"
        elif score >= 800: return "Platinum"
        elif score >= 700: return "Gold"
        elif score >= 600: return "Silver"
        elif score >= 400: return "Bronze"
        else: return "Unranked"
    
    def sign_analysis(self, analysis: dict) -> str:
        """Sign analysis data for verification"""
        # Simple signature using hash for now
        # In production, this would use proper cryptographic signing
        import hashlib
        analysis_str = json.dumps(analysis, sort_keys=True)
        signature = hashlib.sha256(analysis_str.encode()).hexdigest()
        return f"0x{signature[:40]}"
    
    def generate_nft_image_url(self, score: int) -> str:
        """Generate NFT image URL based on score tier"""
        tier = self.get_tier(score).lower()
        # For demo, use a placeholder. In production, generate actual images
        return f"ipfs://QmSynthia{tier.capitalize()}/{score}.png"