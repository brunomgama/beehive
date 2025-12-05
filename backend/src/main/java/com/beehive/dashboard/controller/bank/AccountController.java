package com.beehive.dashboard.controller.bank;

import com.beehive.dashboard.dto.bank.AnalyticsStatistics;
import com.beehive.dashboard.dto.bank.LandingStatistics;
import com.beehive.dashboard.entity.bank.Account;
import com.beehive.dashboard.service.bank.AccountService;
import com.beehive.dashboard.service.bank.AnalyticsService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for managing bank account operations.
 * Provides endpoints for creating, reading, updating, and deleting bank accounts.
 */
@RestController
@RequestMapping("/v1/bank/accounts")
public class AccountController {

    private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

    @Autowired
    private AccountService accountService;

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * Creates a new bank account in the system.
     *
     * @param account Account entity containing account details to be created
     * @return ResponseEntity with created Account or error message if account creation fails
     */
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Account account) {
        logger.info("Request to create new account with IBAN: {} for user ID: {}", account.getIban(), account.getUserId());

        try {
            logger.debug("Validating account data before creation: {}", account.getAccountName());
            Account createdAccount = accountService.create(account);
            logger.info("Account created successfully with ID: {} and IBAN: {}", createdAccount.getId(), createdAccount.getIban());

            return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
        } catch (RuntimeException e) {
            logger.error("Failed to create account with IBAN: {} - Error: {}", account.getIban(), e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Retrieves all bank accounts from the system.
     *
     * @return ResponseEntity containing list of all accounts
     */
    @GetMapping
    public ResponseEntity<List<Account>> getAll() {
        logger.info("Request to retrieve all accounts");

        List<Account> accounts = accountService.getAll();
        logger.info("Retrieved {} accounts from database", accounts.size());
        logger.debug("Account list size: {}", accounts.size());

        return ResponseEntity.status(HttpStatus.OK).body(accounts);
    }

    /**
     * Retrieves a specific bank account by its ID.
     *
     * @param id The unique identifier of the account to retrieve
     * @return ResponseEntity containing the requested account
     */
    @GetMapping("/{id}")
    public ResponseEntity<Account> getById(@PathVariable Long id) {
        logger.info("Request to retrieve account with ID: {}", id);

        try {
            Account account = accountService.getById(id);
            logger.info("Successfully retrieved account with ID: {} and IBAN: {}", id, account.getIban());
            logger.debug("Account details - Name: {}, Type: {}", account.getAccountName(), account.getType());

            return ResponseEntity.status(HttpStatus.OK).body(account);
        } catch (RuntimeException e) {
            logger.error("Failed to retrieve account with ID: {} - Error: {}", id, e.getMessage());
            throw e;
        }
    }

    /**
     * Retrieves all bank accounts belonging to a specific user.
     *
     * @param userId The unique identifier of the user whose accounts to retrieve
     * @return ResponseEntity containing list of user's accounts or NOT_FOUND if no accounts exist
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Account>> getByUserId(@PathVariable Long userId) {
        logger.info("Request to retrieve accounts for user ID: {}", userId);

        try {
            List<Account> accounts = accountService.getByUserId(userId);
            logger.info("Successfully retrieved {} accounts for user ID: {}", accounts.size(), userId);
            logger.debug("User {} has accounts with IBANs: {}", userId,
                    accounts.stream().map(Account::getIban).toList());

            return ResponseEntity.status(HttpStatus.OK).body(accounts);
        } catch (RuntimeException e) {
            logger.warn("No accounts found for user ID: {} - Error: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Updates an existing bank account with new information.
     *
     * @param id      The unique identifier of the account to update
     * @param account Account entity containing updated account details
     * @return ResponseEntity with updated Account or error message if update fails
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Account account) {
        logger.info("Request to update account with ID: {} - New IBAN: {}", id, account.getIban());

        try {
            logger.debug("Updating account ID: {} with new details - Name: {}, Type: {}",
                    id, account.getAccountName(), account.getType());
            Account updatedAccount = accountService.update(id, account);
            logger.info("Account with ID: {} updated successfully", id);
            logger.debug("Updated account details - IBAN: {}, Balance: {}",
                    updatedAccount.getIban(), updatedAccount.getBalance());

            return ResponseEntity.status(HttpStatus.OK).body(updatedAccount);
        } catch (RuntimeException e) {
            logger.error("Failed to update account with ID: {} - Error: {}", id, e.getMessage());

            if (e.getMessage().contains("not found")) {
                logger.warn("Account with ID: {} not found during update attempt", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Deletes a bank account from the system.
     *
     * @param id The unique identifier of the account to delete
     * @return ResponseEntity indicating success or failure of deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        logger.info("Request to delete account with ID: {}", id);

        try {
            logger.debug("Attempting to delete account with ID: {}", id);
            accountService.delete(id);
            logger.info("Account with ID: {} deleted successfully", id);

            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (RuntimeException e) {
            logger.error("Failed to delete account with ID: {} - Error: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Retrieves the total count of bank accounts in the system.
     *
     * @return ResponseEntity containing the count of accounts as a JSON object
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> count() {
        logger.info("Request to get total account count");

        long count = accountService.count();
        logger.info("Total accounts in system: {}", count);
        logger.debug("Returning account count: {}", count);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("count", count));
    }

    /**
     * Retrieves comprehensive landing page statistics for a user.
     * Includes balance, income, expenses, account count, balance trend, and upcoming payments.
     *
     * @param userId The unique identifier of the user
     * @return ResponseEntity containing landing page statistics
     */
    @GetMapping("/landing/{userId}")
    public ResponseEntity<LandingStatistics> landingStatistics(@PathVariable Long userId) {
        logger.info("Request to get landing page statistics for user ID: {}", userId);

        LandingStatistics landingStatistics = accountService.landingStatistics(userId);

        return ResponseEntity.status(HttpStatus.OK).body(landingStatistics);
    }

    /**
     * Retrieves comprehensive analytics statistics for a user based on time filter.
     *
     * @param userId     The unique identifier of the user
     * @param timeFilter Time period filter: "day", "week", "month", or "year" (defaults to "month")
     * @return ResponseEntity containing analytics statistics including income/expense data, 
     *         chart data points, and category breakdown
     */
    @GetMapping("/analytics/{userId}")
    public ResponseEntity<AnalyticsStatistics> analyticsStatistics(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "month") String timeFilter) {
        logger.info("Request to get analytics statistics for user ID: {} with filter: {}", userId, timeFilter);

        try {
            AnalyticsStatistics analyticsStats = analyticsService.calculateAnalytics(userId, timeFilter);
            logger.info("Successfully calculated analytics for user ID: {} with filter: {}", userId, timeFilter);
            return ResponseEntity.status(HttpStatus.OK).body(analyticsStats);
        } catch (RuntimeException e) {
            logger.error("Failed to calculate analytics for user ID: {} - Error: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}