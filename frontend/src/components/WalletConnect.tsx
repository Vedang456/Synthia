import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2, ChevronDown, Copy, ExternalLink, AlertCircle, Check } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export const WalletConnect = () => {
  const { address, isConnected, connect, disconnect, provider } = useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      });
    } catch (error) {
      setConnectionError("Failed to connect wallet. Please try again.");
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    setConnectionError(null);
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from your wallet",
      });
    } catch (error) {
      setConnectionError("Failed to disconnect wallet. Please try again.");
      console.error("Disconnection error:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address has been copied to clipboard",
      });
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://hashscan.io/testnet/account/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <div className="space-y-2">
        <Button
          variant="hero"
          size="lg"
          onClick={handleConnect}
          disabled={isConnecting}
          className="min-w-[160px]"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </>
          )}
        </Button>
        {connectionError && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{connectionError}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className="min-w-[160px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <div className="text-sm font-medium">Connected Wallet</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              Hedera Testnet
              <Badge variant="secondary" className="text-xs">HBAR</Badge>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openExplorer}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="text-red-600 focus:text-red-600"
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Disconnect
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {connectionError && (
        <Alert variant="destructive" className="text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{connectionError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
