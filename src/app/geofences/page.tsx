import { GeofenceManager } from '@/components/geofence-manager';

export default function GeofencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Manage Geofences</h1>
        <p className="text-muted-foreground">Define your safe zones to receive automatic alerts.</p>
      </div>
      <GeofenceManager />
    </div>
  );
}
