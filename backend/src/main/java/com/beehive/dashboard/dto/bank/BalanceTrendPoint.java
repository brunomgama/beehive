package com.beehive.dashboard.dto.bank;

public class BalanceTrendPoint {
    private String date;     
    private String fullDate; 
    private Double actual;   
    private Double projected;
    private boolean isToday;
    private boolean isFuture;

    public BalanceTrendPoint() {}

    public BalanceTrendPoint(String date, String fullDate, Double actual, Double projected, boolean isToday, boolean isFuture) {
        this.date = date;
        this.fullDate = fullDate;
        this.actual = actual;
        this.projected = projected;
        this.isToday = isToday;
        this.isFuture = isFuture;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getFullDate() {
        return fullDate;
    }

    public void setFullDate(String fullDate) {
        this.fullDate = fullDate;
    }

    public Double getActual() {
        return actual;
    }

    public void setActual(Double actual) {
        this.actual = actual;
    }

    public Double getProjected() {
        return projected;
    }

    public void setProjected(Double projected) {
        this.projected = projected;
    }

    public boolean isToday() {
        return isToday;
    }

    public void setToday(boolean today) {
        isToday = today;
    }

    public boolean isFuture() {
        return isFuture;
    }

    public void setFuture(boolean future) {
        isFuture = future;
    }
}
