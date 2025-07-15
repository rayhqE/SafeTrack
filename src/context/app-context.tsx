"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Geofence, LocationPoint, NotificationLog, UserProfile } from '@/lib/types';
import { haversineDistance } from '@/lib/utils';
import { customAlertSMS } from '@/ai/flows/custom-alert-sms';
import { useToast } from "@/hooks/use-toast";

const defaultProfile: UserProfile = { name: "User", contacts: [] };

interface AppContextType {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  geofences: Geofence[];
  addGeofence: (geofence: Omit<Geofence, 'id' | 'isInside'>) => void;
  removeGeofence: (id: string) => void;
  logs: NotificationLog[];
  currentLocation: LocationPoint | null;
  isTracking: boolean;
  setIsTracking: (isTracking: boolean) => void;
  onlineStatus: boolean;
  addLog: (log: Omit<NotificationLog, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(true);
  const [onlineStatus, setOnlineStatus] = useState<boolean>(true);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedProfile = localStorage.getItem('safeTrackProfile');
      if (storedProfile) setProfile(JSON.parse(storedProfile));

      const storedGeofences = localStorage.getItem('safeTrackGeofences');
      if (storedGeofences) setGeofences(JSON.parse(storedGeofences));

      const storedLogs = localStorage.getItem('safeTrackLogs');
      if (storedLogs) setLogs(JSON.parse(storedLogs));

      const storedTracking = localStorage.getItem('safeTrackTracking');
      if(storedTracking) setIsTracking(JSON.parse(storedTracking));
      
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('safeTrackProfile', JSON.stringify(profile));
    }
  }, [profile, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('safeTrackGeofences', JSON.stringify(geofences));
    }
  }, [geofences, isMounted]);
  
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('safeTrackLogs', JSON.stringify(logs));
    }
  }, [logs, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('safeTrackTracking', JSON.stringify(isTracking));
    }
  }, [isTracking, isMounted]);

  const addLog = useCallback((log: Omit<NotificationLog, 'id' | 'timestamp'>) => {
    const newLog: NotificationLog = {
      ...log,
      id: new Date().toISOString(),
      timestamp: Date.now(),
    };
    setLogs(prev => [newLog, ...prev]);
    toast({
      title: log.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: log.message,
    });
  }, [toast]);
  
  const handleGeofenceEvent = useCallback(async (geofence: Geofence, eventType: 'arrival' | 'departure') => {
    if (profile.contacts.length === 0) return;
    
    for (const contact of profile.contacts) {
      try {
        const result = await customAlertSMS({
          locationName: geofence.name,
          eventType: eventType,
          time: new Date().toLocaleTimeString(),
          userName: profile.name,
          relationship: contact.relationship,
        });
        addLog({ type: eventType === 'arrival' ? 'geofence_entry' : 'geofence_exit', message: result.message });
      } catch (error) {
        console.error('Failed to generate SMS:', error);
        addLog({ type: eventType === 'arrival' ? 'geofence_entry' : 'geofence_exit', message: `Error generating alert for ${contact.name}` });
      }
    }
  }, [profile, addLog]);

  useEffect(() => {
    const checkGeofences = (location: LocationPoint) => {
      setGeofences(prevGeofences => {
        const newGeofences = [...prevGeofences];
        let stateChanged = false;
        
        newGeofences.forEach((fence, index) => {
          const distance = haversineDistance(location.latitude, location.longitude, fence.latitude, fence.longitude);
          const isCurrentlyInside = distance < fence.radius;
          
          if (isCurrentlyInside && !fence.isInside) {
            // Entered
            handleGeofenceEvent(fence, 'arrival');
            newGeofences[index] = { ...fence, isInside: true };
            stateChanged = true;
          } else if (!isCurrentlyInside && fence.isInside) {
            // Exited
            handleGeofenceEvent(fence, 'departure');
            newGeofences[index] = { ...fence, isInside: false };
            stateChanged = true;
          }
        });

        return stateChanged ? newGeofences : prevGeofences;
      });
    };

    if (isTracking && navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: LocationPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          };
          setCurrentLocation(newLocation);
          if (onlineStatus) {
            checkGeofences(newLocation);
          } else {
             // Basic offline handling: just update location, geofence checks pause
            console.log("Offline: location saved, will process geofences when online.");
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setIsTracking(false);
            toast({
              title: "Location permission denied",
              description: "Please enable location services to use SafeTrack.",
              variant: "destructive"
            });
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      setWatchId(id);
    } else {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, onlineStatus, handleGeofenceEvent, toast]);

  useEffect(() => {
    const updateOnlineStatus = () => setOnlineStatus(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const addGeofence = (geofence: Omit<Geofence, 'id' | 'isInside'>) => {
    if (!currentLocation) {
        toast({ title: "Cannot add geofence", description: "Current location not available.", variant: "destructive"});
        return;
    }
    const newGeofence: Geofence = {
      ...geofence,
      id: new Date().toISOString(),
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      isInside: true // Assume user is inside when creating
    };
    setGeofences(prev => [...prev, newGeofence]);
  };

  const removeGeofence = (id: string) => {
    setGeofences(prev => prev.filter(fence => fence.id !== id));
  };

  const value = {
    profile,
    updateProfile,
    geofences,
    addGeofence,
    removeGeofence,
    logs,
    addLog,
    currentLocation,
    isTracking,
    setIsTracking,
    onlineStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
