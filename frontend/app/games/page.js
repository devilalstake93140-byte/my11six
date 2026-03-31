'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GamesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage
    router.push('/');
  }, [router]);

  return null;
}