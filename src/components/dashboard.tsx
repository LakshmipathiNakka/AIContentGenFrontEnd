import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, CreditCard } from "lucide-react";


interface DashboardProps {
  totalUsers: number;
  totalRevenue: number;
  activeUsers: number;
  totalTransactions: number;
}

export function Dashboard({ totalUsers, totalRevenue, activeUsers, totalTransactions }: DashboardProps) {
  const [animatedValues, setAnimatedValues] = useState({
    users: 0,
    revenue: 0,
    active: 0,
    transactions: 0
  });

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const interval = duration / steps;

    const animateValue = (start: number, end: number, setter: (value: number) => void) => {
      let current = start;
      const increment = (end - start) / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, interval);
    };

    animateValue(0, totalUsers, (value) => setAnimatedValues(prev => ({ ...prev, users: value })));
    animateValue(0, totalRevenue, (value) => setAnimatedValues(prev => ({ ...prev, revenue: value })));
    animateValue(0, activeUsers, (value) => setAnimatedValues(prev => ({ ...prev, active: value })));
    animateValue(0, totalTransactions, (value) => setAnimatedValues(prev => ({ ...prev, transactions: value })));
  }, [totalUsers, totalRevenue, activeUsers, totalTransactions]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{animatedValues.users}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+20.1%</span> from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${animatedValues.revenue}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+15%</span> from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{animatedValues.active}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+10%</span> from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{animatedValues.transactions}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+12%</span> from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 