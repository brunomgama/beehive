package com.beehive.dashboard.dto.bank;

import java.util.List;

public class LandingStatistics {

    private double balance;
    private double availableBalance;
    private double income;
    private double expenses;
    private double expectedImpact;
    private int accountCount;
    private List<BalanceTrendPoint> balanceTrend;
    private List<UpcomingPayment> upcomingPayments;

    public LandingStatistics() {
    }

    public LandingStatistics(double balance, double availableBalance, double income, double expenses, double expectedImpact,
                           int accountCount, List<BalanceTrendPoint> balanceTrend,
                           List<UpcomingPayment> upcomingPayments) {
        this.balance = balance;
        this.availableBalance = availableBalance;
        this.income = income;
        this.expenses = expenses;
        this.expectedImpact = expectedImpact;
        this.accountCount = accountCount;
        this.balanceTrend = balanceTrend;
        this.upcomingPayments = upcomingPayments;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public double getAvailableBalance() {
        return availableBalance;
    }

    public void setAvailableBalance(double availableBalance) {
        this.availableBalance = availableBalance;
    }

    public double getIncome() {
        return income;
    }

    public void setIncome(double income) {
        this.income = income;
    }

    public double getExpenses() {
        return expenses;
    }

    public void setExpenses(double expenses) {
        this.expenses = expenses;
    }

    public double getExpectedImpact() {
        return expectedImpact;
    }

    public void setExpectedImpact(double expectedImpact) {
        this.expectedImpact = expectedImpact;
    }

    public int getAccountCount() {
        return accountCount;
    }

    public void setAccountCount(int accountCount) {
        this.accountCount = accountCount;
    }

    public List<BalanceTrendPoint> getBalanceTrend() {
        return balanceTrend;
    }

    public void setBalanceTrend(List<BalanceTrendPoint> balanceTrend) {
        this.balanceTrend = balanceTrend;
    }

    public List<UpcomingPayment> getUpcomingPayments() {
        return upcomingPayments;
    }

    public void setUpcomingPayments(List<UpcomingPayment> upcomingPayments) {
        this.upcomingPayments = upcomingPayments;
    }
}
