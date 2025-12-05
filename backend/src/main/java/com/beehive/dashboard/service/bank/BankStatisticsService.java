package com.beehive.dashboard.service.bank;

import com.beehive.dashboard.dto.bank.BalanceTrendPoint;
import com.beehive.dashboard.dto.bank.LandingStatistics;
import com.beehive.dashboard.dto.bank.UpcomingPayment;
import com.beehive.dashboard.entity.bank.Account;
import com.beehive.dashboard.entity.bank.Movement;
import com.beehive.dashboard.entity.bank.Planned;
import com.beehive.dashboard.repository.bank.MovementRepository;
import com.beehive.dashboard.repository.bank.PlannedRepository;
import com.beehive.dashboard.types.bank.MovementStatus;
import com.beehive.dashboard.types.bank.MovementType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service dedicated to calculating statistics and analytics for bank accounts.
 * Handles landing page statistics, balance trends, and upcoming payments.
 */
@Service
public class BankStatisticsService {
    
    private static final Logger logger = LoggerFactory.getLogger(BankStatisticsService.class);

    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private PlannedRepository plannedRepository;

    /**
     * Calculate comprehensive landing statistics for a user.
     */
    public LandingStatistics calculateLandingStatistics(Long userId, List<Account> accounts) {
        logger.info("Calculating landing statistics for user ID: {}", userId);

        if (accounts.isEmpty()) {
            logger.warn("No accounts found for user ID: {}", userId);
            return new LandingStatistics(0, 0, 0, 0, 0, new ArrayList<>(), new ArrayList<>());
        }

        int accountCount = accounts.size();
        double totalBalance = accounts.stream().mapToDouble(Account::getBalance).sum();

        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate monthEnd = now.withDayOfMonth(now.lengthOfMonth());

        double income = calculateMonthlyIncome(userId, monthStart, monthEnd);
        double expenses = calculateMonthlyExpenses(userId, monthStart, monthEnd);
        double expectedImpact = calculateExpectedImpact(userId, monthStart, monthEnd);

        List<BalanceTrendPoint> balanceTrend = calculateBalanceTrend(userId, totalBalance);
        List<UpcomingPayment> upcomingPayments = getUpcomingPayments(userId, now);

        logger.info("Landing statistics calculated - Balance: {}, Income: {}, Expenses: {}", 
                   totalBalance, income, expenses);

        return new LandingStatistics(totalBalance, income, expenses, expectedImpact, accountCount, balanceTrend, upcomingPayments);
    }

    /**
     * Calculate monthly income for a user.
     */
    public double calculateMonthlyIncome(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Movement> movements = movementRepository.getAllUsersMovementsByGivenDate(userId, startDate, endDate);
        
        return movements.stream()
                .filter(m -> MovementType.INCOME.equals(m.getType()) && MovementStatus.CONFIRMED.equals(m.getStatus()))
                .mapToDouble(Movement::getAmount)
                .sum();
    }

    /**
     * Calculate monthly expenses for a user.
     */
    public double calculateMonthlyExpenses(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Movement> movements = movementRepository.getAllUsersMovementsByGivenDate(userId, startDate, LocalDate.now());
        
        return movements.stream()
                .filter(m -> MovementType.EXPENSE.equals(m.getType()) && MovementStatus.CONFIRMED.equals(m.getStatus()))
                .mapToDouble(Movement::getAmount)
                .sum();
    }

    /**
     * Calculate expected impact from planned transactions.
     */
    public double calculateExpectedImpact(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Planned> planned = plannedRepository.getAllUsersPlannedMovementsByGivenDate(userId, startDate, endDate);

        LocalDate now = LocalDate.now();
        LocalDate startDatePlusDate = now.plusDays(1);

        List<Movement> movements = movementRepository.getAllUsersMovementsByGivenDate(userId, startDatePlusDate, endDate);
        
        double amountPlanned = planned.stream()
                        .filter(p -> !MovementStatus.CANCELLED.equals(p.getStatus()) && !MovementStatus.FAILED.equals(p.getStatus()))
                        .mapToDouble(p -> MovementType.INCOME.equals(p.getType()) ? p.getAmount() : -p.getAmount())
                        .sum();

        double amountMovements = movements.stream()
                    .filter(m -> !MovementStatus.CANCELLED.equals(m.getStatus()) && !MovementStatus.FAILED.equals(m.getStatus()))
                    .mapToDouble(m -> MovementType.INCOME.equals(m.getType()) ? m.getAmount() : -m.getAmount())
                    .sum();

        logger.info("Start Date {} -> Plus+1 {} -> End Date {}", startDate, endDate, startDatePlusDate);
        logger.info("Calculating expected impact: {} (Planned), {} (Future Movements)", amountPlanned, amountMovements);

        return amountPlanned+amountMovements;
    }

