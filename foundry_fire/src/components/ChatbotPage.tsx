import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send, MessageCircle } from 'lucide-react';

interface ChatbotPageProps {
  onBackToHome: () => void;
}

export function ChatbotPage({ onBackToHome }: ChatbotPageProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Clear the message input
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Empty message area */}
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">AWS Education Assistant</h3>
            <p className="text-sm text-muted-foreground/70">
              Ask me anything about AWS services and best practices
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            <button 
              onClick={() => setMessage("What is AWS EC2?")}
              className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
            >
              What is AWS EC2?
            </button>
            <button 
              onClick={() => setMessage("How do I set up S3?")}
              className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
            >
              How do I set up S3?
            </button>
            <button 
              onClick={() => setMessage("Best RDS practices")}
              className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
            >
              Best RDS practices
            </button>
          </div>
        </div>
      </div>

      {/* Message input area */}
      <div className="border-t border-border bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="py-3 px-4 text-base resize-none focus:border-orange-300 focus:ring-orange-500"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="flex items-center gap-2 px-4 py-3 h-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Send size={16} />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
              Press Enter to send • Shift + Enter for new line
            </p>
            <p className="text-xs text-muted-foreground">
              {message.length}/1000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}