# FILE: protocols/__init__.py

"""
Synthia Agent Communication Protocols
"""

from .messages import (
    # Core messages
    ScoreRequest,
    ScoreAnalysis,
    BlockchainUpdate,
    BlockchainConfirmation,
    
    # Chat messages
    ChatQuery,
    ChatResponse,
    
    # A2A messages (optional)
    A2AReputationRequest,
    A2AReputationOffer,
    A2AReputationResponse,
    AP2PaymentRequest,
    AP2PaymentConfirmation,
    
    # Health messages
    AgentStatus,
    HealthCheckRequest,
    HealthCheckResponse,
    
    # Utility messages
    ErrorMessage,
    GenericResponse,
    
    # Constants
    SCORE_EXCEPTIONAL,
    SCORE_EXCELLENT,
    SCORE_VERY_GOOD,
    SCORE_GOOD,
    SCORE_MODERATE,
    SCORE_MINIMUM_NFT,
)

__all__ = [
    'ScoreRequest',
    'ScoreAnalysis',
    'BlockchainUpdate',
    'BlockchainConfirmation',
    'ChatQuery',
    'ChatResponse',
    'A2AReputationRequest',
    'A2AReputationOffer',
    'A2AReputationResponse',
    'AP2PaymentRequest',
    'AP2PaymentConfirmation',
    'AgentStatus',
    'HealthCheckRequest',
    'HealthCheckResponse',
    'ErrorMessage',
    'GenericResponse',
    'SCORE_EXCEPTIONAL',
    'SCORE_EXCELLENT',
    'SCORE_VERY_GOOD',
    'SCORE_GOOD',
    'SCORE_MODERATE',
    'SCORE_MINIMUM_NFT',
]