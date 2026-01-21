import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import WhatsAppButton from './WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function WhatsAppFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+1234567890';
  const defaultMessage =
    import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE || 'Hello! I need help with my order.';

  const handleSend = () => {
    const message = customMessage.trim() || defaultMessage;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setCustomMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 bg-card border border-border rounded-lg shadow-lg p-4 w-80 animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Need Help?</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Chat with us on WhatsApp for instant support
          </p>
          <div className="space-y-3">
            <Input
              placeholder="Type your message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMessage)}`;
                  window.open(whatsappUrl, '_blank');
                  setIsOpen(false);
                }}
              >
                Use Default
              </Button>
              <Button className="flex-1 bg-[#25D366] hover:bg-[#20BA5A]" onClick={handleSend}>
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
      <Button
        size="lg"
        className="rounded-full w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open WhatsApp chat"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
