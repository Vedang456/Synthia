import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'communicating' | 'completed';
  position: { x: number; y: number };
  currentTask?: string;
  progress?: number;
}

export const LiveAgentVisualization: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'ASI:One Chat', status: 'idle', position: { x: 50, y: 15 } },
    { id: '2', name: 'Orchestrator', status: 'idle', position: { x: 50, y: 40 } },
    { id: '3', name: 'Wallet Analyzer', status: 'idle', position: { x: 25, y: 70 } },
    { id: '4', name: 'MeTTa Engine', status: 'idle', position: { x: 50, y: 70 } },
    { id: '5', name: 'Blockchain Agent', status: 'idle', position: { x: 75, y: 70 } },
  ]);

  const [messages, setMessages] = useState<Array<{from: string, to: string, message?: string}>>([]);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode simulation
      const simulateWorkflow = async () => {
        setIsSimulating(true);

        // Phase 1: Chat → Orchestrator
        setTimeout(() => {
          setAgents(prev => prev.map(agent =>
            agent.id === '1' ? { ...agent, status: 'working', currentTask: 'Processing request' } : agent
          ));
        }, 500);

        setTimeout(() => {
          setAgents(prev => prev.map(agent =>
            agent.id === '1' ? { ...agent, status: 'communicating' } :
            agent.id === '2' ? { ...agent, status: 'working', currentTask: 'Coordinating analysis' } : agent
          ));
          setMessages(prev => [...prev, { from: '1', to: '2', message: 'Analysis request received' }]);
        }, 1500);

        // Phase 2: Orchestrator → Wallet Analyzer
        setTimeout(() => {
          setAgents(prev => prev.map(agent =>
            agent.id === '2' ? { ...agent, status: 'communicating' } :
            agent.id === '3' ? { ...agent, status: 'working', currentTask: 'Analyzing wallet data' } : agent
          ));
          setMessages(prev => [...prev, { from: '2', to: '3', message: 'Wallet analysis requested' }]);
        }, 3000);

        // Phase 3: Wallet Analyzer → MeTTa Engine
        setTimeout(() => {
          setAgents(prev => prev.map(agent =>
            agent.id === '3' ? { ...agent, status: 'communicating' } :
            agent.id === '4' ? { ...agent, status: 'working', currentTask: 'Applying reasoning', progress: 0 } : agent
          ));
          setMessages(prev => [...prev, { from: '3', to: '4', message: 'Raw analysis data' }]);
        }, 5000);

        // Simulate MeTTa progress
        const progressInterval = setInterval(() => {
          setAgents(prev => prev.map(agent =>
            agent.id === '4' && agent.progress !== undefined && agent.progress < 100
              ? { ...agent, progress: Math.min(agent.progress + 15, 100) }
              : agent
          ));
        }, 200);

        // Phase 4: MeTTa Engine → Blockchain Agent
        setTimeout(() => {
          clearInterval(progressInterval);
          setAgents(prev => prev.map(agent =>
            agent.id === '4' ? { ...agent, status: 'communicating', progress: 100 } :
            agent.id === '5' ? { ...agent, status: 'working', currentTask: 'Writing to blockchain' } : agent
          ));
          setMessages(prev => [...prev, { from: '4', to: '5', message: 'Reasoning complete' }]);
        }, 9000);

        // Phase 5: Complete
        setTimeout(() => {
          setAgents(prev => prev.map(agent => ({
            ...agent,
            status: 'completed' as const,
            currentTask: undefined,
            progress: undefined
          })));

          // Reset after completion
          setTimeout(() => {
            setAgents(prev => prev.map(agent => ({ ...agent, status: 'idle' as const })));
            setMessages([]);
          }, 2000);
        }, 12000);

        setIsSimulating(false);
      };

      simulateWorkflow();
    }
  }, [isDemoMode]);

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
    if (!isDemoMode) {
      // Reset to idle when turning off demo
      setAgents(prev => prev.map(agent => ({ ...agent, status: 'idle', currentTask: undefined, progress: undefined })));
      setMessages([]);
    }
  };

  const startDemo = () => {
    if (!isSimulating) {
      setIsDemoMode(true);
    }
  };

  const resetDemo = () => {
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'idle', currentTask: undefined, progress: undefined })));
    setMessages([]);
    setIsSimulating(false);
  };

  return (
    <div className="relative w-full h-[700px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-white">
          🤖 Live Multi-Agent System
        </h3>

        {/* Demo Controls */}
        <div className="flex gap-2">
          <Button
            variant={isDemoMode ? "default" : "outline"}
            size="sm"
            onClick={toggleDemoMode}
            className="text-white"
          >
            {isDemoMode ? 'Live Mode' : 'Demo Mode'}
          </Button>
          {isDemoMode && (
            <>
              <Button variant="outline" size="sm" onClick={startDemo} disabled={isSimulating}>
                <Play className="w-4 h-4 mr-1" />
                Start Demo
              </Button>
              <Button variant="outline" size="sm" onClick={resetDemo}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Legend */}
      <div className="absolute top-16 right-4 bg-black/50 rounded-lg p-3 text-white text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Working</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Communicating</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <span>Idle</span>
        </div>
      </div>

      {/* Agents */}
      {agents.map(agent => (
        <motion.div
          key={agent.id}
          className={`absolute w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
            agent.status === 'working' ? 'bg-green-500 shadow-green-500/50' :
            agent.status === 'communicating' ? 'bg-blue-500 shadow-blue-500/50' :
            agent.status === 'completed' ? 'bg-purple-500 shadow-purple-500/50' :
            'bg-gray-600 shadow-gray-600/30'
          }`}
          style={{
            left: `${agent.position.x}%`,
            top: `${agent.position.y}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: agent.status === 'working'
              ? '0 0 25px rgba(34, 197, 94, 0.7), 0 0 50px rgba(34, 197, 94, 0.4)'
              : agent.status === 'communicating'
              ? '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)'
              : agent.status === 'completed'
              ? '0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(168, 85, 247, 0.3)'
              : '0 0 0px rgba(0,0,0,0)'
          }}
          animate={{
            scale: agent.status === 'working' ? [1, 1.08, 1] : 1,
          }}
          transition={{ duration: 2, repeat: agent.status === 'working' ? Infinity : 0 }}
        >
          <div className="text-3xl mb-2">
            {agent.status === 'working' ? '⚡' : agent.status === 'communicating' ? '💬' : agent.status === 'completed' ? '✅' : '😴'}
          </div>
          <div className="text-sm text-white text-center font-semibold leading-tight px-2">
            {agent.name}
          </div>
          {agent.currentTask && (
            <div className="text-xs text-white/90 text-center mt-1 px-2 leading-tight">
              {agent.currentTask}
            </div>
          )}
          {agent.progress !== undefined && (
            <div className="text-sm text-white/90 mt-1 font-medium">
              {agent.progress}%
            </div>
          )}
        </motion.div>
      ))}

      {/* Message flows */}
      {messages.map((msg, idx) => {
        const fromAgent = agents.find(a => a.id === msg.from);
        const toAgent = agents.find(a => a.id === msg.to);

        if (!fromAgent || !toAgent) return null;

        return (
          <motion.div
            key={idx}
            className="absolute bg-yellow-400 opacity-80"
            style={{
              height: '2px',
              borderRadius: '1px'
            }}
            initial={{
              left: `${fromAgent.position.x}%`,
              top: `${fromAgent.position.y}%`,
              width: 0
            }}
            animate={{
              left: `${toAgent.position.x}%`,
              top: `${toAgent.position.y}%`,
              width: `${Math.abs(toAgent.position.x - fromAgent.position.x) * 2}%`
            }}
            transition={{ duration: 0.8 }}
          />
        );
      })}

      {/* Demo Mode Indicator */}
      {isDemoMode && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500/20 border border-green-400/50 rounded-full px-4 py-2 text-green-300 text-sm">
          🎭 Demo Mode Active - Simulating Agent Coordination
        </div>
      )}
    </div>
  );
};