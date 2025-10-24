import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Network,
  Brain,
  Database,
  MessageSquare,
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Server,
  Eye,
  EyeOff
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'processing' | 'communicating' | 'error';
  position: { x: number; y: number };
  health: number;
  cpu: number;
  memory: number;
  currentTask?: string;
  progress?: number;
  lastActivity: number;
  connections: string[];
  description: string;
}

interface MessageFlow {
  id: string;
  from: string;
  to: string;
  type: 'request' | 'response' | 'data' | 'command';
  content: string;
  timestamp: number;
  duration: number;
}

export const PremiumAgentVisualization: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'chat',
      name: 'ASI:One Chat',
      role: 'User Interface',
      status: 'online',
      position: { x: 50, y: 15 },
      health: 98,
      cpu: 15,
      memory: 45,
      currentTask: 'Ready for user interaction',
      lastActivity: Date.now(),
      connections: ['orchestrator'],
      description: 'Conversational AI interface with natural language processing and user experience optimization.'
    },
    {
      id: 'orchestrator',
      name: 'Orchestrator',
      role: 'Central Coordinator',
      status: 'online',
      position: { x: 50, y: 35 },
      health: 100,
      cpu: 25,
      memory: 60,
      currentTask: 'Coordinating multi-agent workflow',
      lastActivity: Date.now() - 1000,
      connections: ['chat', 'analyzer', 'blockchain'],
      description: 'Central coordination engine managing agent interactions, task distribution, and workflow orchestration.'
    },
    {
      id: 'analyzer',
      name: 'Wallet Analyzer',
      role: 'Data Analysis & MeTTa',
      status: 'online',
      position: { x: 25, y: 65 },
      health: 95,
      cpu: 45,
      memory: 70,
      currentTask: 'Deep wallet pattern analysis with MeTTa',
      lastActivity: Date.now() - 2000,
      connections: ['orchestrator', 'blockchain'],
      description: 'Advanced wallet analysis engine with integrated MeTTa symbolic reasoning for reputation computation and decision making.'
    },
    {
      id: 'blockchain',
      name: 'Blockchain Agent',
      role: 'Smart Contracts',
      status: 'online',
      position: { x: 75, y: 65 },
      health: 97,
      cpu: 20,
      memory: 40,
      currentTask: 'Ready for on-chain execution',
      lastActivity: Date.now() - 500,
      connections: ['orchestrator', 'analyzer'],
      description: 'Hedera blockchain integration specialist handling smart contract interactions, NFT minting, and consensus logging.'
    }
  ]);

  const [messageFlows, setMessageFlows] = useState<MessageFlow[]>([]);
  const [demoPhase, setDemoPhase] = useState<number>(0);
  const [demoRunning, setDemoRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showMetrics, setShowMetrics] = useState(true);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), `${timestamp}: ${message}`]);
  };

  // Demo workflow simulation based on README flow
  useEffect(() => {
    if (demoRunning && !isLiveMode) {
      const runDemoWorkflow = async () => {
        addLog('🎬 Starting Multi-Agent Workflow Demo');

        // Phase 1: User Request → Chat Agent
        setTimeout(() => {
          setAgents(prev => prev.map(agent =>
            agent.id === 'chat' ? {
              ...agent,
              status: 'processing',
              currentTask: 'Processing user reputation request',
              cpu: 45,
              memory: 60
            } : agent
          ));
          addLog('💬 ASI:One Chat Agent received reputation analysis request');
        }, 1000);

        // Phase 2: Chat → Orchestrator
        setTimeout(() => {
          setAgents(prev => prev.map(agent =>
            agent.id === 'chat' ? {
              ...agent,
              status: 'communicating',
              currentTask: 'Forwarding request to orchestrator'
            } :
            agent.id === 'orchestrator' ? {
              ...agent,
              status: 'processing',
              currentTask: 'Coordinating analysis workflow',
              cpu: 55,
              memory: 70
            } : agent
          ));
          setMessageFlows(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            from: 'chat',
            to: 'orchestrator',
            type: 'request',
            content: 'User reputation analysis request',
            timestamp: Date.now(),
            duration: 1000
          }]);
          addLog('🔄 Orchestrator coordinating multi-agent analysis workflow');
        }, 3000);

        // Phase 3: Orchestrator → Wallet Analyzer
        setTimeout(() => {
          setAgents(prev => prev.map(agent =>
            agent.id === 'orchestrator' ? {
              ...agent,
              status: 'communicating',
              currentTask: 'Delegating to wallet analyzer'
            } :
            agent.id === 'analyzer' ? {
              ...agent,
              status: 'processing',
              currentTask: 'Analyzing wallet + MeTTa reasoning',
              cpu: 75,
              memory: 80
            } : agent
          ));
          setMessageFlows(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            from: 'orchestrator',
            to: 'analyzer',
            type: 'command',
            content: 'Analyze wallet 0x742d... for reputation scoring',
            timestamp: Date.now(),
            duration: 1500
          }]);
          addLog('🔍 Wallet Analyzer processing with integrated MeTTa reasoning');
        }, 6000);

        // Phase 4: Analyzer → Blockchain Agent (MeTTa integrated)
        setTimeout(() => {
          setAgents(prev => prev.map(agent =>
            agent.id === 'analyzer' ? {
              ...agent,
              status: 'communicating',
              currentTask: 'Forwarding analysis results with MeTTa reasoning',
              progress: 100
            } :
            agent.id === 'blockchain' ? {
              ...agent,
              status: 'processing',
              currentTask: 'Updating reputation on Hedera blockchain',
              cpu: 60,
              memory: 65
            } : agent
          ));
          setMessageFlows(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            from: 'analyzer',
            to: 'blockchain',
            type: 'response',
            content: 'Analysis complete: 875/1000 (Platinum) - MeTTa reasoning applied',
            timestamp: Date.now(),
            duration: 800
          }]);
          addLog('🔍 Wallet Analyzer completed analysis with integrated MeTTa reasoning');
        }, 10000);

        // Phase 5: Completion
        setTimeout(() => {
          setAgents(prev => prev.map(agent => ({
            ...agent,
            status: 'online',
            currentTask: 'Ready for next request',
            cpu: agent.cpu * 0.3,
            memory: agent.memory * 0.4,
            progress: undefined
          })));
          setMessageFlows([]);
          addLog('✅ Multi-agent workflow completed successfully!');
          addLog('🏆 Reputation analysis complete - Score: 875/1000 (Platinum)');
          addLog('⏱️ Total processing time: 14 seconds');
          setDemoPhase(0);
          setDemoRunning(false);
        }, 14000);
      };

      runDemoWorkflow();
    }
  }, [demoRunning, isLiveMode]);

  // Simulate real-time agent activity
  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(() => {
        setAgents(prev => prev.map(agent => ({
          ...agent,
          cpu: Math.max(10, Math.min(90, agent.cpu + (Math.random() - 0.5) * 20)),
          memory: Math.max(20, Math.min(85, agent.memory + (Math.random() - 0.5) * 10)),
          lastActivity: Date.now(),
          status: Math.random() > 0.95 ? 'processing' : agent.status === 'processing' ? 'online' : agent.status
        })));

        // Simulate message flows
        if (Math.random() > 0.7) {
          const agentIds = agents.map(a => a.id);
          const from = agentIds[Math.floor(Math.random() * agentIds.length)];
          const to = agentIds[Math.floor(Math.random() * agentIds.length)];
          if (from !== to) {
            const flow: MessageFlow = {
              id: Date.now().toString(),
              from,
              to,
              type: (['request', 'response', 'data', 'command'] as const)[Math.floor(Math.random() * 4)],
              content: 'Processing coordination message',
              timestamp: Date.now(),
              duration: 500 + Math.random() * 1000
            };
            setMessageFlows(prev => [...prev.slice(-9), flow]);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLiveMode, agents]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'communicating': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'communicating': return <MessageSquare className="w-4 h-4 animate-pulse" />;
      case 'error': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative w-full min-h-[800px] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-2xl overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-indigo-900/20 opacity-50" />
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #9C92AC 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Network className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Multi-Agent System Control Center</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLiveMode ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-sm text-gray-300">{isLiveMode ? 'Live Mode' : 'Demo Mode'}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={isLiveMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLiveMode(!isLiveMode)}
              className="text-white border-white/20"
            >
              {isLiveMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isLiveMode ? 'Demo Mode' : 'Live Mode'}
            </Button>
            {!isLiveMode && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setDemoRunning(true)}
                disabled={demoRunning}
                className="text-white bg-purple-600 hover:bg-purple-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {demoRunning ? 'Running Demo...' : 'Start Workflow Demo'}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetrics(!showMetrics)}
              className="text-white border-white/20"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Metrics
            </Button>
            <Button variant="outline" size="sm" className="text-white border-white/20">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="mt-4 flex gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            <span>Agents Online: {agents.filter(a => a.status === 'online').length}/4</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>Active Connections: {messageFlows.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>System Load: {Math.round(agents.reduce((acc, a) => acc + a.cpu, 0) / agents.length)}%</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Agent Network Visualization */}
          <div className="lg:col-span-3 relative bg-black/20 rounded-xl border border-white/10 overflow-hidden">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {messageFlows.map((flow, idx) => {
                const fromAgent = agents.find(a => a.id === flow.from);
                const toAgent = agents.find(a => a.id === flow.to);
                if (!fromAgent || !toAgent) return null;

                return (
                  <motion.line
                    key={flow.id}
                    x1={`${fromAgent.position.x}%`}
                    y1={`${fromAgent.position.y}%`}
                    x2={`${toAgent.position.x}%`}
                    y2={`${toAgent.position.y}%`}
                    stroke={flow.type === 'request' ? '#10b981' : flow.type === 'response' ? '#3b82f6' : '#f59e0b'}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                );
              })}
            </svg>

            {/* Agents */}
            {agents.map((agent, idx) => (
              <motion.div
                key={agent.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                  selectedAgent === agent.id ? 'scale-110 z-20' : 'scale-100 z-10'
                }`}
                style={{
                  left: `${agent.position.x}%`,
                  top: `${agent.position.y}%`,
                }}
                onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
              >
                <Card className={`w-32 h-32 bg-gradient-to-br ${getStatusColor(agent.status)}/20 backdrop-blur-sm border-2 transition-all duration-300 ${
                  selectedAgent === agent.id ? 'border-white/50 shadow-2xl' : 'border-white/20 hover:border-white/40'
                }`}>
                  <CardContent className="p-3 h-full flex flex-col items-center justify-center text-center">
                    <div className="flex items-center justify-center mb-2">
                      {getStatusIcon(agent.status)}
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">{agent.name}</h4>
                    <p className="text-xs text-white/80 mb-2">{agent.role}</p>

                    {agent.currentTask && (
                      <div className="text-xs text-white/70 text-center leading-tight">
                        {agent.currentTask}
                      </div>
                    )}

                    {agent.progress !== undefined && (
                      <div className="w-full mt-2">
                        <Progress value={agent.progress} className="h-1" />
                        <span className="text-xs text-white/60">{agent.progress}%</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Agent Details Panel */}
          <div className="space-y-4 overflow-y-auto">
            <AnimatePresence>
              {selectedAgent ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {(() => {
                    const agent = agents.find(a => a.id === selectedAgent);
                    if (!agent) return null;

                    return (
                      <Card className="bg-black/30 backdrop-blur-sm border-white/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            {getStatusIcon(agent.status)}
                            {agent.name}
                          </CardTitle>
                          <p className="text-sm text-gray-300">{agent.description}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">Status</span>
                              <Badge variant={agent.status === 'online' ? 'default' : 'secondary'}>
                                {agent.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">Health</span>
                              <span className="text-sm text-white">{agent.health}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">CPU</span>
                              <span className="text-sm text-white">{Math.round(agent.cpu)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">Memory</span>
                              <span className="text-sm text-white">{agent.memory}%</span>
                            </div>
                          </div>

                          {showMetrics && (
                            <div className="space-y-2">
                              <Progress value={agent.health} className="h-2" />
                              <Progress value={agent.cpu} className="h-2" />
                              <Progress value={agent.memory} className="h-2" />
                            </div>
                          )}

                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-white">Connections</h5>
                            <div className="flex flex-wrap gap-1">
                              {agent.connections.map(conn => (
                                <Badge key={conn} variant="outline" className="text-xs">
                                  {conn}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-white">Last Activity</h5>
                            <p className="text-xs text-gray-300">
                              {new Date(agent.lastActivity).toLocaleTimeString()}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-white">Current Task</h5>
                            <p className="text-xs text-gray-300">
                              {agent.currentTask || 'No active task'}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-white">Network Address</h5>
                            <p className="text-xs text-gray-300 font-mono">
                              {agent.id === 'chat' ? 'fetch1...' : agent.id === 'orchestrator' ? 'fetch1...' : agent.id === 'analyzer' ? '0x3b4D...' : '0x5097...'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}
                </motion.div>
              ) : (
                <Card className="bg-black/30 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6 text-center">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-white font-semibold mb-2">Agent Details</h3>
                    <p className="text-sm text-gray-300">
                      Click on any agent to view detailed information, performance metrics, and connection status.
                    </p>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>

            {/* Activity Logs */}
            <Card className="bg-black/30 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Activity Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {logs.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      No activity yet. Start a demo to see the workflow in action!
                    </p>
                  ) : (
                    logs.map((log, idx) => (
                      <div key={idx} className="text-xs text-gray-300 p-2 bg-black/20 rounded border-l-2 border-purple-400">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Metrics */}
            <Card className="bg-black/30 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  System Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">Avg CPU</span>
                  <span className="text-xs text-white">
                    {Math.round(agents.reduce((acc, a) => acc + a.cpu, 0) / agents.length)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">Avg Memory</span>
                  <span className="text-xs text-white">
                    {Math.round(agents.reduce((acc, a) => acc + a.memory, 0) / agents.length)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">Active Flows</span>
                  <span className="text-xs text-white">{messageFlows.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">Uptime</span>
                  <span className="text-xs text-white">99.9%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
