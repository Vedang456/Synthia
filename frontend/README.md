# 🌟 Synthia Frontend - React Web Application

## Overview

The Synthia frontend is a **modern React TypeScript application** built with **Vite** that provides a beautiful, user-friendly interface for interacting with the decentralized reputation system. It features a cyberpunk-themed design, real-time wallet integration, and seamless communication with the multi-agent backend.

## 🚀 Tech Stack

### **Core Framework**
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and optimized builds
- **React Router** for client-side navigation

### **UI & Styling**
- **Tailwind CSS** with custom cyberpunk theme
- **Radix UI** components for accessibility and customization
- **Framer Motion** for smooth animations
- **Lucide React** for modern icons
- **shadcn/ui** component library

### **Blockchain Integration**
- **Reown AppKit** for multi-chain wallet connections
- **Ethers.js** for blockchain interactions
- **Web3 Context** for global wallet state management

### **State Management**
- **React Query** for server state management
- **Context API** for global application state
- **React Hook Form** with Zod validation

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, icons
│   ├── components/        # Reusable UI components (65+ components)
│   │   ├── ui/           # Base UI components (shadcn/ui)
│   │   ├── Dashboard/    # Dashboard-specific components
│   │   ├── Wallet/       # Wallet connection components
│   │   └── ...
│   ├── contexts/         # React contexts (3 contexts)
│   │   ├── Web3Context.tsx    # Wallet & contract management
│   │   ├── ScoreContext.tsx   # Reputation score state
│   │   └── ThemeContext.tsx   # Theme management
│   ├── hooks/            # Custom React hooks (5 hooks)
│   ├── lib/              # Utility functions
│   ├── pages/            # Route components (6 pages)
│   │   ├── Dashboard.tsx
│   │   ├── ScorePage.tsx
│   │   └── ...
│   ├── services/         # API services
│   │   └── asiaAgentService.ts
│   └── config/           # Configuration files
│       └── contracts.ts  # Contract addresses & ABIs
├── index.html            # Entry point
└── package.json          # Dependencies & scripts
```

## 🎨 UI Components

### **Dashboard Components**
- **Wallet Connection**: Multi-chain wallet integration with Reown
- **Score Display**: Real-time reputation visualization
- **NFT Gallery**: Soulbound reputation badge showcase
- **Transaction History**: On-chain activity timeline

### **Navigation**
- **Responsive Sidebar**: Collapsible navigation menu
- **Breadcrumbs**: Clear page hierarchy
- **Mobile Menu**: Touch-friendly mobile navigation

### **Forms & Inputs**
- **Address Input**: Wallet address validation with format checking
- **Score Request**: Form for requesting reputation analysis
- **Settings Panel**: User preferences and configuration

## 🔗 Blockchain Integration

### **Wallet Connection**
```typescript
// Multi-chain support via Reown AppKit
const appKit = createAppKit({
  adapters: [ethersAdapter],
  networks: [HEDERA_TESTNET],
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  features: {
    analytics: false,
  },
});
```

### **Contract Interactions**
```typescript
// Contract initialization with environment variables
const synthiaContract = new Contract(
  CONTRACTS.SYNTHIA, // From VITE_SYNTHIA_CONTRACT_ADDRESS
  SYNTHIA_ABI,
  signer
);
```

### **Real-time Updates**
- **Event Listeners**: Subscribe to smart contract events
- **State Synchronization**: Automatic UI updates on blockchain changes
- **Transaction Status**: Real-time transaction confirmation

## 🌐 Environment Configuration

### **Required Environment Variables**

```env
# Smart Contract Addresses (from deployment)
VITE_SYNTHIA_CONTRACT_ADDRESS=0x88FF715f1c23C2061133994cFd58c1E35A05beA2
VITE_SYNTHIA_NFT_CONTRACT_ADDRESS=0x1e3D3fAcFaf416f0b0C038CC402eC36f06B064EF

# Wallet Connection (Reown/AppKit)
VITE_REOWN_PROJECT_ID=your_walletconnect_project_id

# API Endpoints (from agent deployment)
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000
VITE_ORCHESTRATOR_URL=http://localhost:8000
VITE_ANALYZER_URL=http://localhost:8001
VITE_BLOCKCHAIN_URL=http://localhost:8002

# Network Configuration
VITE_DEFAULT_NETWORK=testnet
VITE_HEDERA_RPC_URL=https://testnet.hashio.io/api

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_TESTNET_FAUCET=true
```

## 🚀 Development Setup

### **Prerequisites**
- **Node.js 18+** and npm
- **Git** for version control

### **Installation**
```bash
# 1. Install dependencies
npm install

# 2. Copy environment configuration
cp .env.example .env
# Edit .env with your contract addresses and API endpoints

# 3. Start development server
npm run dev

