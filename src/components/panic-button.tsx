'use client';

import { Siren } from 'lucide-react';
import { Button } from './ui/button';
import { useAppContext } from '@/context/app-context';

export function PanicButton() {
  const { addLog, currentLocation, profile } = useAppContext();

  const handlePanic = () => {
    let message = 'Panic button pressed!';
    if (currentLocation) {
      message += ` Last known location: ${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`;
    }
    if (profile.contacts.length > 0) {
      message += ` Alerting ${profile.contacts.map(c => c.name).join(', ')}.`;
    }
    
    addLog({
      type: 'panic',
      message: message,
    });
  };

  return (
    <Button
      onClick={handlePanic}
      variant="destructive"
      className="w-48 h-48 rounded-full flex-col gap-2 text-2xl font-headline animate-pulse-strong"
      aria-label="Panic Button"
    >
      <Siren className="w-16 h-16" />
      <span>PANIC</span>
    </Button>
  );
}
