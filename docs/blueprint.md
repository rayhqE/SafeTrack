# **App Name**: SafeTrack

## Core Features:

- Background Location Tracking: Periodically fetch location data in the background using the Geolocation API (https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).
- Offline Data Storage: Monitor network connectivity using the Network Information API (https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API). Save location data locally when offline, and attempt to upload to the server once online.
- User Profile Setup: Allow users to set up a profile including name and emergency contact details.
- Panic Button: Provide a prominent panic button that immediately shares the user’s location with their emergency contacts. Contacts should be notified with an SMS, so that a next app can forward them.
- Geofencing: Create virtual safe zones, or geofences; send alert to emergency contacts if the user exits the safe zone.
- Custom Arrival/Departure Alerts: Use generative AI to tool that composes and sends custom SMS messages when user arrives or exits the geofence locations, for providing check-in alerts. Reasoning determines which custom message best reflects if the user is arriving at the cinema, arriving back home, leaving work, and so on.
- Admin location UI: Show user's location to admins when location is shared, show notification logs

## Style Guidelines:

- Primary color: Deep Purple (#673AB7) for safety and reliability.
- Background color: Light Gray (#F5F5F5), a muted shade of the primary hue, for a clean interface.
- Accent color: Teal (#009688), analogous to purple in the color wheel, to highlight interactive elements.
- Font pairing: 'Poppins' (sans-serif) for headlines and short text, and 'PT Sans' (sans-serif) for body text. 'Poppins' has a geometric, precise look that conveys modern safety and competence, while 'PT Sans' retains readability for longer passages.
- Use outlined icons from a consistent set (e.g., Material Icons) to clearly indicate safety features like location sharing, panic button, and geofence settings.
- Emphasize clarity and ease of use. Important functions like the Panic Button and location-sharing toggles are prominently placed. Minimize clutter to reduce user anxiety.
- Use subtle, reassuring animations to confirm actions, such as a gentle pulse effect when the Panic Button is pressed, to ensure the user feels confident their action has registered.