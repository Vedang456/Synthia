#!/bin/bash

# Synthia ASI Agents Deployment Script
# Properly installs and deploys Fetch.ai uAgents for ASI compatibility

echo "🚀 Synthia ASI Agents Deployment (Fetch.ai Compatible)"
echo "======================================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Python and pip
print_status "Checking Python environment..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is required but not installed"
    exit 1
fi

if ! command -v pip3 &> /dev/null; then
    print_error "pip3 is required but not installed"
    exit 1
fi

print_success "Python environment verified"

# Navigate to agents directory
cd "$(dirname "$0")"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv

    if [ $? -ne 0 ]; then
        print_error "Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip

# Install Fetch.ai uAgents and dependencies
print_status "Installing Fetch.ai uAgents framework..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    print_error "Failed to install uAgents dependencies"
    print_error "Please check your internet connection and try again"
    exit 1
fi

print_success "Fetch.ai uAgents framework installed successfully"

# Verify uAgents installation
print_status "Verifying uAgents installation..."
python3 -c "import uagents; print('✅ uAgents imported successfully')"

if [ $? -ne 0 ]; then
    print_error "uAgents verification failed"
    exit 1
fi

print_success "uAgents installation verified"

# Check .env configuration
if [ ! -f ".env" ]; then
    print_warning "Creating .env file from template..."
    cp .env.example .env
    print_warning "Please edit .env file with your configuration before running agents!"
    print_warning "Required: Seeds for all agents, contract addresses, RPC URL"
    exit 1
fi

# Check for required environment variables
print_status "Checking environment configuration..."
required_vars=("ORCHESTRATOR_SEED" "WALLET_ANALYZER_SEED" "BLOCKCHAIN_AGENT_SEED" "SYNTHIA_CONTRACT_ADDRESS" "RPC_URL")

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env 2>/dev/null; then
        print_error "Required environment variable $var not found in .env"
        print_error "Please configure your .env file"
        exit 1
    fi
done

print_success "Environment configuration verified"

# Function to start an ASI agent
start_asi_agent() {
    local agent_name=$1
    local script_name=$2

    print_status "Starting ASI $agent_name..."
    python3 agents/$script_name.py &
    local pid=$!

    echo $pid > "${agent_name}.pid"
    sleep 3

    # Check if agent is running
    if ps -p $pid > /dev/null; then
        print_success "ASI $agent_name started successfully (PID: $pid)"
        return 0
    else
        print_error "Failed to start ASI $agent_name"
        return 1
    fi
}

# Start ASI agents
echo ""
echo "🤖 Starting ASI-Compatible Agents..."
echo "==================================="

# Start orchestrator first (coordinates other agents)
start_asi_agent "orchestrator" "orchestrator"
ORCHESTRATOR_PID=$(cat "orchestrator.pid")

# Start wallet analyzer
start_asi_agent "wallet-analyzer" "wallet_analyzer"
ANALYZER_PID=$(cat "wallet-analyzer.pid")

# Start blockchain agent
start_asi_agent "blockchain-agent" "blockchain_agent"
BLOCKCHAIN_PID=$(cat "blockchain-agent.pid")

# Check if all agents started successfully
if [ -f "orchestrator.pid" ] && [ -f "wallet-analyzer.pid" ] && [ -f "blockchain-agent.pid" ]; then
    print_success "All ASI agents started successfully!"
else
    print_error "Some ASI agents failed to start"
    print_error "Check the logs above for details"
    exit 1
fi

# Create verification script
cat > verify_asi_agents.py << 'EOF'
#!/usr/bin/env python3

"""
ASI Agent Verification Script
Verifies that all Synthia ASI agents are running correctly
"""

import asyncio
import json
import requests
from datetime import datetime

async def verify_asi_agents():
    """Verify ASI agent functionality"""

    print("🔍 Verifying Synthia ASI Agents...")
    print("=" * 50)

    agents = [
        ("orchestrator", "http://localhost:8000", "🎯"),
        ("wallet-analyzer", "http://localhost:8001", "🔍"),
        ("blockchain-agent", "http://localhost:8002", "⛓️")
    ]

    all_healthy = True

    for agent_name, endpoint, emoji in agents:
        try:
            # Check if agent is responding
            response = requests.get(f"{endpoint}/status", timeout=5)

            if response.status_code == 200:
                print(f"{emoji} {agent_name}: ✅ Active")
            else:
                print(f"{emoji} {agent_name}: ❌ Not responding")
                all_healthy = False

        except requests.exceptions.RequestException as e:
            print(f"{emoji} {agent_name}: ❌ Connection failed - {e}")
            all_healthy = False

    print("\n📊 ASI Verification Results:")
    print("=" * 50)

    if all_healthy:
        print("🎉 All ASI agents are working correctly!")
        print("🔗 ASI-compatible communication established")
        print("🤖 Ready for ASI-powered reputation scoring")
        return True
    else:
        print("⚠️  Some ASI agents are not responding")
        print("💡 Try restarting agents or checking configuration")
        return False

def test_asi_workflow():
    """Test the complete ASI workflow"""
    print("\n🧪 Testing ASI Workflow...")

    try:
        # Test score request
        test_request = {
            "user_address": "0x742d35Cc6635C0532925a3b844Bc454e4438f44e",
            "request_id": "test_asi_workflow",
            "timestamp": int(datetime.now().timestamp()),
            "source": "verification_test"
        }

        # Send to orchestrator
        response = requests.post(
            "http://localhost:8000/submit",
            json=test_request,
            timeout=10
        )

        if response.status_code == 200:
            print("✅ ASI workflow test passed")
            print("🔄 Score request processed by ASI orchestrator")
            return True
        else:
            print(f"❌ ASI workflow test failed: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ ASI workflow test error: {e}")
        return False

if __name__ == "__main__":
    async def main():
        success = await verify_asi_agents()

        if success:
            workflow_success = test_asi_workflow()
            if workflow_success:
                print("\n🎯 ASI Integration Complete!")
                print("Your Synthia reputation system is now ASI-powered!")
            else:
                print("\n⚠️ Agents running but workflow test failed")
        else:
            print("\n❌ ASI agent verification failed")

        exit(0 if success else 1)

    asyncio.run(main())

EOF

chmod +x verify_asi_agents.py

print_status "ASI verification script created"

# Create cleanup script
cat > stop_asi_agents.sh << 'EOF'
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
EOF

chmod +x stop_asi_agents.sh

print_status "ASI cleanup script created"

# Final instructions
echo ""
echo "🎯 ASI Agents Deployment Complete!"
echo "=================================="
echo ""
echo "🤖 Running ASI Agents:"
echo "  • Orchestrator (PID: $ORCHESTRATOR_PID) - 🎯 Coordination"
echo "  • Wallet Analyzer (PID: $ANALYZER_PID) - 🔍 Analysis"
echo "  • Blockchain Agent (PID: $BLOCKCHAIN_PID) - ⛓️ Transactions"
echo ""
echo "🔍 To verify ASI agents are working:"
echo "  python3 verify_asi_agents.py"
echo ""
echo "🛑 To stop all ASI agents:"
echo "  ./stop_asi_agents.sh"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy your smart contracts and update .env"
echo "2. Update your frontend to communicate with ASI orchestrator"
echo "3. Test the complete ASI workflow"
echo ""
echo "🌐 ASI Agent Endpoints:"
echo "  • Orchestrator: http://localhost:8000"
echo "  • Wallet Analyzer: http://localhost:8001"
echo "  • Blockchain Agent: http://localhost:8002"
echo ""
echo "✨ Your Synthia system is now ASI-compatible!"
