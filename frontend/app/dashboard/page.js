'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage - dashboard is removed
    router.push('/');
  }, [router]);

  return null;
}