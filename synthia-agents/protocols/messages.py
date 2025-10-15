"""
Synthia ASI Agent Protocols
Defines message schemas for ASI agent communication
"""

from uagents import Model, Protocol
from typing import Optional, Dict, Any
from datetime import datetime

class ScoreRequest(Model):
    """Message for requesting reputation score analysis"""
    user_address: str
    request_id: str
    timestamp: int
    source: str = "dashboard"

class ScoreAnalysis(Model):
    """Message containing wallet analysis results"""
    user_address: str
    analysis_id: str
    reputation_score: int
    analysis_data: Dict[str, Any]
    agent_signature: str
    timestamp: int

class ScoreUpdate(Model):
    """Message for blockchain score updates"""
    user_address: str
    score: int
    analysis_id: str
    transaction_hash: str
    verification_proof: Dict[str, Any]
    timestamp: int

class AgentStatus(Model):
    """Message for agent status reporting"""
    agent_address: str
    status: str
    metrics: Dict[str, Any]
    protocols: list
    timestamp: int

class VerificationRequest(Model):
    """Message for requesting verification of ASI operations"""
    analysis_id: str
    transaction_hash: Optional[str] = None
    timestamp: int

class VerificationResult(Model):
    """Message containing verification results"""
    analysis_id: str
    transaction_hash: Optional[str]
    is_valid_analysis: bool
    is_valid_transaction: bool
    agent_address: str
    verification_hash: str
    timestamp: int

class ErrorMessage(Model):
    """Message for error reporting"""
    error_type: str
    error_message: str
    request_id: Optional[str] = None
    timestamp: int

# Protocol definitions
score_protocol = Protocol(
    name="synthia_score_protocol",
    version="1.0.0",
    message_models=[
        ScoreRequest,
        ScoreAnalysis,
        ScoreUpdate,
        ErrorMessage
    ]
)

verification_protocol = Protocol(
    name="synthia_verification_protocol",
    version="1.0.0",
    message_models=[
        AgentStatus,
        VerificationRequest,
        VerificationResult,
        ErrorMessage
    ]
)
