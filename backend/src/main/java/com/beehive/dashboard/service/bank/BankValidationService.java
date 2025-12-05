package com.beehive.dashboard.service.bank;

import com.beehive.dashboard.entity.bank.Account;
import com.beehive.dashboard.repository.bank.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Service for validating bank-related operations.
 * Centralizes validation logic for accounts, movements, and planned transactions.
 */
@Service
public class BankValidationService {
    
    private static final Logger logger = LoggerFactory.getLogger(BankValidationService.class);

    @Autowired
    private AccountRepository accountRepository;

    /**
     * Validate that an account exists.
     * 
     * @param accountId Account ID to validate
     * @return The validated account
     * @throws ResponseStatusException if account not found
     */
    public Account validateAccountExists(Long accountId) {
        logger.debug("Validating account exists: {}", accountId);
        
        return accountRepository.findById(accountId)
            .orElseThrow(() -> {
                logger.error("Account not found: {}", accountId);
                return new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Account not found with id: " + accountId);
            });
    }

    /**
     * Validate IBAN uniqueness for account creation.
     * 
     * @param iban IBAN to validate
     * @throws ResponseStatusException if IBAN already exists
     */
    public void validateIbanUnique(String iban) {
        logger.debug("Validating IBAN uniqueness: {}", iban);
        
        if (accountRepository.existsByIban(iban)) {
            logger.warn("IBAN already exists: {}", iban);
            throw new ResponseStatusException(HttpStatus.CONFLICT, 
                "IBAN already exists: " + iban);
        }
    }

    /**
     * Validate IBAN uniqueness for account update.
     * 
     * @param accountId Account being updated
     * @param newIban New IBAN value
     * @param currentIban Current IBAN value
     * @throws ResponseStatusException if IBAN already exists for another account
     */
    public void validateIbanUniqueForUpdate(Long accountId, String newIban, String currentIban) {
        logger.debug("Validating IBAN change for account {}: {} -> {}", accountId, currentIban, newIban);
        
        if (!currentIban.equals(newIban) && accountRepository.existsByIban(newIban)) {
            logger.warn("IBAN already exists during update: {}", newIban);
            throw new ResponseStatusException(HttpStatus.CONFLICT, 
                "IBAN already exists: " + newIban);
        }
    }
}
