package com.beehive.dashboard.dto.bank;

import java.util.List;

/**
 * DTO containing all analytics data for a specific time period.
 * Includes overall statistics, chart data points, and category breakdown.
 */
public class AnalyticsStatistics {
    
    private double totalIncome;
    private double totalExpenses;
    private double netBalance;
    private double incomeChange;
    private double expenseChange;
    private List<ChartDataPoint> chartData;
    private List<CategoryBreakdown> categoryBreakdown;

    public AnalyticsStatistics() {
    }

    public AnalyticsStatistics(double totalIncome, double totalExpenses, double netBalance,
                              double incomeChange, double expenseChange,
                              List<ChartDataPoint> chartData,
                              List<CategoryBreakdown> categoryBreakdown) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.netBalance = netBalance;
        this.incomeChange = incomeChange;
        this.expenseChange = expenseChange;
        this.chartData = chartData;
        this.categoryBreakdown = categoryBreakdown;
    }

    public double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public double getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public double getNetBalance() {
        return netBalance;
    }

    public void setNetBalance(double netBalance) {
        this.netBalance = netBalance;
    }

    public double getIncomeChange() {
        return incomeChange;
    }

    public void setIncomeChange(double incomeChange) {
        this.incomeChange = incomeChange;
    }

    public double getExpenseChange() {
        return expenseChange;
    }

    public void setExpenseChange(double expenseChange) {
        this.expenseChange = expenseChange;
    }

    public List<ChartDataPoint> getChartData() {
        return chartData;
    }

    public void setChartData(List<ChartDataPoint> chartData) {
        this.chartData = chartData;
    }

    public List<CategoryBreakdown> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategoryBreakdown> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
}
