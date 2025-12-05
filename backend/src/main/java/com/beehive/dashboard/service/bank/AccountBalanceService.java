package com.beehive.dashboard.service.bank;

import com.beehive.dashboard.entity.bank.Account;
import com.beehive.dashboard.repository.bank.AccountRepository;
import com.beehive.dashboard.types.bank.MovementType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Service dedicated to account balance operations.
 * Handles balance updates, validations, and transaction applications.
 */
@Service
public class AccountBalanceService {
    
    private static final Logger logger = LoggerFactory.getLogger(AccountBalanceService.class);

    @Autowired
    private AccountRepository accountRepository;

    /**
     * Apply a transaction to an account balance.
     * 
     * @param accountId Account to update
     * @param amount Transaction amount
     * @param type Transaction type (INCOME/EXPENSE)
     * @return Updated account
     */
    public Account applyTransaction(Long accountId, Double amount, MovementType type) {
        logger.debug("Applying {} transaction of {} to account {}", type, amount, accountId);
        
        Account account = getAccount(accountId);
        
        if (type == MovementType.EXPENSE) {
            validateSufficientFunds(account, amount);
            account.setBalance(account.getBalance() - amount);
        } else {
            account.setBalance(account.getBalance() + amount);
        }
        
        return accountRepository.save(account);
    }

    /**
     * Reverse a transaction from an account balance.
     * 
     * @param accountId Account to update
     * @param amount Transaction amount
     * @param type Original transaction type
     * @return Updated account
     */
    public Account reverseTransaction(Long accountId, Double amount, MovementType type) {
        logger.debug("Reversing {} transaction of {} from account {}", type, amount, accountId);
        
        Account account = getAccount(accountId);
        
        if (type == MovementType.EXPENSE) {
            // Reverse expense: add money back
            account.setBalance(account.getBalance() + amount);
        } else {
            // Reverse income: remove money
            validateSufficientFunds(account, amount);
            account.setBalance(account.getBalance() - amount);
        }
        
        return accountRepository.save(account);
    }

    /**
     * Update account balance with rollback and reapplication.
     * 
     * @param accountId Account to update
     * @param oldAmount Original amount
     * @param oldType Original type
     * @param newAmount New amount
     * @param newType New type
     * @return Updated account
     */
    public Account updateTransaction(Long accountId, Double oldAmount, MovementType oldType, Double newAmount, MovementType newType) {
        logger.debug("Updating transaction on account {} from {}/{} to {}/{}", accountId, oldAmount, oldType, newAmount, newType);
        
        Account account = reverseTransaction(accountId, oldAmount, oldType);
        return applyTransaction(account.getId(), newAmount, newType);
    }

    /**
     * Get account by ID with proper error handling.
     */
    private Account getAccount(Long accountId) {
        return accountRepository.findById(accountId)
            .orElseThrow(() -> {
                logger.error("Account not found: {}", accountId);
                return new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Account not found with id: " + accountId);
            });
    }

    /**
     * Validate account has sufficient funds.
     */
    private void validateSufficientFunds(Account account, Double amount) {
        if (account.getBalance() < amount) {
            logger.warn("Insufficient funds on account {} - Balance: {}, Required: {}",  account.getId(), account.getBalance(), amount);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds on the account");
        }
    }
}
