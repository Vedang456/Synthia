import { useState } from "react";
import { ArrowLeft, Book, Code, Lightbulb, Rocket, Shield, Users, Zap, Activity, Bot, Network, Database, Cpu, Globe, Settings, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const navigation = [
    { id: "overview", label: "Project Overview", icon: Book },
    { id: "architecture", label: "System Architecture", icon: Network },
    { id: "agents", label: "Multi-Agent System", icon: Bot },
    { id: "contracts", label: "Smart Contracts", icon: Database },
    { id: "frontend", label: "Frontend & Demo", icon: Globe },
    { id: "deployment", label: "Deployment Guide", icon: Rocket },
    { id: "integration", label: "Integration Details", icon: Code },
    { id: "judges", label: "For ETHOnline Judges", icon: CheckCircle },
  ];

  const sections = {
    overview: {
      title: "Synthia Documentation - Complete Project Guide",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Synthia - AI-Powered Web3 Reputation System
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-4">
                A revolutionary multi-agent AI system that provides comprehensive reputation analysis for Web3 wallets using **MeTTa symbolic reasoning** and **Hedera blockchain** technology.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-5 h-5 text-primary" />
                      <span className="font-semibold">4 AI Agents</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Specialized ASI agents working in coordination</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Multi-Chain</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Hedera testnet with 3-second finality</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Explainable AI</span>
                    </div>
                    <p className="text-sm text-muted-foreground">MeTTa symbolic reasoning with transparency</p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">🎯 Quick Access Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Button asChild className="flex items-center gap-2">
                    <a href="https://synnthia.netlify.app" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      View Live Demo
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="flex items-center gap-2">
                    <a href="https://hashscan.io/testnet/contract/0x88FF715f1c23C2061133994cFd58c1E35A05beA2" target="_blank" rel="noopener noreferrer">
                      <Database className="w-4 h-4" />
                      View Main Contract
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="flex items-center gap-2">
                    <a href="https://hashscan.io/testnet/contract/0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF" target="_blank" rel="noopener noreferrer">
                      <Database className="w-4 h-4" />
                      View NFT Contract
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="flex items-center gap-2">
                    <a href="https://agentverse.ai/agents/details/agent1qf46caua9sukl5kk57nam32vxcnsh7jq8eltcp3p9wmqnpmu4a9p2eky5hy/profile" target="_blank" rel="noopener noreferrer">
                      <Bot className="w-4 h-4" />
                      Orchestrator Profile
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="flex items-center gap-2">
                    <a href="https://agentverse.ai/agents/details/agent1qf5hfn9gmau9x05yvr8a73aav3jxtkcg9yxhagntqcrv4g87udewsjtnh7k/profile" target="_blank" rel="noopener noreferrer">
                      <Bot className="w-4 h-4" />
                      Blockchain Profile
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="flex items-center gap-2">
                    <a href="https://agentverse.ai/agents/details/agent1qv9d2feshre7xxpgzsxksa7guerplhjm77vwgh8vmp8yn74yz6qpxxlemgd/profile" target="_blank" rel="noopener noreferrer">
                      <Bot className="w-4 h-4" />
                      Analyzer Profile
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="flex items-center gap-2">
                    <a href="https://agentverse.ai/agents/details/agent1qvczkj6p98383w2mwhxq7xw30t6q7ve3pty2kj4uuuntg8uwl33xysuq200/profile" target="_blank" rel="noopener noreferrer">
                      <Bot className="w-4 h-4" />
                      Chat Agent Profile
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">🎯 What Makes Synthia Special</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">Multi-Agent Architecture</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>4 Specialized Agents</strong> - Each with unique role and responsibilities</li>
                  <li><strong>Real-time Coordination</strong> - Agents communicate via uAgents protocol</li>
                  <li><strong>Fault Tolerance</strong> - System continues if individual agents fail</li>
                  <li><strong>Scalable Design</strong> - Add more agents as needed</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">Blockchain Integration</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Hedera Testnet</strong> - Live smart contracts deployed</li>
                  <li><strong>Soulbound NFTs</strong> - Non-transferable reputation badges</li>
                  <li><strong>HCS Audit Trails</strong> - Immutable transparency records</li>
                  <li><strong>3-Second Finality</strong> - Fast transaction confirmation</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )
    },

    architecture: {
      title: "System Architecture - Complete Technical Overview",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">🏗️ Complete System Architecture</h2>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">🎯 Quick Access Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button asChild className="flex items-center gap-2">
                  <a href="https://synnthia.netlify.app" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    View Live Demo
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x88FF715f1c23C2061133994cFd58c1E35A05beA2" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View Main Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View NFT Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf46caua9sukl5kk57nam32vxcnsh7jq8eltcp3p9wmqnpmu4a9p2eky5hy/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                     Orchestrator Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf5hfn9gmau9x05yvr8a73aav3jxtkcg9yxhagntqcrv4g87udewsjtnh7k/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Blockchain Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qv9d2feshre7xxpgzsxksa7guerplhjm77vwgh8vmp8yn74yz6qpxxlemgd/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Analyzer Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qvczkj6p98383w2mwhxq7xw30t6q7ve3pty2kj4uuuntg8uwl33xysuq200/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Chat Agent Profile
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">🎪 Three-Component Architecture</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">🌐 Frontend (React + TypeScript)</h4>
                    <p className="text-muted-foreground mb-2">Modern web interface with real-time agent monitoring and blockchain integration.</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">React 18</Badge>
                      <Badge variant="outline">TypeScript</Badge>
                      <Badge variant="outline">Vite</Badge>
                      <Badge variant="outline">Tailwind CSS</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">🤖 Multi-Agent Backend (Python)</h4>
                    <p className="text-muted-foreground mb-2">4 specialized AI agents using Fetch.ai uAgents framework with MeTTa reasoning.</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Python 3.8+</Badge>
                      <Badge variant="outline">uAgents</Badge>
                      <Badge variant="outline">MeTTa AI</Badge>
                      <Badge variant="outline">WebSockets</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">⛓️ Smart Contracts (Solidity)</h4>
                    <p className="text-muted-foreground mb-2">Hedera blockchain integration with role-based access control and NFT generation.</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Solidity 0.8.28</Badge>
                      <Badge variant="outline">Hardhat</Badge>
                      <Badge variant="outline">OpenZeppelin</Badge>
                      <Badge variant="outline">HCS + HTS</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">🔄 Agent Communication Flow</h2>

            <div className="bg-muted/30 rounded-lg p-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-primary/10">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">User Request → Chat Agent</h4>
                    <p className="text-sm text-muted-foreground">Natural language processing converts user queries to structured requests</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-primary/10">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Orchestrator Coordination</h4>
                    <p className="text-sm text-muted-foreground">Routes requests to appropriate agents and manages the workflow lifecycle</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-primary/10">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Wallet Analysis → MeTTa Reasoning</h4>
                    <p className="text-sm text-muted-foreground">Deep wallet analysis with 10 symbolic AI rules applied transparently</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-primary/10">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Blockchain Execution → Hedera</h4>
                    <p className="text-sm text-muted-foreground">Score updates written to smart contracts with 3-second finality</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-card/50 rounded-lg border border-primary/10">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">5</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">NFT Update → User Display</h4>
                    <p className="text-sm text-muted-foreground">Dynamic reputation badges automatically update with new tier styling</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-primary" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Analysis Time</span>
                      <span className="font-semibold">10-15 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blockchain Finality</span>
                      <span className="font-semibold">3 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost per Analysis</span>
                      <span className="font-semibold">$0.0001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent Coordination</span>
                      <span className="font-semibold">Sub-second</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Access Control</span>
                      <span className="font-semibold">Role-based</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Message Signing</span>
                      <span className="font-semibold">Cryptographic</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Audit Trail</span>
                      <span className="font-semibold">HCS Immutable</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Consensus</span>
                      <span className="font-semibold">Hedera aBFT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    agents: {
      title: "Multi-Agent AI System - Detailed Agent Architecture",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">🤖 4 Specialized AI Agents</h2>

            <p className="text-muted-foreground mb-6">
              Synthia employs a sophisticated multi-agent architecture where each agent has a single responsibility and communicates through the uAgents protocol. This ensures fault tolerance, scalability, and transparent AI decision-making.
            </p>

            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    🎭 ASI:One Chat Agent
                  </CardTitle>
                  <CardDescription>Port: 8000 | Status: Active | Purpose: Natural Language Interface</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Core Responsibilities</h4>
                      <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                        <li>Natural language processing for user queries</li>
                        <li>Intent recognition (analysis vs. comparison)</li>
                        <li>Multi-wallet batch analysis handling</li>
                        <li>Contextual response generation</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Example Interactions</h4>
                      <div className="bg-muted/50 rounded p-3 font-mono text-sm">
                        <div className="text-green-400">Input: "Analyze 0x742d35..."</div>
                        <div className="text-blue-400">Output: ScoreRequest(wallet="0x742d35...", id="req_001")</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-primary" />
                    🎼 Orchestrator Agent
                  </CardTitle>
                  <CardDescription>Port: 8001 | Status: Active | Purpose: System Coordination</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Coordination Features</h4>
                      <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                        <li>Request lifecycle management with unique tracking IDs</li>
                        <li>Agent load balancing and intelligent routing</li>
                        <li>Error handling and automatic retry logic</li>
                        <li>Performance monitoring and health checks</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Smart Contract Role</h4>
                      <div className="bg-muted/50 rounded p-3 font-mono text-sm">
                        <div className="text-yellow-400">ORCHESTRATOR_ROLE</div>
                        <div className="text-muted-foreground">Can register agents and manage system state</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    🔍 Wallet Analyzer Agent
                  </CardTitle>
                  <CardDescription>Port: 8002 | Status: Active | Purpose: AI Reasoning Engine with MeTTa Integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">MeTTa Reasoning Rules</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-muted/50 rounded p-3 text-sm">
                          <div className="font-semibold text-green-400">Applied Rules:</div>
                          <div className="text-muted-foreground text-xs mt-1">
                            • elite_defi_user<br/>
                            • security_conscious<br/>
                            • long_term_holder<br/>
                            • governance_participant
                          </div>
                        </div>

                        <div className="bg-muted/50 rounded p-3 text-sm">
                          <div className="font-semibold text-blue-400">Score Breakdown:</div>
                          <div className="text-muted-foreground text-xs mt-1">
                            • Transaction: 80/100<br/>
                            • DeFi: 70/100<br/>
                            • Security: 85/100<br/>
                            • Social: 65/100
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Smart Contract Role</h4>
                      <div className="bg-muted/50 rounded p-3 font-mono text-sm">
                        <div className="text-yellow-400">ANALYZER_ROLE</div>
                        <div className="text-muted-foreground">EVM Address: 0x3b4D391c2e1DE66CAeA6dEDa6A51E4a5180Bd3F7</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Explainable AI Features</h4>
                      <div className="bg-muted/50 rounded p-3 font-mono text-sm">
                        <div className="text-green-400 mb-2">Score: 75/100 (Gold Tier)</div>
                        <div className="text-muted-foreground text-xs">
                          ✓ Elite DeFi User (+20) - Active across 5+ protocols<br/>
                          ✓ Security Conscious (+15) - No risky interactions<br/>
                          ✓ Long-term Holder (+10) - 2+ years active<br/>
                          ✓ High Volume (+5) - Consistent activity<br/>
                          ✓ Social Validator (+5) - Governance participation
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Transparency Benefits</h4>
                      <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                        <li>Human-readable reasoning explanations</li>
                        <li>Deterministic results based on wallet activity</li>
                        <li>Auditable decision-making process</li>
                        <li>Weighted rule priority system</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>


              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    ⛓️ Blockchain Agent
                  </CardTitle>
                  <CardDescription>Port: 8003 | Status: Active | Purpose: Hedera Integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">On-Chain Operations</h4>
                      <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                        <li>Smart contract interaction for score updates</li>
                        <li>Dynamic NFT minting and badge updates</li>
                        <li>HCS audit logging for transparency</li>
                        <li>A2A/AP2 protocol coordination</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Contract Integration</h4>
                      <div className="bg-muted/50 rounded p-3 font-mono text-sm">
                        <div className="text-yellow-400">BLOCKCHAIN_ROLE</div>
                        <div className="text-muted-foreground">EVM Address: 0x509773c61012620fCBb8bED0BccAE44f1A93AD0C</div>
                        <div className="text-blue-400 mt-2">Functions:</div>
                        <div className="text-muted-foreground text-xs">
                          • updateScore() → Hedera contract<br/>
                          • updateReputation() → NFT contract<br/>
                          • logAnalysis() → HCS audit trail
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-3">🎪 Agent Communication Protocol</h3>
              <p className="text-muted-foreground mb-4">
                All agents communicate using standardized message models through the uAgents protocol:
              </p>
              <div className="bg-muted/50 rounded p-3 font-mono text-sm">
                <div className="text-blue-400">Message Types:</div>
                <div className="text-muted-foreground text-xs mt-1">
                  ScoreRequest | ScoreAnalysis | BatchAnalysisRequest<br/>
                  AgentStatus | HealthCheck | ErrorNotification
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    contracts: {
      title: "Smart Contracts - Hedera Blockchain Integration",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">📋 Live Smart Contracts on Hedera Testnet</h2>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">🎯 Quick Access Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button asChild className="flex items-center gap-2">
                  <a href="https://synnthia.netlify.app" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    View Live Demo
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x88FF715f1c23C2061133994cFd58c1E35A05beA2" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View Main Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View NFT Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf46caua9sukl5kk57nam32vxcnsh7jq8eltcp3p9wmqnpmu4a9p2eky5hy/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                     Orchestrator Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf5hfn9gmau9x05yvr8a73aav3jxtkcg9yxhagntqcrv4g87udewsjtnh7k/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Blockchain Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qv9d2feshre7xxpgzsxksa7guerplhjm77vwgh8vmp8yn74yz6qpxxlemgd/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Analyzer Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qvczkj6p98383w2mwhxq7xw30t6q7ve3pty2kj4uuuntg8uwl33xysuq200/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Chat Agent Profile
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Synthia Main Contract
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="font-mono text-sm bg-muted/50 rounded p-2 mb-2">
                        0x88FF715f1c23C2061133994cFd58c1E35A05beA2
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Key Features</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Multi-Agent</Badge>
                        <Badge variant="outline" className="text-xs">Role-Based</Badge>
                        <Badge variant="outline" className="text-xs">HCS Audit</Badge>
                        <Badge variant="outline" className="text-xs">Batch Processing</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    SynthiaNFT Contract
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="font-mono text-sm bg-muted/50 rounded p-2 mb-2">
                        0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">NFT Features</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Soulbound</Badge>
                        <Badge variant="outline" className="text-xs">Dynamic SVG</Badge>
                        <Badge variant="outline" className="text-xs">Tier-Based</Badge>
                        <Badge variant="outline" className="text-xs">Non-Transferable</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">🔄 Agent-Contract Integration</h2>

            <div className="space-y-4">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">🎭 Agent Registration Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded p-4 font-mono text-sm">
                    <div className="text-yellow-400 mb-2">// 1. Deploy contracts to Hedera</div>
                    <div className="text-muted-foreground mb-2">npx hardhat run scripts/deploy.ts --network testnet</div>

                    <div className="text-yellow-400 mb-2">// 2. Register agent EVM addresses</div>
                    <div className="text-muted-foreground mb-2">npx hardhat run scripts/register-agents.ts --network testnet</div>

                    <div className="text-green-400 mt-3">// Result: Agent permissions</div>
                    <div className="text-muted-foreground text-xs">
                      ANALYZER_ROLE: 0x3b4D391c2e1DE66CAeA6dEDa6A51E4a5180Bd3F7<br/>
                      BLOCKCHAIN_ROLE: 0x509773c61012620fCBb8bED0BccAE44f1A93AD0C
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">⚡ Score Update Workflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold text-sm">Wallet Analyzer → MeTTa Reasoning</h4>
                        <p className="text-xs text-muted-foreground">Processes wallet data and applies symbolic AI rules</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold text-sm">Blockchain Agent → Contract Call</h4>
                        <p className="text-xs text-muted-foreground">Submits score with reasoning hash to verify transparency</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold text-sm">NFT Auto-Update → Badge Generation</h4>
                        <p className="text-xs text-muted-foreground">Reputation badge automatically updates with new tier styling</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">4</div>
                      <div>
                        <h4 className="font-semibold text-sm">HCS Audit → Immutable Record</h4>
                        <p className="text-xs text-muted-foreground">Analysis logged to Hedera Consensus Service for transparency</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">🔐 Security Architecture</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card/50 backdrop-blur-sm border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Smart Contract Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>OpenZeppelin AccessControl</li>
                    <li>Role-based permissions</li>
                    <li>Input validation</li>
                    <li>Reentrancy protection</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Network className="w-5 h-5 text-blue-500" />
                    Agent Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Cryptographic authentication</li>
                    <li>Message signing</li>
                    <li>Rate limiting</li>
                    <li>Error recovery</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    Network Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Hedera aBFT consensus</li>
                    <li>3-second finality</li>
                    <li>Geographic distribution</li>
                    <li>Enterprise security</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-3">🧪 Verification Commands</h3>
              <div className="bg-muted/50 rounded p-4 font-mono text-sm">
                <div className="text-green-400 mb-2"># Test agent integration</div>
                <div className="text-muted-foreground mb-2">npx hardhat test --grep "Multi-Agent"</div>

                <div className="text-green-400 mb-2"># Check live deployment</div>
                <div className="text-muted-foreground mb-2">curl http://localhost:8000/status</div>

                <div className="text-green-400 mb-2"># Verify blockchain state</div>
                <div className="text-muted-foreground">open https://hashscan.io/testnet/contract/0x88FF715f1c23C2061133994cFd58c1E35A05beA2</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    frontend: {
      title: "Frontend & Demo Experience - React Implementation",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">🌐 React Frontend Architecture</h2>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">🎯 Quick Access Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button asChild className="flex items-center gap-2">
                  <a href="https://synnthia.netlify.app" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    View Live Demo
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x88FF715f1c23C2061133994cFd58c1E35A05beA2" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View Main Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View NFT Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf46caua9sukl5kk57nam32vxcnsh7jq8eltcp3p9wmqnpmu4a9p2eky5hy/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                     Orchestrator Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf5hfn9gmau9x05yvr8a73aav3jxtkcg9yxhagntqcrv4g87udewsjtnh7k/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Blockchain Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qv9d2feshre7xxpgzsxksa7guerplhjm77vwgh8vmp8yn74yz6qpxxlemgd/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Analyzer Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qvczkj6p98383w2mwhxq7xw30t6q7ve3pty2kj4uuuntg8uwl33xysuq200/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Chat Agent Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://github.com/Vedang456/synthia/tree/main/frontend" target="_blank" rel="noopener noreferrer">
                    <Code className="w-4 h-4" />
                    View Source Code
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">🎯 Production-Ready Demo Experience</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Live Demo Features</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Real-time Agent Simulation</strong> - Watch 4 AI agents coordinate</li>
                    <li><strong>Interactive Workflow</strong> - 15-second orchestrated analysis</li>
                    <li><strong>Live Blockchain Integration</strong> - Real Hedera testnet connectivity</li>
                    <li><strong>Dynamic NFT Visualization</strong> - Tier-based reputation badges</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Technical Excellence</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Type Safety</strong> - Full TypeScript implementation</li>
                    <li><strong>Performance</strong> - Optimized with Vite and code splitting</li>
                    <li><strong>Responsive</strong> - Mobile-first design for all devices</li>
                    <li><strong>Accessibility</strong> - WCAG compliant with keyboard navigation</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">🎨 UI Components & Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Agent Monitoring Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Agent Status Cards</span>
                      <Badge variant="outline">Real-time</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Performance Metrics</span>
                      <Badge variant="outline">Live Updates</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Message Flow Animation</span>
                      <Badge variant="outline">WebSocket</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">System Health</span>
                      <Badge variant="outline">Monitoring</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Reputation Display System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Score Visualization</span>
                      <Badge variant="outline">Dynamic</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">NFT Badge Gallery</span>
                      <Badge variant="outline">Soulbound</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tier Transitions</span>
                      <Badge variant="outline">Animated</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Blockchain Events</span>
                      <Badge variant="outline">Live</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Wallet Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Multi-Chain Support</span>
                      <Badge variant="outline">Hedera</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">WalletConnect Protocol</span>
                      <Badge variant="outline">Reown</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Secure Transactions</span>
                      <Badge variant="outline">Signed</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Account Management</span>
                      <Badge variant="outline">Seamless</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Demo Mode Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Agent Simulation</span>
                      <Badge variant="outline">Realistic</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Sample Data</span>
                      <Badge variant="outline">Curated</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Interactive Elements</span>
                      <Badge variant="outline">Clickable</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Performance Demo</span>
                      <Badge variant="outline">Optimized</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">🚀 Demo Workflow</h2>

            <div className="space-y-4">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">🎬 Complete Demo Sequence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                      <div>
                        <h4 className="font-semibold">Visit Live Demo</h4>
                        <p className="text-sm text-muted-foreground">Navigate to synthia.netlify.app and explore the interface</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                      <div>
                        <h4 className="font-semibold">Start Demo Mode</h4>
                        <p className="text-sm text-muted-foreground">Click the demo button to see the complete multi-agent workflow</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                      <div>
                        <h4 className="font-semibold">Watch Agent Coordination</h4>
                        <p className="text-sm text-muted-foreground">See all 4 agents work together in real-time with status updates</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                      <div>
                        <h4 className="font-semibold">Observe Score Evolution</h4>
                        <p className="text-sm text-muted-foreground">Watch reputation scores update with transparent MeTTa explanations</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">5</div>
                      <div>
                        <h4 className="font-semibold">Verify Blockchain Integration</h4>
                        <p className="text-sm text-muted-foreground">Click HashScan links to see real Hedera testnet transactions</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-3">🎯 What Judges Should Look For</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Technical Features</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Real-time agent status monitoring</li>
                    <li>Seamless blockchain integration</li>
                    <li>Responsive design on all devices</li>
                    <li>Smooth animations and transitions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">User Experience</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Intuitive navigation and controls</li>
                    <li>Clear visual feedback for all actions</li>
                    <li>Professional cyberpunk aesthetic</li>
                    <li>Accessible design patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    deployment: {
      title: "Deployment Guide - Complete Setup Instructions",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">🚀 Complete Deployment Guide</h2>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">🎯 Quick Access Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button asChild className="flex items-center gap-2">
                  <a href="https://synnthia.netlify.app" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    View Live Demo
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x88FF715f1c23C2061133994cFd58c1E35A05beA2" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View Main Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View NFT Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf46caua9sukl5kk57nam32vxcnsh7jq8eltcp3p9wmqnpmu4a9p2eky5hy/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Orchestrator Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf5hfn9gmau9x05yvr8a73aav3jxtkcg9yxhagntqcrv4g87udewsjtnh7k/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Blockchain Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qv9d2feshre7xxpgzsxksa7guerplhjm77vwgh8vmp8yn74yz6qpxxlemgd/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Analyzer Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qvczkj6p98383w2mwhxq7xw30t6q7ve3pty2kj4uuuntg8uwl33xysuq200/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Chat Agent Profile
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">🎯 Quick Setup for ETHOnline Judges</h3>

              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Step 1: Clone Repository</h4>
                  <div className="font-mono text-sm bg-muted/30 rounded p-3">
                    git clone https://github.com/your-username/synthia.git<br/>
                    cd synthia
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Step 2: One-Command Setup</h4>
                  <div className="font-mono text-sm bg-muted/30 rounded p-3">
                    chmod +x setup.sh<br/>
                    ./setup.sh
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">This installs all dependencies, deploys contracts, and starts all services.</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Step 3: Verify Everything Works</h4>
                  <div className="font-mono text-sm bg-muted/30 rounded p-3">
                    # Check frontend<br/>
                    open http://localhost:8080<br/><br/>

                    # Check agents<br/>
                    curl http://localhost:8000/status<br/><br/>

                    # Check contracts<br/>
                    open https://hashscan.io/testnet/contract/0x88FF715f1c23C2061133994cFd58c1E35A05beA2
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">🛠️ Manual Setup Instructions</h2>

            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    1. Smart Contract Deployment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Deploy to Hedera Testnet</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        # Install Hardhat dependencies<br/>
                        npm install<br/><br/>

                        # Deploy contracts<br/>
                        npx hardhat run scripts/deploy.ts --network testnet<br/><br/>

                        # Verify deployment<br/>
                        echo "Main Contract: https://hashscan.io/testnet/contract/0x88FF715f1c23C2061133994cFd58c1E35A05beA2"<br/>
                        echo "NFT Contract: https://hashscan.io/testnet/contract/0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF"
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Register Agent Permissions</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        # Register agent EVM addresses with contracts<br/>
                        npx hardhat run scripts/register-agents.ts --network testnet<br/><br/>

                        # This grants ANALYZER_ROLE and BLOCKCHAIN_ROLE to agents
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    2. Multi-Agent System Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Install Python Dependencies</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        cd synthia-agents<br/>
                        python3 -m venv venv<br/>
                        source venv/bin/activate<br/>
                        pip install -r requirements.txt
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Configure Environment</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        cp .env.example .env<br/><br/>

                        # Edit .env with your configuration:<br/>
                        echo "AGENTVERSE_API_KEY=your_key" &gt;&gt; .env<br/>
                        echo "SYNTHIA_CONTRACT_ADDRESS=0x88FF715f1c23C2061133994cFd58c1E35A05beA2" &gt;&gt; .env
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Start All Agents</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        # Terminal 1: Chat Agent<br/>
                        python agents/asi_one_chat_agent.py<br/><br/>

                        # Terminal 2: Orchestrator<br/>
                        python agents/orchestrator.py<br/><br/>

                        # Terminal 3: Wallet Analyzer<br/>
                        python agents/wallet_analyzer.py<br/><br/>

                        # Terminal 4: Blockchain Agent<br/>
                        python agents/blockchain_agent.py
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    3. React Frontend Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Install Frontend Dependencies</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        cd frontend<br/>
                        npm install<br/><br/>

                        # Copy environment configuration<br/>
                        cp .env.example .env
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Configure for Live Integration</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        # Edit frontend/.env with contract addresses:<br/>
                        echo "VITE_SYNTHIA_CONTRACT_ADDRESS=0x88FF715f1c23C2061133994cFd58c1E35A05beA2" &gt;&gt; .env<br/>
                        echo "VITE_API_BASE_URL=http://localhost:8000" &gt;&gt; .env
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Start Development Server</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        npm run dev<br/><br/>

                        # Frontend: http://localhost:8080<br/>
                        # Demo Mode: Automatically enabled when agents unavailable
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">🧪 Testing & Verification</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Agent Integration Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm bg-muted/50 rounded p-3">
                    # Test agent communication<br/>
                    python -m pytest tests/test_agent_communication.py -v<br/><br/>

                    # Test MeTTa reasoning<br/>
                    python -m pytest tests/test_metta_reasoning.py -v<br/><br/>

                    # Test smart contract integration<br/>
                    npx hardhat test tests/agent-integration.test.js
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-blue-500" />
                    End-to-End Testing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm bg-muted/50 rounded p-3">
                    # Test complete workflow<br/>
                    curl -X POST http://localhost:8000/analyze \&#10;                    -H "Content-Type: application/json" \&#10;                    -d '&#123;"wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"&#125;'<br/><br/>

                    # Verify blockchain state<br/>
                    npx hardhat run scripts/verify-analysis.ts --network testnet
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-3">🎯 Verification Checklist for Judges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">✅ System Status</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>All 4 agents responding to API calls</li>
                    <li>Frontend demo mode working</li>
                    <li>Smart contracts deployed on Hedera</li>
                    <li>Real-time agent coordination visible</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">✅ Live Integration</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Agent-to-contract communication</li>
                    <li>Blockchain transaction verification</li>
                    <li>NFT badge updates</li>
                    <li>HashScan transaction links working</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    integration: {
      title: "Integration Details - How Everything Works Together",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-4">🔗 Complete Integration Architecture</h2>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">🎯 Quick Access Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button asChild className="flex items-center gap-2">
                  <a href="https://synnthia.netlify.app" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    View Live Demo
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x88FF715f1c23C2061133994cFd58c1E35A05beA2" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View Main Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View NFT Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf46caua9sukl5kk57nam32vxcnsh7jq8eltcp3p9wmqnpmu4a9p2eky5hy/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Orchestrator Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf5hfn9gmau9x05yvr8a73aav3jxtkcg9yxhagntqcrv4g87udewsjtnh7k/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Blockchain Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qv9d2feshre7xxpgzsxksa7guerplhjm77vwgh8vmp8yn74yz6qpxxlemgd/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Analyzer Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qvczkj6p98383w2mwhxq7xw30t6q7ve3pty2kj4uuuntg8uwl33xysuq200/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Chat Agent Profile
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">🎪 End-to-End Data Flow</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Frontend Layer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                        <li>React + TypeScript interface</li>
                        <li>Real-time agent monitoring</li>
                        <li>Blockchain event listening</li>
                        <li>Responsive design</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        Agent Layer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                        <li>4 specialized AI agents</li>
                        <li>MeTTa symbolic reasoning</li>
                        <li>uAgents communication</li>
                        <li>Python implementation</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        Blockchain Layer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                        <li>Hedera smart contracts</li>
                        <li>Role-based access control</li>
                        <li>Soulbound NFT system</li>
                        <li>HCS audit trails</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">🔄 Integration Points</h2>

            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">🌐 Frontend ↔ Agents Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">API Communication</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        // Real-time agent status monitoring<br/>
                        const agentStatus = await fetch('/api/status');<br/><br/>

                        // Submit analysis request<br/>
                        const response = await fetch('/api/analyze', &#123;<br/>
                        &nbsp;&nbsp;method: 'POST',<br/>
                        &nbsp;&nbsp;body: JSON.stringify(&#123;wallet_address: '0x742d35...'&#125;)<br/>
                        &#125;);
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">WebSocket Integration</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        // Real-time agent coordination updates<br/>
                        const ws = new WebSocket('ws://localhost:8000');<br/>
                        ws.onmessage = (event) =&#62; &#123;<br/>
                        &nbsp;&nbsp;const data = JSON.parse(event.data);<br/>
                        &nbsp;&nbsp;updateAgentStatus(data.agent, data.status);<br/>
                        &#125;;
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">🤖 Agents ↔ Contracts Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Role-Based Contract Calls</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        // Analyzer agent updates scores<br/>
                        contract.updateScore(<br/>
                        &nbsp;&nbsp;user_address,<br/>
                        &nbsp;&nbsp;score,<br/>
                        &nbsp;&nbsp;mettaRulesHash,<br/>
                        &nbsp;&nbsp;scoreAdjustment<br/>
                        ) // Only ANALYZER_ROLE can call
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">NFT Auto-Updates</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        // Blockchain agent triggers NFT update<br/>
                        nftContract.updateReputation(user, score);<br/><br/>

                        // Results in new SVG badge generation<br/>
                        // Badge color changes based on tier
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">⛓️ Contract ↔ Blockchain Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Hedera Services Integration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-muted/50 rounded p-3 text-sm">
                          <div className="font-semibold text-green-400">Smart Contracts</div>
                          <div className="text-muted-foreground text-xs">Score storage & agent permissions</div>
                        </div>

                        <div className="bg-muted/50 rounded p-3 text-sm">
                          <div className="font-semibold text-blue-400">HCS Audit</div>
                          <div className="text-muted-foreground text-xs">Immutable analysis records</div>
                        </div>

                        <div className="bg-muted/50 rounded p-3 text-sm">
                          <div className="font-semibold text-purple-400">HTS Tokens</div>
                          <div className="text-muted-foreground text-xs">Reputation NFTs (if needed)</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Event-Driven Updates</h4>
                      <div className="font-mono text-sm bg-muted/50 rounded p-3">
                        // Frontend listens for contract events<br/>
                        contract.on('ScoreUpdated', (user, score, analyzer) =&gt; &#123;<br/>
                        &nbsp;&nbsp;console.log('Score updated: ' + score);<br/>
                        &nbsp;&nbsp;updateUI(user, score);<br/>
                        &#125;);<br/><br/>

                        // Real-time NFT updates<br/>
                        nftContract.on('ReputationUpdated', (tokenId, newTier) =&gt; &#123;<br/>
                        &nbsp;&nbsp;refreshNFTDisplay(tokenId);<br/>
                        &#125;);
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">📊 Integration Testing</h2>

            <div className="space-y-4">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">🧪 End-to-End Integration Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                      <div>
                        <h4 className="font-semibold text-sm">Multi-Agent Communication</h4>
                        <p className="text-xs text-muted-foreground">Test uAgents protocol and message routing</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                      <div>
                        <h4 className="font-semibold text-sm">MeTTa Reasoning Integration</h4>
                        <p className="text-xs text-muted-foreground">Verify symbolic AI rule application and explanations</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                      <div>
                        <h4 className="font-semibold text-sm">Smart Contract Authorization</h4>
                        <p className="text-xs text-muted-foreground">Test role-based access control and agent permissions</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">4</div>
                      <div>
                        <h4 className="font-semibold text-sm">Blockchain State Synchronization</h4>
                        <p className="text-xs text-muted-foreground">Verify real-time UI updates from contract events</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-3">🎯 Integration Verification Commands</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded p-4">
                  <h4 className="font-semibold mb-2">Test Agent APIs</h4>
                  <div className="font-mono text-sm">
                    curl http://localhost:8000/status<br/>
                    curl http://localhost:8001/health<br/>
                    curl http://localhost:8002/metrics
                  </div>
                </div>

                <div className="bg-muted/50 rounded p-4">
                  <h4 className="font-semibold mb-2">Test Smart Contracts</h4>
                  <div className="font-mono text-sm">
                    npx hardhat run scripts/check-agents.ts<br/>
                    npx hardhat run scripts/verify-integration.ts<br/>
                    open https://hashscan.io/testnet/...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    judges: {
      title: "For ETHOnline Judges - Evaluation Guide",
      content: (
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                ETHOnline 2025 Evaluation Guide
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-4">
                Complete guide for judges to understand and evaluate the Synthia multi-agent AI reputation system.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card/50 backdrop-blur-sm border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">ASI Alliance Track</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Multi-agent system with MeTTa reasoning</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-blue-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold">Hedera Track</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Enterprise blockchain integration</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                      <span className="font-semibold">Hardhat Track</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Advanced deployment and testing</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">🎯 Quick Access Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button asChild className="flex items-center gap-2">
                  <a href="https://synnthia.netlify.app" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    View Live Demo
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x88FF715f1c23C2061133994cFd58c1E35A05beA2" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View Main Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://hashscan.io/testnet/contract/0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF" target="_blank" rel="noopener noreferrer">
                    <Database className="w-4 h-4" />
                    View NFT Contract
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf46caua9sukl5kk57nam32vxcnsh7jq8eltcp3p9wmqnpmu4a9p2eky5hy/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Orchestrator Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qf5hfn9gmau9x05yvr8a73aav3jxtkcg9yxhagntqcrv4g87udewsjtnh7k/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Blockchain Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qv9d2feshre7xxpgzsxksa7guerplhjm77vwgh8vmp8yn74yz6qpxxlemgd/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Analyzer Profile
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <a href="https://agentverse.ai/agents/details/agent1qvczkj6p98383w2mwhxq7xw30t6q7ve3pty2kj4uuuntg8uwl33xysuq200/profile" target="_blank" rel="noopener noreferrer">
                    <Bot className="w-4 h-4" />
                    Chat Agent Profile
                  </a>
                </Button>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">🏆 Track Compliance Checklist</h2>

            <div className="space-y-6">
              <Card className="bg-card/50 backdrop-blur-sm border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <Bot className="w-5 h-5" />
                    ASI Alliance Track - Multi-Agent AI System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="font-semibold">4+ Specialized Agents</span>
                        <p className="text-sm text-muted-foreground">Complete multi-agent ecosystem with unique roles</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="font-semibold">uAgents Communication Protocol</span>
                        <p className="text-sm text-muted-foreground">All agents communicate via Fetch.ai uAgents framework</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="font-semibold">Natural Language Interface</span>
                        <p className="text-sm text-muted-foreground">Chat agent processes human language queries</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="font-semibold">MeTTa Symbolic Reasoning</span>
                        <p className="text-sm text-muted-foreground">Explainable AI with transparent rule application</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="font-semibold">Real-World Application</span>
                        <p className="text-sm text-muted-foreground">Live reputation scoring system with practical use case</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Database className="w-5 h-5" />
                    Hedera Track - Enterprise Blockchain
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="font-semibold">Testnet Smart Contracts</span>
                        <p className="text-sm text-muted-foreground">Live contracts deployed on Hedera testnet</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="font-semibold">HCS Integration</span>
                        <p className="text-sm text-muted-foreground">Audit trail implementation with Consensus Service</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="font-semibold">HTS Compatibility</span>
                        <p className="text-sm text-muted-foreground">NFT system compatible with Token Service</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="font-semibold">3-Second Finality</span>
                        <p className="text-sm text-muted-foreground">Leverages Hedera's fast transaction confirmation</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="font-semibold">Cost Efficiency</span>
                        <p className="text-sm text-muted-foreground">$0.0001 per analysis (500,000x cheaper than Ethereum)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600">
                    <Settings className="w-5 h-5" />
                    Hardhat Track - Advanced Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                      <div>
                        <span className="font-semibold">Hardhat 3.0+ Framework</span>
                        <p className="text-sm text-muted-foreground">Built with latest Hardhat version and best practices</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                      <div>
                        <span className="font-semibold">Advanced Deployment Scripts</span>
                        <p className="text-sm text-muted-foreground">Multi-network deployment with agent registration</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                      <div>
                        <span className="font-semibold">Role-Based Access Control</span>
                        <p className="text-sm text-muted-foreground">OpenZeppelin security patterns for multi-agent permissions</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                      <div>
                        <span className="font-semibold">Comprehensive Testing</span>
                        <p className="text-sm text-muted-foreground">Unit tests, integration tests, and multi-agent scenarios</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                      <div>
                        <span className="font-semibold">HashScan Verification</span>
                        <p className="text-sm text-muted-foreground">Live contract verification on Hedera explorer</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">🎯 Key Differentiators</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Performance Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Analysis Time</span>
                      <span className="font-semibold">10-15 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blockchain Cost</span>
                      <span className="font-semibold">$0.0001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction Finality</span>
                      <span className="font-semibold">3 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent Coordination</span>
                      <span className="font-semibold">Sub-second</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Technical Innovation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AI Explainability</span>
                      <span className="font-semibold">MeTTa Rules</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent Architecture</span>
                      <span className="font-semibold">4 Specialists</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security Model</span>
                      <span className="font-semibold">Multi-Layer</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transparency</span>
                      <span className="font-semibold">HCS Audited</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-xl font-semibold">Synthia Documentation</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-sm min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{sections[activeSection as keyof typeof sections].title}</h1>
              <p className="text-muted-foreground">Comprehensive guide to understanding and evaluating Synthia</p>
            </div>

            {sections[activeSection as keyof typeof sections].content}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