# 4. Open browser
# Frontend: http://localhost:8080
# Agent API: http://localhost:8000 (if running agents)
```

### **Available Scripts**
```json
{
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## 🎯 Key Features

### **1. Multi-Chain Wallet Support**
- **Hedera Testnet**: Primary blockchain for reputation system
- **WalletConnect**: Universal wallet connection protocol
- **Account Management**: Seamless wallet switching and management

### **2. Real-time Reputation Display**
- **Live Score Updates**: Automatic refresh on blockchain changes
- **NFT Visualization**: Dynamic reputation badge rendering
- **Achievement System**: Milestone and badge notifications

### **3. Responsive Design**
- **Mobile-First**: Optimized for all device sizes
- **Dark Theme**: Cyberpunk aesthetic with customizable themes
- **Accessibility**: WCAG compliant with keyboard navigation

### **4. Agent Communication**
- **WebSocket Integration**: Real-time agent status updates
- **Request Management**: Queue and track analysis requests
- **Error Handling**: Graceful failure recovery and user feedback

## 🔧 Configuration Files

### **Vite Configuration**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### **Contract Configuration**
```typescript
// src/config/contracts.ts
export const CONTRACTS = {
  SYNTHIA: import.meta.env.VITE_SYNTHIA_CONTRACT_ADDRESS || "",
  SYNTHIA_NFT: import.meta.env.VITE_SYNTHIA_NFT_CONTRACT_ADDRESS || "",
};
```

## 🧪 Testing & Development

### **Development Workflow**
1. **Deploy Contracts**: Run `npx hardhat run scripts/deploy.ts --network testnet`
2. **Start Agents**: Run agents in separate terminals (orchestrator, analyzer, blockchain)
3. **Configure Frontend**: Copy contract addresses to frontend/.env
4. **Start Frontend**: `npm run dev`
5. **Test Integration**: Verify wallet connections and contract interactions

### **Browser Testing**
- **Chrome/Edge**: Full feature support
- **Firefox**: Compatible with wallet extensions
- **Safari**: iOS wallet compatibility

## 📱 Responsive Breakpoints

```css
/* Mobile First Design */
sm: '640px',   /* Small tablets */
md: '768px',   /* Tablets */
lg: '1024px',  /* Laptops */
xl: '1280px',  /* Desktops */
2xl: '1536px', /* Large screens */
```

## 🔒 Security Features

### **Environment Variables**
- **Vite Prefix**: All env vars use `VITE_` prefix for client-side access
- **Gitignore Protection**: .env files excluded from version control
- **Validation**: Runtime validation of required environment variables

### **Wallet Security**
- **No Private Keys**: Frontend never handles private keys
- **Secure Connections**: HTTPS enforcement in production
- **Transaction Signing**: All transactions signed in user's wallet

## 🚀 Deployment

### **Build Process**
```bash
# Development build
npm run build:dev

# Production build
npm run build

# Preview build
npm run preview
```

### **Environment Setup**
```bash
# Production environment
cp .env.example .env.production
# Configure production values

# Build for production
VITE_ENVIRONMENT=production npm run build
```

## 🤝 Integration with Backend

### **Agent API Communication**
```typescript
// Service integration with environment variables
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const response = await fetch(`${baseUrl}/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(scoreRequest)
});
```

### **Contract Interaction Flow**
1. **User Request** → Frontend validates input
2. **Agent Analysis** → API call to agents for MeTTa reasoning
3. **Wallet Connection** → Reown modal for wallet selection
4. **Contract Call** → Ethers.js executes transaction
5. **Event Listening** → Subscribe to blockchain events
6. **UI Update** → Real-time state synchronization

## 🎨 Theme Customization

### **Cyberpunk Color Palette**
```css
/* Primary Colors */
--primary: #B9F2FF;     /* Cyan (Diamond tier) */
--secondary: #E5E4E2;   /* Silver (Platinum tier) */
--accent: #FFD700;      /* Gold accent */

/* Background Gradients */
--bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
```

### **Component Variants**
- **Glassmorphism**: Translucent components with backdrop blur
- **Neon Borders**: Animated glowing borders for interactive elements
- **Gradient Text**: Dynamic color transitions for headings

## 📊 Performance Optimization

### **Bundle Optimization**
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image compression and lazy loading

### **Runtime Performance**
- **React.memo**: Component memoization for expensive renders
- **useCallback/useMemo**: Hook optimization
- **Virtual Scrolling**: Large list performance

## 🐛 Debugging

### **Development Tools**
```bash
# Enable source maps
npm run dev

# ESLint checking
npm run lint

# TypeScript checking
npx tsc --noEmit
```

### **Common Issues**
- **Wallet Connection**: Check VITE_REOWN_PROJECT_ID
- **Contract Errors**: Verify contract addresses in environment
- **API Failures**: Confirm agent services are running

## 📚 Additional Resources

- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **Radix UI**: https://www.radix-ui.com/
- **Reown AppKit**: https://docs.reown.com/
- **Tailwind CSS**: https://tailwindcss.com/

---

**Built for ETHOnline 2025 - Seamless Web3 User Experience** 🎨✨