import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export default function WhatsAppButton({
  phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+1234567890',
  message = import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE || 'Hello! I need help with my order.',
  className = '',
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      asChild
      className={`bg-[#25D366] hover:bg-[#20BA5A] text-white ${className}`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Chat on WhatsApp</span>
      </a>
    </Button>
  );
}
