'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { movementApi, bankAccountApi, Movement, BankAccount } from '@/lib/api/bank-api';
import { LoadingPage } from '@/components/mobile/loading/loading-page';
import { useAuth } from '@/contexts/auth-context';
import { Analytics as AnalyticsMobile } from '@/components/mobile/analytics/analytics';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [movements, setMovements] = useState<Movement[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [movementsResult, accountsResult] = await Promise.all([
      movementApi.getAll(),
      bankAccountApi.getAll()
    ]);
    
    if (movementsResult.data) {
      setMovements(movementsResult.data);
      setError('');
    } else {
      setError(movementsResult.error || 'Failed to fetch movements');
    }

    if (accountsResult.data && user) {
      const userAccounts = accountsResult.data.filter(acc => acc.userId === user.id);
      setAccounts(userAccounts);
    }
    
    setLoading(false);
  };

  if (loading) {
    return <LoadingPage title="Loading Analytics..." loadingText="Processing • Please wait • Processing • " />;
  }

  return (
    <AnalyticsMobile
      movements={movements}
      accounts={accounts}
      onBack={() => router.push('/')}
    />
  );
}