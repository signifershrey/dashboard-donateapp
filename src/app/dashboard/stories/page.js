'use client'; // This is a client component

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect non-admin users to the login page
    if (status === 'loading') return; // Wait for session loading
    if (!session || session.user.role !== 'admin') {
      router.push('/login'); // Redirect to login if not admin
    }
  }, [session, status, router]);

  // Optionally, show a loading state or nothing until redirection is determined
  if (status === 'loading') {
    return <p>Loading...</p>; // or any loading spinner
  }

  return (
    <div>
      <h1>Stories</h1>
      <p>This is the stories page, accessible only to admins.</p>
      {/* Add your stories content here */}
    </div>
  );
}
