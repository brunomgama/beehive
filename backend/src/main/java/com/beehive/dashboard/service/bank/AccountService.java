package com.beehive.dashboard.service.bank;

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
 * Handles account creation, retrieval, updating, deletion, and validation operations.
 */
@Service
public class AccountService {
    
    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);

    @Autowired
    private AccountRepository accountRepository;

    /**
     * Creates a new bank account after validating IBAN uniqueness.
     *
     * @param account Account entity containing the account details to be created
     * @return Account entity representing the newly created account with generated ID
     * @throws ResponseStatusException with CONFLICT status if IBAN already exists
     */
    public Account create(Account account) {
        logger.info("Creating new account with IBAN: {} for user ID: {}", account.getIban(), account.getUserId());

        logger.debug("Validating IBAN uniqueness for: {}", account.getIban());
        if (accountRepository.existsByIban(account.getIban())) {
            logger.warn("Account creation failed - IBAN already exists: {}", account.getIban());
            throw new ResponseStatusException(HttpStatus.CONFLICT, "IBAN already exists: " + account.getIban());
        }

        logger.debug("Saving account to database - Name: {}, Type: {}, Balance: {}",
            account.getAccountName(), account.getType(), account.getBalance());
        Account savedAccount = accountRepository.save(account);
        logger.info("Account created successfully with ID: {} and IBAN: {}",
            savedAccount.getId(), savedAccount.getIban());

        return savedAccount;
    }

    /**
     * Retrieves all bank accounts from the database.
     *
     * @return List of all Account entities in the system
     */
    public List<Account> getAll() {
        logger.info("Retrieving all accounts from database");

        List<Account> accounts = accountRepository.findAll();
        logger.info("Successfully retrieved {} accounts", accounts.size());
        logger.debug("Account retrieval completed - returning {} records", accounts.size());

        return accounts;
    }

    /**
     * Retrieves a specific bank account by its unique identifier.
     *
     * @param id The unique identifier of the account to retrieve
     * @return Account entity matching the provided ID
     * @throws ResponseStatusException with NOT_FOUND status if account doesn't exist
     */
    public Account getById(Long id) {
        logger.info("Retrieving account with ID: {}", id);

        logger.debug("Searching database for account ID: {}", id);
        Account account = accountRepository.findById(id).orElseThrow(() -> {
            logger.error("Account not found with ID: {}", id);
            return new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Account not found with the provided id: " + id);
        });

        logger.info("Successfully retrieved account with ID: {} - IBAN: {}", id, account.getIban());
        logger.debug("Account details - Name: {}, Type: {}, Balance: {}",
            account.getAccountName(), account.getType(), account.getBalance());

        return account;
    }

    /**
     * Retrieves all bank accounts belonging to a specific user.
     *
     * @param userId The unique identifier of the user whose accounts to retrieve
     * @return List of Account entities belonging to the specified user
     * @throws ResponseStatusException with NOT_FOUND status if no accounts exist for the user
     */
    public List<Account> getByUserId(Long userId) {
        logger.info("Retrieving accounts for user ID: {}", userId);

        logger.debug("Searching database for accounts belonging to user ID: {}", userId);
        List<Account> accounts = accountRepository.findByUserId(userId).stream().toList();

        if(accounts.isEmpty()) {
            logger.warn("No accounts found for user ID: {}", userId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "There are no accounts for user: " + userId);
        }

        logger.info("Successfully retrieved {} accounts for user ID: {}", accounts.size(), userId);
        logger.debug("User {} has {} accounts with IBANs: {}", userId, accounts.size(),
            accounts.stream().map(Account::getIban).toList());

        return accounts;
    }

    /**
     * Updates an existing bank account with new information.
     *
     * @param id The unique identifier of the account to update
     * @param accountDetails Account entity containing the updated information
     * @return Account entity representing the updated account
     * @throws ResponseStatusException with NOT_FOUND status if account doesn't exist
     * @throws RuntimeException if the new IBAN already exists for a different account
     */
    public Account update(Long id, Account accountDetails) {
        logger.info("Updating account with ID: {} - New IBAN: {}", id, accountDetails.getIban());

        logger.debug("Retrieving existing account with ID: {}", id);
        Account account = accountRepository.findById(id).
                orElseThrow(() -> {
                    logger.error("Account not found during update - ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Account not found with the provided id: " + id);
                });

        logger.debug("Validating IBAN change for account ID: {} - Old: {}, New: {}",
            id, account.getIban(), accountDetails.getIban());
        if (!account.getIban().equals(accountDetails.getIban()) &&
                accountRepository.existsByIban(accountDetails.getIban())) {
            logger.warn("Update failed - IBAN already exists: {} for account ID: {}",
                accountDetails.getIban(), id);
            throw new RuntimeException("IBAN already exists: " + accountDetails.getIban());
        }

        logger.debug("Updating account fields for ID: {}", id);
        account.setAccountName(accountDetails.getAccountName());
        account.setIban(accountDetails.getIban());
        account.setBalance(accountDetails.getBalance());
        account.setUserId(accountDetails.getUserId());
        account.setType(accountDetails.getType());

        logger.debug("Saving updated account to database - ID: {}", id);
        Account updatedAccount = accountRepository.save(account);
        logger.info("Account with ID: {} updated successfully - New IBAN: {}", id, updatedAccount.getIban());
        logger.debug("Updated account details - Name: {}, Type: {}, Balance: {}",
            updatedAccount.getAccountName(), updatedAccount.getType(), updatedAccount.getBalance());

        return updatedAccount;
    }

    /**
     * Deletes a bank account from the system.
     *
     * @param id The unique identifier of the account to delete
     * @throws ResponseStatusException with NOT_FOUND status if account doesn't exist
     */
    public void delete(Long id) {
        logger.info("Deleting account with ID: {}", id);

        logger.debug("Retrieving account for deletion - ID: {}", id);
        Account account = accountRepository.findById(id).orElseThrow(() -> {
            logger.error("Account not found for deletion - ID: {}", id);
            return new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Account not found with the provided id: " + id);
        });

        logger.debug("Deleting account from database - ID: {}, IBAN: {}", id, account.getIban());
        accountRepository.delete(account);
        logger.info("Account with ID: {} deleted successfully", id);
    }

    /**
     * Retrieves the total count of bank accounts in the system.
     *
     * @return Long value representing the total number of accounts
     */
    public long count() {
        logger.info("Counting total number of accounts in database");

        long totalAccounts = accountRepository.count();
        logger.info("Total accounts count: {}", totalAccounts);
        logger.debug("Database query completed - returning count: {}", totalAccounts);

        return totalAccounts;
    }
}