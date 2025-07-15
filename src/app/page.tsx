'use client';

import { PanicButton } from '@/components/panic-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/context/app-context';
import { MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Home() {
  const { isTracking, setIsTracking, currentLocation, geofences } = useAppContext();
  
  const currentStatus = () => {
    const insideFence = geofences.find(f => f.isInside);
    if (insideFence) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span>Inside "{insideFence.name}" safe zone.</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-yellow-600">
        <AlertTriangle className="w-5 h-5" />
        <span>Outside of any defined safe zone.</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full">
      <h1 className="text-4xl font-headline font-bold text-center">SafeTrack Dashboard</h1>
      <p className="text-muted-foreground text-center">Your safety is our priority. Press the button in an emergency.</p>
      
      <div className="flex items-center space-x-2 my-4">
        <Switch id="tracking-toggle" checked={isTracking} onCheckedChange={setIsTracking} />
        <Label htmlFor="tracking-toggle" className="text-lg">Location Tracking</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="flex justify-center items-center">
          <PanicButton />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><MapPin /> Current Status</CardTitle>
            <CardDescription>Your last known location and status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Coordinates</h3>
              {currentLocation ? (
                <p className="font-mono text-sm">{`Lat: ${currentLocation.latitude.toFixed(6)}, Lon: ${currentLocation.longitude.toFixed(6)}`}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Searching for location...</p>
              )}
            </div>
             <div className="space-y-2">
              <h3 className="font-semibold">Geofence Status</h3>
              {isTracking ? currentStatus() : <p className="text-sm text-muted-foreground">Tracking is paused.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
