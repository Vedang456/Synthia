// FILE: frontend/src/components/ASIOneChatInterface.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Sparkles, TrendingUp, Shield, Users } from 'lucide-react';
import { useDemoData } from '@/hooks/useDemoData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: number;
  data?: ReputationData;
  action?: 'analyze' | 'compare' | 'explain';
}

interface ReputationData {
  score: number;
  transaction_score: number;
  defi_score: number;
  security_score: number;
  social_score: number;
  wallet?: string;
  mettaReasoning?: string;
}

const DEMO_RESPONSES = {
  analyze: [
    "🔍 **Analyzing wallet with ASI agents...**\n\nMy team is working together:\n• **Orchestrator** coordinating the analysis\n• **Wallet Analyzer** examining on-chain data\n• **MeTTa Engine** applying symbolic reasoning\n• **Blockchain Agent** preparing smart contract updates\n\n⏱️ This usually takes 10-15 seconds...",
    "📊 **Analysis Complete!**\n\nHere's what my agents discovered:\n\n🏆 **Final Score: 875/1000**\n⭐ **Reputation Level: Platinum**\n\n**Detailed Breakdown:**\n• Transactions: 92/100\n• DeFi Engagement: 88/100\n• Security: 95/100\n• Social Proof: 78/100\n\n🧠 **MeTTa Reasoning:** This wallet demonstrates exceptional DeFi participation with consistent high-value transactions and verified social identity.",
    "🎁 **Ready to mint your NFT!**\n\nYour reputation badge is ready:\n• **Diamond-tier visual design**\n• **On-chain SVG generation**\n• **3-second Hedera finality**\n• **Non-transferable soulbound token**\n\nWould you like me to prepare your NFT minting transaction?"
  ],
  compare: [
    "⚖️ **Comparing wallets...**\n\nAnalyzing multiple wallets simultaneously:\n• **Batch processing** for efficiency\n• **Cross-wallet pattern analysis**\n• **Comparative risk assessment**\n• **MeTTa rule application**\n\n⏱️ Processing multiple wallets takes 20-30 seconds...",
    "📈 **Comparison Results!**\n\n**Wallet A (0x742d...): 875/1000** (Platinum)\nvs\n**Wallet B (0x1234...): 650/1000** (Gold)\n\n**Key Differences:**\n• **DeFi Participation:** A shows 88 vs B's 68\n• **Security Score:** A leads 95 vs 82\n• **Social Verification:** A has stronger social proof\n• **Transaction Volume:** Similar activity levels\n\n💡 **Recommendation:** Both wallets show good fundamentals, but A's broader DeFi engagement gives it an edge."
  ],
  explain: [
    "🎯 **Synthia Explained!**\n\nI'm a sophisticated reputation system combining:\n\n🤖 **ASI Alliance Agents**\n• 6 specialized AI agents\n• Real-time coordination\n• Autonomous decision making\n\n🧠 **MeTTa Knowledge Graphs**\n• Symbolic reasoning engine\n• Explainable AI decisions\n• Rule-based trust analysis\n\n⛓️ **Hedera Blockchain**\n• 3-second transaction finality\n• HCS audit trails\n• HTS token integration\n\n**How it works:**\n1️⃣ You provide a wallet address\n2️⃣ Agents analyze 4 dimensions\n3️⃣ MeTTa applies trust rules\n4️⃣ Score stored on Hedera\n5️⃣ You get a soulbound NFT!",
    "🔗 **Technical Architecture:**\n\n**Agent Communication:**\n• **uAgents** protocol for inter-agent messaging\n• **Message models** for structured communication\n• **Protocol handlers** for request coordination\n\n**Smart Contracts:**\n• **Synthia.sol** - Main reputation system\n• **SynthiaNFT.sol** - Soulbound token with SVG generation\n• **Access control** via role-based permissions\n\n**Frontend Integration:**\n• **Real-time agent visualization**\n• **Interactive chat interface**\n• **Live blockchain updates**\n• **Demo mode** for offline experience"
  ]
};

