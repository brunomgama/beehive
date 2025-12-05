package com.beehive.dashboard.dto.bank;

/**
 * DTO representing a data point for analytics charts.
 * Contains label and values for income and expense for a specific time interval.
 */
public class ChartDataPoint {
    
    private String label;
    private double income;
    private double expense;

    public ChartDataPoint() {
    }

    public ChartDataPoint(String label, double income, double expense) {
        this.label = label;
        this.income = income;
        this.expense = expense;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public double getIncome() {
        return income;
    }

    public void setIncome(double income) {
        this.income = income;
    }

    public double getExpense() {
        return expense;
    }

    public void setExpense(double expense) {
        this.expense = expense;
    }
}
