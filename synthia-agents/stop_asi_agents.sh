#!/bin/bash

echo "🛑 Stopping ASI Agents..."

# Kill all agent processes
if [ -f "orchestrator.pid" ]; then
    kill $(cat orchestrator.pid) 2>/dev/null
    rm orchestrator.pid
    echo "✅ ASI Orchestrator stopped"
fi

if [ -f "wallet-analyzer.pid" ]; then
    kill $(cat wallet-analyzer.pid) 2>/dev/null
    rm wallet-analyzer.pid
    echo "✅ ASI Wallet Analyzer stopped"
fi

if [ -f "blockchain-agent.pid" ]; then
    kill $(cat blockchain-agent.pid) 2>/dev/null
    rm blockchain-agent.pid
    echo "✅ ASI Blockchain Agent stopped"
fi

echo "🧹 Cleaning up..."
rm -f *.pid

echo "✨ All ASI agents stopped and cleaned up"
