'use client'

import { useMemo, useState } from 'react';
import { CornerUpLeft, HelpCircle, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movement, BankAccount } from '@/lib/api/bank-api';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsProps {
  movements: Movement[];
  accounts: BankAccount[];
  onBack?: () => void;
}

interface CategoryData {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export function Analytics({ movements, accounts, onBack }: AnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const filteredMovements = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return movements.filter(m => {
      const movementDate = new Date(m.date);
      return movementDate >= startDate && movementDate <= now && m.status === 'CONFIRMED';
    });
  }, [movements, selectedPeriod]);

  const analytics = useMemo(() => {
    const totalIncome = filteredMovements
      .filter(m => m.type === 'INCOME').reduce((sum, m) => sum + m.amount, 0);

    const totalExpenses = filteredMovements
      .filter(m => m.type === 'EXPENSE').reduce((sum, m) => sum + m.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    const categoryExpenses: Record<string, CategoryData> = {};
    filteredMovements
      .filter(m => m.type === 'EXPENSE')
      .forEach(m => {
        if (!categoryExpenses[m.category]) {
          categoryExpenses[m.category] = {
            category: m.category,
            amount: 0,
            count: 0,
            percentage: 0
          };
        }
        categoryExpenses[m.category].amount += m.amount;
        categoryExpenses[m.category].count += 1;
      });

    Object.values(categoryExpenses).forEach(cat => {
      cat.percentage = totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;
    });

    const topCategories = Object.values(categoryExpenses).sort((a, b) => b.amount - a.amount).slice(0, 5);

    const dailyData: Record<string, { income: number; expenses: number }> = {};
    filteredMovements.forEach(m => {
      const date = new Date(m.date).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { income: 0, expenses: 0 };
      }
      if (m.type === 'INCOME') {
        dailyData[date].income += m.amount;
      } else {
        dailyData[date].expenses += m.amount;
      }
    });

    const totalAccountBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      topCategories,
      dailyData,
      totalAccountBalance,
      transactionCount: filteredMovements.length
    };
  }, [filteredMovements, accounts]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      SHOPPING: '#3F72AF',
      NET: '#112D4E',
      TECH: '#DBE2EF',
      FOOD_DRINKS: '#F9AA33',
      TRANSPORT: '#9C27B0',
      ENTERTAINMENT: '#E91E63',
      HEALTH: '#4CAF50',
      UTILITIES: '#FF9800',
      EDUCATION: '#2196F3',
      STREAMING_SERVICES: '#673AB7',
      OTHER: '#9E9E9E'
    };
    return colors[category] || '#9E9E9E';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <header className="flex items-center justify-between px-4 pt-4 pb-3 mb-6">
            <Button variant="outline" onClick={onBack} className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                <CornerUpLeft className="!h-5 !w-5 text-color" />
            </Button>

            <h1 className="text-lg font-semibold text-color">Analytics</h1>
                <Button variant="default" onClick={onBack} className="w-12 h-12 rounded-2xl bg-background-darker-blue shadow-sm flex items-center justify-center">
                    <HelpCircle className="!h-6 !w-6 card-text-color" />
                </Button>
        </header>

        <div className="px-4 space-y-4 pb-10">
            <div className="flex gap-2 justify-center">
                {(['week', 'month', 'year'] as const).map(period => (
                    <Button key={period} onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                        selectedPeriod === period ? 'bg-background-darker-blue text-white' : 'bg-card text-color'}`}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <LiquidGlassCard className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-color">Income</span>
                    </div>
                    <p className="text-xl font-bold income-text">
                        {formatCurrency(analytics.totalIncome)}
                    </p>
                </LiquidGlassCard>

                <LiquidGlassCard className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-color">Expenses</span>
                    </div>
                        <p className="text-xl font-bold expense-text">
                        {formatCurrency(analytics.totalExpenses)}
                    </p>
                </LiquidGlassCard>
            </div>

            <LiquidGlassCard className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-xs text-color">Net Balance</span>
                        <p className={`text-2xl font-bold ${analytics.netBalance >= 0 ? 'income-text' : 'expense-text'}`}>
                            {analytics.netBalance >= 0 ? '+' : ''}
                            {formatCurrency(analytics.netBalance)}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-color">Transactions</span>
                        <p className="text-xl font-bold text-color">{analytics.transactionCount}</p>
                    </div>
                </div>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Wallet className="h-4 w-4 text-color" />
                    <span className="text-sm font-semibold text-color">Total Balance</span>
                </div>
                <p className="text-3xl font-bold text-color mb-3">
                    {formatCurrency(analytics.totalAccountBalance)}
                </p>
                <div className="space-y-2">
                    {accounts.map(account => (
                    <div key={account.id} className="flex items-center justify-between text-xs">
                        <span className="text-color">{account.accountName}</span>
                        <span className="font-semibold text-color">{formatCurrency(account.balance)}</span>
                    </div>
                    ))}
                </div>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-4">
                <h3 className="text-sm font-semibold text-color mb-3">Top Expense Categories</h3>
                    {analytics.topCategories.length > 0 ? (
                        <div className="space-y-3">
                            {analytics.topCategories.map(cat => (
                                <div key={cat.category}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-color font-medium">{cat.category}</span>
                                        <span className="text-color">
                                            {formatCurrency(cat.amount)} ({cat.percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all" style={{width: `${cat.percentage}%`,
                                        backgroundColor: getCategoryColor(cat.category)}}/>
                                </div>
                                <div className="flex items-center justify-between text-[10px] mt-1">
                                    <span className="text-normal-blue">{cat.count} transactions</span>
                                    <span className="text-normal-blue">
                                        Avg: {formatCurrency(cat.amount / cat.count)}
                                    </span>
                                </div>
                                </div>
                        ))}
                        </div>
                    ) : (
                    <p className="text-xs text-normal-blue text-center py-4">
                        No expense data for this period
                    </p>
                )}
            </LiquidGlassCard>

            {analytics.topCategories.length > 0 && (
                <LiquidGlassCard className="p-4">
                    <h3 className="text-sm font-semibold text-color mb-3">Expense Distribution</h3>
                    <div className="flex flex-wrap gap-2">
                        {analytics.topCategories.map(cat => (
                            <div key={cat.category} className="flex items-center gap-2 px-3 py-2 rounded-full"
                            style={{ backgroundColor: getCategoryColor(cat.category) + '20' }}>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(cat.category) }}/>
                                <span className="text-xs font-medium text-color">
                                    {cat.category}: {cat.percentage.toFixed(0)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </LiquidGlassCard>
            )}

            <LiquidGlassCard className="p-4">
                <h3 className="text-sm font-semibold text-color mb-3">Insights</h3>
                <div className="space-y-2 text-xs">
                    {analytics.totalExpenses > 0 && (
                        <div className="p-2 bg-background rounded-lg">
                            <p className="text-color">
                            💡 Your average daily spending is{' '}
                            <span className="font-bold text-color">
                                {formatCurrency(analytics.totalExpenses / (selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365))}
                            </span>
                            </p>
                        </div>
                        )}
                        {analytics.netBalance > 0 && (
                        <div className="p-2 bg-background rounded-lg">
                            <p className="text-color">
                            🎉 You saved{' '}
                            <span className="font-bold income-text">
                                {formatCurrency(analytics.netBalance)}
                            </span>
                            {' '}this {selectedPeriod}!
                            </p>
                        </div>
                        )}
                        {analytics.topCategories[0] && (
                        <div className="p-2 bg-background rounded-lg">
                            <p className="text-color">
                            📊 Your biggest expense category is{' '}
                            <span className="font-bold text-color">{analytics.topCategories[0].category}</span>
                            {' '}at {analytics.topCategories[0].percentage.toFixed(0)}% of total spending
                            </p>
                        </div>
                    )}
                </div>
            </LiquidGlassCard>
        </div>
    </div>
  );
}