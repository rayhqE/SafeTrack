import { ProfileForm } from '@/components/profile-form';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Manage Your Profile</h1>
        <p className="text-muted-foreground">Keep your information up to date for your safety.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