export const ASIOneChatInterface: React.FC = () => {
  const { currentDemoWallet, simulateAnalysis, simulateComparison } = useDemoData();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 **Hi! I'm Synthia, your AI reputation analyst!**\n\nI combine cutting-edge AI with blockchain technology to provide transparent, trustworthy reputation scores.\n\n**Try asking me:**\n• \"Analyze 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\"\n• \"Compare two wallets\"\n• \"How does the system work?\"\n• \"Show me the agent coordination\"\n\n🚀 **Ready to explore?**",
      sender: 'agent',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const detectIntent = (message: string): { type: 'analyze' | 'compare' | 'explain' | 'unknown', wallet?: string, wallets?: string[] } => {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('analyze') || lowerMsg.includes('check') || lowerMsg.includes('score')) {
      const walletMatch = message.match(/0x[a-fA-F0-9]{40}/);
      return { type: 'analyze', wallet: walletMatch ? walletMatch[0] : currentDemoWallet.address };
    }

    if (lowerMsg.includes('compare') || lowerMsg.includes('vs') || lowerMsg.includes('versus')) {
      const walletMatches = message.match(/0x[a-fA-F0-9]{40}/g);
      return { type: 'compare', wallets: walletMatches || [currentDemoWallet.address, '0x1234567890abcdef1234567890abcdef12345678'] };
    }

    if (lowerMsg.includes('explain') || lowerMsg.includes('how') || lowerMsg.includes('what')) {
      return { type: 'explain' };
    }

    return { type: 'unknown' };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const intent = detectIntent(input);

    // Simulate typing delay
    setTimeout(async () => {
      let responseText = '';
      let responseData: ReputationData | undefined;

      switch (intent.type) {
        case 'analyze': {
          if (intent.wallet) {
            // Simulate analysis process
            await simulateAnalysis(intent.wallet);

            const responses = DEMO_RESPONSES.analyze;
            responseText = responses[Math.floor(Math.random() * responses.length)];

            responseData = {
              score: currentDemoWallet.score,
              transaction_score: currentDemoWallet.transactionScore,
              defi_score: currentDemoWallet.defiScore,
              security_score: currentDemoWallet.securityScore,
              social_score: currentDemoWallet.socialScore,
              wallet: intent.wallet,
              mettaReasoning: currentDemoWallet.mettaReasoning.reasoning
            };
          } else {
            responseText = "I'd love to analyze a wallet! Please provide an Ethereum address (0x...).";
          }
          break;
        }

        case 'compare': {
          if (intent.wallets && intent.wallets.length >= 2) {
            await simulateComparison(intent.wallets);
            const responses = DEMO_RESPONSES.compare;
            responseText = responses[Math.floor(Math.random() * responses.length)];
          } else {
            responseText = "To compare wallets, please provide two addresses like: 'Compare 0x123... and 0x456...'";
          }
          break;
        }

        case 'explain': {
          const responses = DEMO_RESPONSES.explain;
          responseText = responses[Math.floor(Math.random() * responses.length)];
          break;
        }

        default: {
          responseText = "🤔 I didn't quite understand that. Try asking me to analyze a wallet, compare wallets, or explain how the system works!";
        }
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'agent',
        timestamp: Date.now(),
        data: responseData,
        action: intent.type !== 'unknown' ? intent.type : undefined
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col bg-card/95 backdrop-blur-sm border-primary/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent p-3 rounded-t-lg flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-foreground flex items-center gap-1">
              ASI:One Chat Agent
              <Sparkles className="w-3 h-3" />
            </h2>
            <p className="text-xs text-primary-foreground/80">
              Powered by Fetch.ai + MeTTa Reasoning
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-3 space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] rounded-2xl p-3 ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>

                {/* Show reputation data if available */}
                {msg.data && msg.data.score && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-3 h-3" />
                      <span className="font-semibold text-sm">Reputation Analysis</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-background/50 rounded-lg p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingUp className="w-3 h-3" />
                          <span className="font-medium">Transactions</span>
                        </div>
                        <div className="text-base font-bold">{msg.data.transaction_score}/100</div>
                      </div>

                      <div className="bg-background/50 rounded-lg p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="w-3 h-3" />
                          <span className="font-medium">DeFi</span>
                        </div>
                        <div className="text-base font-bold">{msg.data.defi_score}/100</div>
                      </div>

                      <div className="bg-background/50 rounded-lg p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Shield className="w-3 h-3" />
                          <span className="font-medium">Security</span>
                        </div>
                        <div className="text-base font-bold">{msg.data.security_score}/100</div>
                      </div>

                      <div className="bg-background/50 rounded-lg p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Sparkles className="w-3 h-3" />
                          <span className="font-medium">Social</span>
                        </div>
                        <div className="text-base font-bold">{msg.data.social_score}/100</div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="text-base font-bold text-center mb-1">
                        🏆 {msg.data.score}/1000
                      </div>
                      {msg.data.mettaReasoning && (
                        <div className="text-xs bg-background/30 rounded p-2">
                          <div className="font-medium mb-1">🧠 MeTTa Reasoning:</div>
                          <div className="text-muted-foreground">{msg.data.mettaReasoning}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl p-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about reputation, wallets, or how Synthia works..."
            className="flex-1 text-sm"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput(`Analyze ${currentDemoWallet.address}`)}
            className="text-xs px-2 py-1 h-auto"
          >
            Analyze Demo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("How does the system work?")}
            className="text-xs px-2 py-1 h-auto"
          >
            Explain System
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Compare two wallets")}
            className="text-xs px-2 py-1 h-auto"
          >
            Compare Wallets
          </Button>
        </div>
      </div>
    </Card>
  );
};