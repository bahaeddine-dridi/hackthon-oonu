import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBack: () => void;
  language: 'ar' | 'fr';
}

export function Header({ title, onBack, language }: HeaderProps) {
  const isRTL = language === 'ar';
  
  return (
    <div className="bg-blue-900 text-white px-4 py-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-blue-800 p-2"
        >
          {isRTL ? (
            <ArrowRight className="w-5 h-5" />
          ) : (
            <ArrowLeft className="w-5 h-5" />
          )}
        </Button>
        <h1 className="text-white">{title}</h1>
      </div>
    </div>
  );
}
