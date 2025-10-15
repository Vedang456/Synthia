# FILE: protocols/messages.py

"""
Synthia Agent Communication Protocol
Defines all message models used for inter-agent communication
"""

from uagents import Model
from typing import Optional, List, Dict

# ============================================
# CORE REPUTATION ANALYSIS MESSAGES
# ============================================

class ScoreRequest(Model):
    """
    Request to analyze a wallet's reputation
    Sent by: Orchestrator → Wallet Analyzer
    """
    wallet_address: str
    request_id: str
    requester: Optional[str] = None

class ScoreAnalysis(Model):
    """
    Complete wallet analysis results with MeTTa reasoning
    Sent by: Wallet Analyzer → Orchestrator
    """
    request_id: str
    wallet_address: str
    score: int  # Final score 0-1000
    analyzer_id: str  # Which analyzer performed this
    
    # Score breakdown
    transaction_score: int
    defi_score: int
    security_score: int
    social_score: int
    
    # MeTTa reasoning results
    reputation_level: str  # "Exceptional", "Excellent", etc.
    reasoning_explanation: str  # Human-readable explanation
    metta_rules_applied: List[str]  # List of rule names applied
    score_adjustments: int  # Total adjustments from MeTTa
    
    # Raw analysis data
    analysis_data: dict
    timestamp: int

class BlockchainUpdate(Model):
    """
    Request to update score on blockchain
    Sent by: Orchestrator → Blockchain Agent
    """
    request_id: str
    wallet_address: str
    score: int
    metta_rules_applied: List[str]
    score_adjustment: int
    analysis_data: dict

class BlockchainConfirmation(Model):
    """
    Confirmation that blockchain update completed
    Sent by: Blockchain Agent → Orchestrator
    """
    request_id: str
    status: str  # "success" or "error"
    tx_hash: Optional[str] = None
    hcs_sequence: Optional[int] = None
    contract_address: Optional[str] = None
    error: Optional[str] = None

# ============================================
# ASI:ONE CHAT MESSAGES
# ============================================

class ChatQuery(Model):
    """
    Natural language query from user via ASI:One
    Sent by: User/Frontend → ASI:One Chat Agent
    """
    message: str
    session_id: str
    wallet_address: Optional[str] = None

class ChatResponse(Model):
    """
    Natural language response to user
    Sent by: ASI:One Chat Agent → User/Frontend
    """
    message: str
    session_id: str
    actions: List[str]  # ["analysis_started", "greeting", etc.]
    data: Optional[dict] = None

# ============================================
# A2A MARKETPLACE MESSAGES (Optional)
# ============================================

class A2AReputationRequest(Model):
    """
    Agent-to-Agent reputation request
    Sent by: External Agent → Marketplace Agent
    """
    wallet_address: str
    analysis_depth: str = "comprehensive"  # quick, standard, comprehensive
    max_price_hbar: float
    requester_name: str
    request_id: Optional[str] = None

class A2AReputationOffer(Model):
    """
    Offer to provide analysis via A2A
    Sent by: Marketplace Agent → External Agent
    """
    estimated_duration_seconds: int
    price_hbar: float
    confidence_score: float
    provider_reputation: int
    offer_id: Optional[str] = None

class A2AReputationResponse(Model):
    """
    Analysis results via A2A protocol
    Sent by: Marketplace Agent → External Agent
    """
    wallet_address: str
    reputation_score: int
    analysis_data: dict
    provider_agent_id: str
    analysis_timestamp: int
    request_id: Optional[str] = None

# ============================================
# AP2 PAYMENT MESSAGES (Optional)
# ============================================

class AP2PaymentRequest(Model):
    """
    Payment request via AP2 protocol
    Sent by: Marketplace Agent ↔ External Agent
    """
    from_agent: str
    to_agent: str
    amount_hbar: float
    currency: str = "HBAR"
    memo: str
    invoice_id: str

class AP2PaymentConfirmation(Model):
    """
    Payment confirmation via AP2
    Sent by: Marketplace Agent ↔ External Agent
    """
    invoice_id: str
    transaction_hash: str
    amount_hbar: float
    status: str  # "confirmed", "pending", "failed"
    block_number: Optional[int] = None

# ============================================
# HEALTH & STATUS MESSAGES
# ============================================

class AgentStatus(Model):
    """
    Agent health status report
    Sent by: Any Agent → Orchestrator
    """
    agent_id: str
    agent_name: str
    status: str  # "online", "busy", "offline"
    uptime_seconds: int
    requests_processed: int
    last_activity: int

