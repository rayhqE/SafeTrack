'use client';

import { useAppContext } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MapPin, Siren, ArrowRightCircle, ArrowLeftCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AdminDashboard() {
  const { logs, currentLocation } = useAppContext();

  const getIconForType = (type: 'panic' | 'geofence_entry' | 'geofence_exit') => {
    switch(type) {
      case 'panic':
        return <Siren className="h-5 w-5 text-destructive" />;
      case 'geofence_entry':
        return <ArrowRightCircle className="h-5 w-5 text-green-500" />;
      case 'geofence_exit':
        return <ArrowLeftCircle className="h-5 w-5 text-yellow-500" />;
    }
  }

  const getBadgeVariant = (type: 'panic' | 'geofence_entry' | 'geofence_exit') => {
    switch(type) {
        case 'panic': return 'destructive';
        case 'geofence_entry': return 'default';
        case 'geofence_exit': return 'secondary';
        default: return 'outline';
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">Live Status</CardTitle>
          <CardDescription>The user's most recent data.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-start gap-4 p-4 border rounded-lg">
                <MapPin className="h-8 w-8 text-primary mt-1"/>
                <div>
                    <h3 className="font-semibold">Last Known Location</h3>
                    {currentLocation ? (
                        <>
                        <p className="font-mono text-sm">Lat: {currentLocation.latitude.toFixed(6)}</p>
                        <p className="font-mono text-sm">Lon: {currentLocation.longitude.toFixed(6)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Updated: {new Date(currentLocation.timestamp).toLocaleString()}
                        </p>
                        </>
                    ) : (
                        <p className="text-muted-foreground">No location data available.</p>
                    )}
                </div>
            </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Notification Logs</CardTitle>
          <CardDescription>A log of all automated alerts and panic signals.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                          <Badge variant={getBadgeVariant(log.type)} className="flex gap-1 items-center w-fit">
                            {getIconForType(log.type)}
                            <span>{log.type.split('_')[1] || log.type}</span>
                          </Badge>
                      </TableCell>
                      <TableCell>{log.message}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No logs yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
