export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface UserProfile {
  name: string;
  contacts: EmergencyContact[];
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  isInside: boolean;
}

export type NotificationType = 'panic' | 'geofence_entry' | 'geofence_exit';

export interface NotificationLog {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
}
