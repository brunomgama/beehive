package com.beehive.dashboard.service.bank;

import com.beehive.dashboard.dto.bank.LandingStatistics;
import com.beehive.dashboard.entity.bank.Account;
import com.beehive.dashboard.repository.bank.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Service class for managing bank account business logic.
 * Simplified to focus on CRUD operations and orchestration.
 * Statistics calculation is delegated to BankStatisticsService.
 * Validation is delegated to BankValidationService.
 */
@Service
public class AccountService {
    
    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BankValidationService validationService;

    @Autowired
    private BankStatisticsService statisticsService;

    /**
     * Creates a new bank account after validating IBAN uniqueness.
     */
    public Account create(Account account) {
        logger.info("Creating new account with IBAN: {} for user ID: {}", account.getIban(), account.getUserId());

        validationService.validateIbanUnique(account.getIban());

        Account savedAccount = accountRepository.save(account);
        logger.info("Account created successfully with ID: {} and IBAN: {}",
            savedAccount.getId(), savedAccount.getIban());

        return savedAccount;
    }

    /**
     * Retrieves all bank accounts from the database, sorted by priority.
     */
    public List<Account> getAll() {
        logger.info("Retrieving all accounts from database");

        List<Account> accounts = accountRepository.findAll().
                stream().
                sorted((a, b) -> Math.toIntExact(a.getPriority() - b.getPriority())).toList();
        logger.info("Successfully retrieved {} accounts", accounts.size());

        return accounts;
    }

    /**
     * Retrieves a specific bank account by its unique identifier.
     */
    public Account getById(Long id) {
        logger.info("Retrieving account with ID: {}", id);

        Account account = accountRepository.findById(id).orElseThrow(() -> {
            logger.error("Account not found with ID: {}", id);
            return new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Account not found with the provided id: " + id);
        });

        logger.info("Successfully retrieved account with ID: {} - IBAN: {}", id, account.getIban());
        return account;
    }

    /**
     * Retrieves all bank accounts belonging to a specific user.
     */
    public List<Account> getByUserId(Long userId) {
        logger.info("Retrieving accounts for user ID: {}", userId);

        List<Account> accounts = accountRepository.findByUserId(userId).stream().toList();

        if(accounts.isEmpty()) {
            logger.warn("No accounts found for user ID: {}", userId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "There are no accounts for user: " + userId);
        }

        logger.info("Successfully retrieved {} accounts for user ID: {}", accounts.size(), userId);
        return accounts;
    }

    /**
     * Updates an existing bank account with new information.
     */
    public Account update(Long id, Account accountDetails) {
        logger.info("Updating account with ID: {} - New IBAN: {}", id, accountDetails.getIban());

        Account account = getById(id);

        validationService.validateIbanUniqueForUpdate(id, accountDetails.getIban(), account.getIban());

        account.setAccountName(accountDetails.getAccountName());
        account.setIban(accountDetails.getIban());
        account.setBalance(accountDetails.getBalance());
        account.setUserId(accountDetails.getUserId());
        account.setType(accountDetails.getType());
        account.setPriority(accountDetails.getPriority());

        Account updatedAccount = accountRepository.save(account);
        logger.info("Account with ID: {} updated successfully - New IBAN: {}", id, updatedAccount.getIban());

        return updatedAccount;
    }

    /**
     * Deletes a bank account from the system.
     */
    public void delete(Long id) {
        logger.info("Deleting account with ID: {}", id);

        Account account = getById(id);
        accountRepository.delete(account);
        logger.info("Account with ID: {} deleted successfully", id);
    }

    /**
     * Retrieves the total count of bank accounts in the system.
     */
    public long count() {
        logger.info("Counting total number of accounts in database");
        long totalAccounts = accountRepository.count();
        logger.info("Total accounts count: {}", totalAccounts);
        return totalAccounts;
    }

    /**
     * Calculate landing statistics for a user.
     * Delegates to BankStatisticsService.
     */
    public LandingStatistics landingStatistics(Long userId) {
        logger.info("Calculating landing statistics for user ID: {}", userId);
        
        List<Account> accounts = accountRepository.findByUserId(userId);
        return statisticsService.calculateLandingStatistics(userId, accounts);
    }
}