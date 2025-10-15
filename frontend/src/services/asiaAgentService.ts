/**
 * Frontend Integration with Synthia ASI Agents
 * Handles communication between React frontend and Python ASI agents
 */

import { useState, useEffect } from 'react';

interface AgentStatus {
  agent_address: string;
  status: string;
  metrics: {
    analyses_performed?: number;
    cache_size?: number;
    uptime?: string;
    coordinated_agents?: number;
    active_protocols?: number;
  };
  protocols: string[];
  timestamp: number;
}

interface ScoreRequest {
  user_address: string;
  request_id: string;
  timestamp: number;
  source: string;
}

interface ScoreUpdate {
  user_address: string;
  score: number;
  analysis_id: string;
  transaction_hash: string;
  verification_proof: any;
  timestamp: number;
}

export class ASIAgentService {
  private static instance: ASIAgentService;
  private baseUrl = 'http://localhost:8000'; // Orchestrator endpoint

  private constructor() {}

  static getInstance(): ASIAgentService {
    if (!ASIAgentService.instance) {
      ASIAgentService.instance = new ASIAgentService();
    }
    return ASIAgentService.instance;
  }

  /**
   * Request reputation score analysis from ASI agents
   */
  async requestScoreAnalysis(userAddress: string): Promise<{
    success: boolean;
    requestId?: string;
    error?: string;
  }> {
    try {
      const request: ScoreRequest = {
        user_address: userAddress,
        request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        source: 'dashboard'
      };

      const response = await fetch(`${this.baseUrl}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, requestId: request.request_id };
      } else {
        const error = await response.text();
        return { success: false, error };
      }
    } catch (error) {
      console.error('ASI agent request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get current agent status
   */
  async getAgentStatus(): Promise<AgentStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/status`);

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to get agent status:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Agent status check failed:', error);
      return null;
    }
  }

  /**
   * Verify a specific analysis or transaction
   */
  async verifyAnalysis(analysisId: string, transactionHash?: string): Promise<{
    verified: boolean;
    details?: any;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis_id: analysisId,
          transaction_hash: transactionHash,
          timestamp: Date.now()
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          verified: result.is_valid_analysis && result.is_valid_transaction,
          details: result
        };
      } else {
        return { verified: false };
      }
    } catch (error) {
      console.error('Verification request failed:', error);
      return { verified: false };
    }
  }

  /**
   * Monitor agent status in real-time
   */
  monitorAgentStatus(callback: (status: AgentStatus | null) => void): () => void {
    const interval = setInterval(async () => {
      const status = await this.getAgentStatus();
      callback(status);
    }, 30000); // Check every 30 seconds

    // Return cleanup function
    return () => clearInterval(interval);
  }
}

/**
 * React Hook for ASI Agent Integration
 */
export const useASIAgents = () => {
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const agentService = ASIAgentService.getInstance();

  useEffect(() => {
    // Initial status check
    agentService.getAgentStatus().then(setAgentStatus);

    // Set up monitoring
    const cleanup = agentService.monitorAgentStatus((status) => {
      setAgentStatus(status);
      setLastUpdate(new Date());
    });

    return cleanup;
  }, []);

  const requestScoreUpdate = async (userAddress: string) => {
    setIsLoading(true);
    try {
      const result = await agentService.requestScoreAnalysis(userAddress);
      if (result.success) {
        setLastUpdate(new Date());
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyUpdate = async (analysisId: string, transactionHash?: string) => {
    return await agentService.verifyAnalysis(analysisId, transactionHash);
  };

  return {
    agentStatus,
    isLoading,
    lastUpdate,
    requestScoreUpdate,
    verifyUpdate,
    isConnected: agentStatus?.status === 'active'
  };
};

/**
 * ASI Dashboard Component
 */
export const ASIDashboard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { agentStatus, isLoading, lastUpdate, requestScoreUpdate, verifyUpdate, isConnected } = useASIAgents();

  const formatUptime = (timestamp: number) => {
    const now = Date.now();
    const uptime = now - timestamp;
    const minutes = Math.floor(uptime / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className={`asi-dashboard ${className}`}>
      <div className="dashboard-header">
        <h2>🤖 ASI Agent Dashboard</h2>
        <p>Real-time verification of ASI-powered reputation system</p>
      </div>

      {/* Agent Status */}
      <div className="agent-status-section">
        <h3>🔍 Live Agent Status</h3>
        <div className="status-grid">
          <div className={`status-card ${isConnected ? 'active' : 'inactive'}`}>
            <div className="status-indicator">
              <span className={`status-dot ${isConnected ? 'green' : 'red'}`}></span>
              <span className="status-text">
                {isConnected ? 'ASI Agents Active' : 'Agents Offline'}
              </span>
            </div>

            {agentStatus && (
              <div className="status-details">
                <div className="metric">
                  <span className="metric-label">Address:</span>
                  <span className="metric-value mono">{agentStatus.agent_address.slice(0, 10)}...</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Analyses:</span>
                  <span className="metric-value">{agentStatus.metrics.analyses_performed || 0}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Protocols:</span>
                  <span className="metric-value">{agentStatus.protocols.length}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Uptime:</span>
                  <span className="metric-value">
                    {formatUptime(agentStatus.timestamp * 1000)}
                  </span>
                </div>
              </div>
            )}

            {isConnected && (
              <div className="asi-badge">
                ✅ ASI Compatible
              </div>
            )}
          </div>

          <div className="protocols-card">
            <h4>📡 Active Protocols</h4>
            <div className="protocols-list">
              {agentStatus?.protocols.map((protocol, index) => (
                <span key={index} className="protocol-tag">{protocol}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Tools */}
      <div className="verification-section">
        <h3>🔍 Verification Tools</h3>
        <div className="verification-grid">
          <div className="verification-info">
            <p>
              <strong>How to verify ASI agents are working:</strong>
            </p>
            <ol>
              <li>Request a score update - triggers ASI analysis</li>
              <li>Monitor agent status in real-time</li>
              <li>Verify transactions come from agent addresses</li>
              <li>Check cryptographic proofs are valid</li>
            </ol>
          </div>

          {lastUpdate && (
            <div className="last-activity">
              <h4>📊 Last Activity</h4>
              <p>Last update: {lastUpdate.toLocaleString()}</p>
              <p>Agent status: {isConnected ? '✅ Active' : '❌ Inactive'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Integration Status */}
      <div className="integration-status">
        <h3>🔗 Integration Status</h3>
        <div className="integration-grid">
          <div className={`integration-item ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="integration-icon">🤖</span>
            <div>
              <h4>ASI Agent Connection</h4>
              <p>{isConnected ? 'Connected and operational' : 'Connection required'}</p>
            </div>
          </div>

          <div className="integration-item connected">
            <span className="integration-icon">⛓️</span>
            <div>
              <h4>Smart Contract Integration</h4>
              <p>Ready for blockchain interactions</p>
            </div>
          </div>

          <div className="integration-item connected">
            <span className="integration-icon">🔐</span>
            <div>
              <h4>MetaMask Integration</h4>
              <p>Automatic transaction signing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
