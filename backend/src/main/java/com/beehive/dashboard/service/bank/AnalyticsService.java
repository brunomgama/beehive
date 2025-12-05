package com.beehive.dashboard.service.bank;

import com.beehive.dashboard.dto.bank.AnalyticsStatistics;
import com.beehive.dashboard.dto.bank.CategoryBreakdown;
import com.beehive.dashboard.dto.bank.ChartDataPoint;
import com.beehive.dashboard.entity.bank.Movement;
import com.beehive.dashboard.repository.bank.MovementRepository;
import com.beehive.dashboard.types.bank.MovementCategory;
import com.beehive.dashboard.types.bank.MovementStatus;
import com.beehive.dashboard.types.bank.MovementType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for calculating analytics data with different time filters.
 * Provides comprehensive statistics including income/expense trends, comparisons, and category breakdowns.
 */
@Service
public class AnalyticsService {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);
    
    @Autowired
    private MovementRepository movementRepository;

    /**
     * Calculate comprehensive analytics statistics based on time filter.
     * 
     * @param userId User ID to calculate analytics for
     * @param timeFilter Time period filter: "day", "week", "month", or "year"
     * @return AnalyticsStatistics containing all analytics data
     */
    public AnalyticsStatistics calculateAnalytics(Long userId, String timeFilter) {
        logger.info("Calculating analytics for user ID: {} with filter: {}", userId, timeFilter);

        LocalDate now = LocalDate.now();
        
        // Calculate current and previous period ranges
        DateRange currentRange = getDateRange(now, timeFilter);
        DateRange previousRange = getPreviousDateRange(now, timeFilter);
        
        // Fetch movements for current and previous periods
        List<Movement> currentMovements = movementRepository.getAllUsersMovementsByGivenDate(
            userId, currentRange.start, currentRange.end);
        List<Movement> previousMovements = movementRepository.getAllUsersMovementsByGivenDate(
            userId, previousRange.start, previousRange.end);
        
        // Filter confirmed movements
        List<Movement> currentConfirmed = filterConfirmedMovements(currentMovements);
        List<Movement> previousConfirmed = filterConfirmedMovements(previousMovements);
        
        // Calculate totals
        double totalIncome = calculateIncome(currentConfirmed);
        double totalExpenses = calculateExpenses(currentConfirmed);
        double netBalance = totalIncome - totalExpenses;
        
        double previousIncome = calculateIncome(previousConfirmed);
        double previousExpenses = calculateExpenses(previousConfirmed);
        
        // Calculate percentage changes
        double incomeChange = calculatePercentageChange(previousIncome, totalIncome);
        double expenseChange = calculatePercentageChange(previousExpenses, totalExpenses);
        
        // Generate chart data
        List<ChartDataPoint> chartData = generateChartData(currentConfirmed, currentRange, timeFilter);
        
        // Generate category breakdown
        List<CategoryBreakdown> categoryBreakdown = generateCategoryBreakdown(currentConfirmed);
        
        logger.info("Analytics calculated - Income: {}, Expenses: {}, Change: {}%/{}%", 
                   totalIncome, totalExpenses, incomeChange, expenseChange);
        
        return new AnalyticsStatistics(
            totalIncome,
            totalExpenses,
            netBalance,
            Math.round(incomeChange * 10.0) / 10.0,
            Math.round(expenseChange * 10.0) / 10.0,
            chartData,
            categoryBreakdown
        );
    }
    
    /**
     * Get date range for the current period based on time filter.
     */
    private DateRange getDateRange(LocalDate now, String timeFilter) {
        switch (timeFilter.toLowerCase()) {
            case "day":
                return new DateRange(now, now);
            case "week":
                LocalDate weekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                LocalDate weekEnd = weekStart.plusDays(6);
                return new DateRange(weekStart, weekEnd);
            case "month":
                LocalDate monthStart = now.withDayOfMonth(1);
                LocalDate monthEnd = now.withDayOfMonth(now.lengthOfMonth());
                return new DateRange(monthStart, monthEnd);
            case "year":
                LocalDate yearStart = now.withDayOfYear(1);
                LocalDate yearEnd = now.withDayOfYear(now.lengthOfYear());
                return new DateRange(yearStart, yearEnd);
            default:
                return new DateRange(now.withDayOfMonth(1), now.withDayOfMonth(now.lengthOfMonth()));
        }
    }
    
    /**
     * Get date range for the previous period based on time filter.
     */
    private DateRange getPreviousDateRange(LocalDate now, String timeFilter) {
        switch (timeFilter.toLowerCase()) {
            case "day":
                LocalDate prevDay = now.minusDays(1);
                return new DateRange(prevDay, prevDay);
            case "week":
                LocalDate prevWeekStart = now.minusWeeks(1).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                LocalDate prevWeekEnd = prevWeekStart.plusDays(6);
                return new DateRange(prevWeekStart, prevWeekEnd);
            case "month":
                LocalDate prevMonth = now.minusMonths(1);
                LocalDate prevMonthStart = prevMonth.withDayOfMonth(1);
                LocalDate prevMonthEnd = prevMonth.withDayOfMonth(prevMonth.lengthOfMonth());
                return new DateRange(prevMonthStart, prevMonthEnd);
            case "year":
                LocalDate prevYear = now.minusYears(1);
                LocalDate prevYearStart = prevYear.withDayOfYear(1);
                LocalDate prevYearEnd = prevYear.withDayOfYear(prevYear.lengthOfYear());
                return new DateRange(prevYearStart, prevYearEnd);
            default:
                LocalDate prevMonth2 = now.minusMonths(1);
                return new DateRange(
                    prevMonth2.withDayOfMonth(1),
                    prevMonth2.withDayOfMonth(prevMonth2.lengthOfMonth())
                );
        }
    }
    
    /**
     * Filter movements to include only confirmed transactions excluding transfers.
     */
    private List<Movement> filterConfirmedMovements(List<Movement> movements) {
        return movements.stream()
            .filter(m -> MovementStatus.CONFIRMED.equals(m.getStatus()))
            .filter(m -> !MovementCategory.TRANSFER.equals(m.getCategory()))
            .collect(Collectors.toList());
    }
    
    /**
     * Calculate total income from movements.
     */
    private double calculateIncome(List<Movement> movements) {
        return movements.stream()
            .filter(m -> MovementType.INCOME.equals(m.getType()))
            .mapToDouble(Movement::getAmount)
            .sum();
    }
    
    /**
     * Calculate total expenses from movements.
     */
    private double calculateExpenses(List<Movement> movements) {
        return movements.stream()
            .filter(m -> MovementType.EXPENSE.equals(m.getType()))
            .mapToDouble(m -> Math.abs(m.getAmount()))
            .sum();
    }
    
    /**
     * Calculate percentage change between two values.
     */
    private double calculatePercentageChange(double oldValue, double newValue) {
        if (oldValue == 0) {
            return newValue > 0 ? 100.0 : 0.0;
        }
        return ((newValue - oldValue) / oldValue) * 100.0;
    }
    
    /**
     * Generate chart data points based on time filter.
     */
    private List<ChartDataPoint> generateChartData(List<Movement> movements, DateRange range, String timeFilter) {
        switch (timeFilter.toLowerCase()) {
            case "day":
                return generateDayChartData(movements, range);
            case "week":
                return generateWeekChartData(movements, range);
            case "month":
                return generateMonthChartData(movements, range);
            case "year":
                return generateYearChartData(movements, range);
            default:
                return generateMonthChartData(movements, range);
        }
    }
    
    /**
     * Generate chart data for day view (6-hour intervals).
     */
    private List<ChartDataPoint> generateDayChartData(List<Movement> movements, DateRange range) {
        List<ChartDataPoint> chartData = new ArrayList<>();
        String[] labels = {"00h", "06h", "12h", "18h", "24h"};
        
        for (int i = 0; i < 5; i++) {
            int hourStart = i * 6;
            int hourEnd = (i + 1) * 6;
            
            double income = movements.stream()
                .filter(m -> MovementType.INCOME.equals(m.getType()))
                .filter(m -> {
                    LocalTime time = m.getDate().atStartOfDay().toLocalTime();
                    int hour = time.getHour();
                    return hour >= hourStart && hour < hourEnd;
                })
                .mapToDouble(Movement::getAmount)
                .sum();
            
            double expense = movements.stream()
                .filter(m -> MovementType.EXPENSE.equals(m.getType()))
                .filter(m -> {
                    LocalTime time = m.getDate().atStartOfDay().toLocalTime();
                    int hour = time.getHour();
                    return hour >= hourStart && hour < hourEnd;
                })
                .mapToDouble(m -> Math.abs(m.getAmount()))
                .sum();
            
            chartData.add(new ChartDataPoint(labels[i], income, expense));
        }
        
        return chartData;
    }
    
    /**
     * Generate chart data for week view (daily breakdown).
     */
    private List<ChartDataPoint> generateWeekChartData(List<Movement> movements, DateRange range) {
        List<ChartDataPoint> chartData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE");
        
        for (LocalDate date = range.start; !date.isAfter(range.end); date = date.plusDays(1)) {
            LocalDate currentDate = date;
            
            double income = movements.stream()
                .filter(m -> MovementType.INCOME.equals(m.getType()))
                .filter(m -> m.getDate().isEqual(currentDate))
                .mapToDouble(Movement::getAmount)
                .sum();
            
            double expense = movements.stream()
                .filter(m -> MovementType.EXPENSE.equals(m.getType()))
                .filter(m -> m.getDate().isEqual(currentDate))
                .mapToDouble(m -> Math.abs(m.getAmount()))
                .sum();
            
            chartData.add(new ChartDataPoint(date.format(formatter), income, expense));
        }
        
        return chartData;
    }
    
    /**
     * Generate chart data for month view (weekly breakdown).
     */
    private List<ChartDataPoint> generateMonthChartData(List<Movement> movements, DateRange range) {
        List<ChartDataPoint> chartData = new ArrayList<>();
        
        LocalDate weekStart = range.start;
        int weekNumber = 1;
        
        while (!weekStart.isAfter(range.end)) {
            LocalDate weekEnd = weekStart.plusDays(6);
            if (weekEnd.isAfter(range.end)) {
                weekEnd = range.end;
            }
            
            LocalDate finalWeekStart = weekStart;
            LocalDate finalWeekEnd = weekEnd;
            
            double income = movements.stream()
                .filter(m -> MovementType.INCOME.equals(m.getType()))
                .filter(m -> !m.getDate().isBefore(finalWeekStart) && !m.getDate().isAfter(finalWeekEnd))
                .mapToDouble(Movement::getAmount)
                .sum();
            
            double expense = movements.stream()
                .filter(m -> MovementType.EXPENSE.equals(m.getType()))
                .filter(m -> !m.getDate().isBefore(finalWeekStart) && !m.getDate().isAfter(finalWeekEnd))
                .mapToDouble(m -> Math.abs(m.getAmount()))
                .sum();
            
            chartData.add(new ChartDataPoint("W" + weekNumber, income, expense));
            
            weekStart = weekStart.plusWeeks(1);
            weekNumber++;
        }
        
        return chartData;
    }
    
    /**
     * Generate chart data for year view (monthly breakdown).
     */
    private List<ChartDataPoint> generateYearChartData(List<Movement> movements, DateRange range) {
        List<ChartDataPoint> chartData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");
        
        LocalDate monthStart = range.start;
        
        while (!monthStart.isAfter(range.end)) {
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
            if (monthEnd.isAfter(range.end)) {
                monthEnd = range.end;
            }
            
            LocalDate finalMonthStart = monthStart;
            LocalDate finalMonthEnd = monthEnd;
            
            double income = movements.stream()
                .filter(m -> MovementType.INCOME.equals(m.getType()))
                .filter(m -> !m.getDate().isBefore(finalMonthStart) && !m.getDate().isAfter(finalMonthEnd))
                .mapToDouble(Movement::getAmount)
                .sum();
            
            double expense = movements.stream()
                .filter(m -> MovementType.EXPENSE.equals(m.getType()))
                .filter(m -> !m.getDate().isBefore(finalMonthStart) && !m.getDate().isAfter(finalMonthEnd))
                .mapToDouble(m -> Math.abs(m.getAmount()))
                .sum();
            
            chartData.add(new ChartDataPoint(monthStart.format(formatter), income, expense));
            
            monthStart = monthStart.plusMonths(1);
        }
        
        return chartData;
    }
    
    /**
     * Generate category breakdown for expenses.
     */
    private List<CategoryBreakdown> generateCategoryBreakdown(List<Movement> movements) {
        List<Movement> expenses = movements.stream()
            .filter(m -> MovementType.EXPENSE.equals(m.getType()))
            .collect(Collectors.toList());
        
        double totalExpenses = expenses.stream()
            .mapToDouble(m -> Math.abs(m.getAmount()))
            .sum();
        
        if (totalExpenses == 0) {
            return new ArrayList<>();
        }
        
        // Group by category and sum amounts
        Map<MovementCategory, Double> categoryTotals = expenses.stream()
            .collect(Collectors.groupingBy(
                Movement::getCategory,
                Collectors.summingDouble(m -> Math.abs(m.getAmount()))
            ));
        
        // Convert to CategoryBreakdown and sort by amount
        return categoryTotals.entrySet().stream()
            .map(entry -> {
                String categoryName = formatCategoryName(entry.getKey());
                double amount = entry.getValue();
                int percentage = (int) Math.round((amount / totalExpenses) * 100);
                return new CategoryBreakdown(categoryName, entry.getKey().toString(), amount, percentage);
            })
            .sorted((a, b) -> Double.compare(b.getAmount(), a.getAmount()))
            .limit(6)
            .collect(Collectors.toList());
    }
    
    /**
     * Format category enum to human-readable name.
     */
    private String formatCategoryName(MovementCategory category) {
        String name = category.toString();
        return Arrays.stream(name.split("_"))
            .map(word -> word.charAt(0) + word.substring(1).toLowerCase())
            .collect(Collectors.joining(" "));
    }
    
    /**
     * Helper class to represent date ranges.
     */
    private static class DateRange {
        LocalDate start;
        LocalDate end;
        
        DateRange(LocalDate start, LocalDate end) {
            this.start = start;
            this.end = end;
        }
    }
}
