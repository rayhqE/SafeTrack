'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, PlusCircle, Trash2 } from 'lucide-react';

const geofenceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  radius: z.coerce.number().min(50, 'Radius must be at least 50 meters').max(10000, 'Radius cannot exceed 10,000 meters'),
});

export function GeofenceManager() {
  const { geofences, addGeofence, removeGeofence, currentLocation } = useAppContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof geofenceSchema>>({
    resolver: zodResolver(geofenceSchema),
    defaultValues: {
      name: '',
      radius: 200,
    },
  });

  function onSubmit(data: z.infer<typeof geofenceSchema>) {
    if (!currentLocation) {
        toast({ title: 'Could not add geofence', description: 'Your location is not available yet.', variant: "destructive" });
        return;
    }
    addGeofence(data);
    toast({ title: 'Geofence Added', description: `"${data.name}" has been created around your current location.` });
    form.reset();
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Add New Geofence</CardTitle>
          <CardDescription>Create a safe zone around your current location. You'll be notified when you enter or leave.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Home, Work" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="radius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Radius (in meters)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!currentLocation}>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Add Geofence
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Existing Geofences</CardTitle>
          <CardDescription>Your currently monitored safe zones.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Radius</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {geofences.length > 0 ? (
                geofences.map((fence) => (
                  <TableRow key={fence.id}>
                    <TableCell className="font-medium">{fence.name}</TableCell>
                    <TableCell>{fence.radius}m</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${fence.isInside ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {fence.isInside ? 'Inside' : 'Outside'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeGeofence(fence.id)}>
                        <Trash2 className="h-4 w-4 text-destructive"/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No geofences created yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
