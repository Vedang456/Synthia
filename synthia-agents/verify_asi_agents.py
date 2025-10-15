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