class HealthCheckRequest(Model):
    """
    Request for agent health status
    Sent by: Orchestrator → Any Agent
    """
    timestamp: int

class HealthCheckResponse(Model):
    """
    Response to health check
    Sent by: Any Agent → Orchestrator
    """
    agent_id: str
    status: str  # "healthy", "degraded", "unhealthy"
    memory_usage_mb: Optional[float] = None
    cpu_usage_percent: Optional[float] = None
    active_requests: Optional[int] = None
    timestamp: int

# ============================================
# HCS AUDIT MESSAGES (Optional)
# ============================================

class HCSAuditLog(Model):
    """
    Request to log analysis to HCS
    Sent by: Blockchain Agent → Hedera Services
    """
    wallet_address: str
    analysis_data: dict
    hcs_topic_id: str
    timestamp: int

class HCSAuditConfirmation(Model):
    """
    Confirmation of HCS logging
    Sent by: Hedera Services → Blockchain Agent
    """
    wallet_address: str
    hcs_sequence_number: int
    topic_id: str
    timestamp: int

# ============================================
# ERROR MESSAGES
# ============================================

class ErrorMessage(Model):
    """
    Generic error message
    Sent by: Any Agent → Any Agent
    """
    error_type: str  # "validation", "timeout", "internal", etc.
    error_message: str
    request_id: Optional[str] = None
    agent_id: Optional[str] = None
    timestamp: int

# ============================================
# UTILITY MESSAGES
# ============================================

class GenericResponse(Model):
    """
    Generic success/failure response
    Sent by: Any Agent → Any Agent
    """
    status: str  # "success" or "error"
    message: Optional[str] = None
    data: Optional[dict] = None
    request_id: Optional[str] = None

# ============================================
# MESSAGE FLOW DOCUMENTATION
# ============================================

"""
TYPICAL MESSAGE FLOWS:

1. USER REQUESTS ANALYSIS:
   User → ASI:One Chat: ChatQuery
   ASI:One Chat → Orchestrator: ScoreRequest
   Orchestrator → Wallet Analyzer: ScoreRequest
   Wallet Analyzer → Orchestrator: ScoreAnalysis
   Orchestrator → Blockchain Agent: BlockchainUpdate
   Blockchain Agent → Orchestrator: BlockchainConfirmation
   Orchestrator → ASI:One Chat: GenericResponse
   ASI:One Chat → User: ChatResponse

2. HEALTH CHECK:
   Orchestrator → Any Agent: HealthCheckRequest
   Any Agent → Orchestrator: HealthCheckResponse

3. A2A MARKETPLACE (Optional):
   External Agent → Marketplace: A2AReputationRequest
   Marketplace → External Agent: A2AReputationOffer
   External Agent → Marketplace: AP2PaymentRequest
   Marketplace → External Agent: AP2PaymentConfirmation
   Marketplace → Orchestrator: ScoreRequest
   Orchestrator → ... (normal flow)
   Orchestrator → Marketplace: ScoreAnalysis
   Marketplace → External Agent: A2AReputationResponse
"""

# ============================================
# VALIDATION HELPERS
# ============================================

def validate_wallet_address(address: str) -> bool:
    """Validate Ethereum address format"""
    import re
    pattern = r'^0x[a-fA-F0-9]{40}$'
    return bool(re.match(pattern, address))

def validate_score(score: int) -> bool:
    """Validate score is in valid range"""
    return 0 <= score <= 1000

def validate_request_id(request_id: str) -> bool:
    """Validate request ID format"""
    return len(request_id) > 0 and len(request_id) < 256

# ============================================
# CONSTANTS
# ============================================

# Score thresholds
SCORE_EXCEPTIONAL = 900
SCORE_EXCELLENT = 800
SCORE_VERY_GOOD = 700
SCORE_GOOD = 600
SCORE_MODERATE = 400
SCORE_MINIMUM_NFT = 400

# Analysis depths
ANALYSIS_QUICK = "quick"
ANALYSIS_STANDARD = "standard"
ANALYSIS_COMPREHENSIVE = "comprehensive"

# Agent statuses
STATUS_ONLINE = "online"
STATUS_BUSY = "busy"
STATUS_OFFLINE = "offline"

# Request statuses
STATUS_PENDING = "pending"
STATUS_ANALYZING = "analyzing"
STATUS_COMPLETED = "completed"
STATUS_FAILED = "failed"