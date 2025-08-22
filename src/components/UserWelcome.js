'use client';

import { useSession } from 'next-auth/react';

export default function UserWelcome() {
  const { data: session } = useSession();
  const display = session?.user?.email || session?.user?.name || 'User';
  return (
    <span className="text-gray-700">Welcome, {display}</span>
  );
}
