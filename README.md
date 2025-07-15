# SafeTrack 🚨 - Personal Safety Companion

SafeTrack is a modern personal safety web app built with **Next.js 14**, **Firebase**, and **Generative AI**, designed to provide real-time location tracking, geofencing alerts, and emergency notifications.

## 🚀 Features
- **Live Location Tracking** with the **Geolocation API**
- **Offline Support** using **Network Information API** and **localStorage**
- **Geofencing (Safe Zones)** with real-time entry/exit detection
- **AI-Powered Alerts** with personalized SMS messages using **Genkit + Gemini AI**
- **Emergency Panic Button** to send instant alerts
- **Admin Dashboard** for real-time monitoring

## 🛠️ Tech Stack
- **Next.js 14**, **React 18**, **TypeScript**
- **Firebase** (Authentication + Firestore)
- **Tailwind CSS** + **ShadCN UI**
- **React Context API** for state management
- **React Hook Form** + **Zod** for forms
- **Genkit + Gemini AI** for generating smart alerts

## 📂 Folder Structure Highlights
- `src/context/` → App-wide state (location, status)
- `src/ai/` → Genkit AI flows
- `src/components/` → Reusable UI components (Panic Button, Dashboard)
- `src/lib/utils.ts` → Utility functions (distance calculation)

## 📌 Setup Instructions
```bash
git clone https://github.com/your-username/safetrack.git
cd safetrack
npm install
npm run dev