    /**
     * Calculate balance trend over a 29-day period (14 days past, today, 14 days future).
     */
    public List<BalanceTrendPoint> calculateBalanceTrend(Long userId, double currentBalance) {
        logger.debug("Calculating balance trend for user ID: {}", userId);

        LocalDate now = LocalDate.now();
        LocalDate startDate = now.minusDays(14);
        LocalDate endDate = now.plusDays(14);

        List<Movement> allMovements = movementRepository.getAllUsersMovementsByGivenDate(userId, startDate, endDate);
        List<Planned> allPlanned = plannedRepository.getAllUsersPlannedMovementsByGivenDate(userId, startDate, endDate);

        List<Movement> confirmedMovements = allMovements.stream()
                .filter(m -> MovementStatus.CONFIRMED.equals(m.getStatus()))
                .collect(Collectors.toList());

        List<Planned> activePlanned = allPlanned.stream()
                .filter(p -> !MovementStatus.CANCELLED.equals(p.getStatus()) 
                          && !MovementStatus.FAILED.equals(p.getStatus()))
                .collect(Collectors.toList());

        DateTimeFormatter labelFormatter = DateTimeFormatter.ofPattern("MMM d");
        DateTimeFormatter fullFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        List<BalanceTrendPoint> trend = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            String dateLabel = date.format(labelFormatter);
            String fullDate = date.format(fullFormatter);
            boolean isToday = date.isEqual(now);
            boolean isFuture = date.isAfter(now);

            double dayBalance = calculateBalanceForDate(date, now, currentBalance, 
                                                       confirmedMovements, activePlanned, 
                                                       isToday, isFuture);

            BalanceTrendPoint point = new BalanceTrendPoint(
                    dateLabel,
                    fullDate,
                    !isFuture ? dayBalance : null,
                    isFuture || isToday ? dayBalance : null,
                    isToday,
                    isFuture
            );

            trend.add(point);
        }

        logger.debug("Balance trend calculated with {} data points", trend.size());
        return trend;
    }

    /**
     * Calculate balance for a specific date.
     */
    private double calculateBalanceForDate(LocalDate date, LocalDate now, double currentBalance,
                                          List<Movement> movements, List<Planned> planned,
                                          boolean isToday, boolean isFuture) {
        double dayBalance = currentBalance;

        if (!isFuture && !isToday) {
            // Calculate past balance by removing movements between date and now
            for (Movement m : movements) {
                if (m.getDate().isAfter(date) && !m.getDate().isAfter(now)) {
                    dayBalance += getBalanceImpact(m.getAmount(), m.getType(), true);
                }
            }
        } else if (isFuture) {
            // Calculate future balance by adding movements and planned between now and date
            for (Movement m : movements) {
                if (m.getDate().isAfter(now) && !m.getDate().isAfter(date)) {
                    dayBalance += getBalanceImpact(m.getAmount(), m.getType(), false);
                }
            }

            for (Planned p : planned) {
                if (p.getNextExecution().isAfter(now) && !p.getNextExecution().isAfter(date)) {
                    dayBalance += getBalanceImpact(p.getAmount(), p.getType(), false);
                }
            }
        }

        return dayBalance;
    }

    /**
     * Calculate balance impact based on transaction type and direction.
     */
    private double getBalanceImpact(double amount, MovementType type, boolean reverse) {
        if (type == MovementType.INCOME) {
            return reverse ? -amount : amount;
        } else {
            return reverse ? amount : -amount;
        }
    }

    /**
     * Get upcoming payments for the next 30 days.
     */
    public List<UpcomingPayment> getUpcomingPayments(Long userId, LocalDate now) {
        logger.debug("Fetching upcoming payments for user ID: {}", userId);

        LocalDate futureDate = now.plusDays(30);
        List<Planned> upcomingPlanned = plannedRepository.getAllUsersPlannedMovementsByGivenDate(userId, now, futureDate);

        List<UpcomingPayment> payments = upcomingPlanned.stream()
                .filter(p -> !MovementStatus.CANCELLED.equals(p.getStatus()) 
                          && !MovementStatus.FAILED.equals(p.getStatus()))
                .filter(p -> p.getNextExecution().isAfter(now))
                .sorted((a, b) -> a.getNextExecution().compareTo(b.getNextExecution()))
                .limit(10)
                .map(p -> new UpcomingPayment(
                        p.getId(),
                        p.getDescription(),
                        p.getAmount(),
                        p.getType().toString(),
                        p.getNextExecution().toString(),
                        p.getCategory() != null ? p.getCategory().toString() : "OTHER"
                ))
                .collect(Collectors.toList());

        logger.debug("Found {} upcoming payments", payments.size());
        return payments;
    }
}
