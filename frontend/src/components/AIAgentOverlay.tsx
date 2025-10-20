import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, MessageCircle, Send, Minimize2, Maximize2 } from "lucide-react";
import { ASIOneChatInterface } from "@/components/ASIOneChatInterface";
import { useChat } from "@/contexts/ChatContext";

export const AIAgentOverlay = () => {
  const { isChatOpen, setIsChatOpen } = useChat();
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as Element).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Reset minimized state when chat closes
  useEffect(() => {
    if (!isChatOpen) {
      setIsMinimized(false);
    }
  }, [isChatOpen]);

  // Reset position when overlay opens
  useEffect(() => {
    if (isChatOpen) {
      setPosition({ x: window.innerWidth - 460, y: 100 });
      setIsMinimized(false);
    }
  }, [isChatOpen]);

  if (!isChatOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-[440px] h-[600px]'
      }`}
      style={{
        left: position.x,
        top: position.y,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        handleMouseDown(e);
      }}
    >
      <Card className="h-full bg-card/95 backdrop-blur-md border-primary/30 shadow-2xl">
        {/* Header */}
        <div
          className="drag-handle flex items-center justify-between p-3 border-b border-primary/20 cursor-move bg-gradient-to-r from-primary/10 to-secondary/10"
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e);
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-primary">ASI-One Agent</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="h-6 w-6 p-0 hover:bg-primary/20"
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsChatOpen(false);
              }}
              className="h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
              <ASIOneChatInterface />
            </ScrollArea>
          </div>
        )}

        {/* Minimized state */}
        {isMinimized && (
          <div className="flex items-center justify-center h-full">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Open Chat
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
