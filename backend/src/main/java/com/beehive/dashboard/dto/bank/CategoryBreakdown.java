package com.beehive.dashboard.dto.bank;

/**
 * DTO representing expense breakdown by category.
 * Includes category name, total amount, and percentage of total expenses.
 */
public class CategoryBreakdown {
    
    private String name;
    private String category;
    private double amount;
    private int percentage;

    public CategoryBreakdown() {
    }

    public CategoryBreakdown(String name, String category, double amount, int percentage) {
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.percentage = percentage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setPercentage(int percentage) {
        this.percentage = percentage;
    }
}
