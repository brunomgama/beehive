package com.beehive.dashboard.dto.bank;

public class UpcomingPayment {
    private Long id;
    private String description;
    private double amount;
    private String type;    
    private String date;    
    private String category;

    public UpcomingPayment() {}

    public UpcomingPayment(Long id, String description, double amount, String type, String date, String category) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
