package com.beehive.dashboard.repository.bank;

import com.beehive.dashboard.entity.bank.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing {@link Account} entities.
 * Provides methods for querying accounts by user ID and checking IBAN existence.
 * Extends {@link JpaRepository} to inherit standard CRUD operations.
 *
 * Typical usage includes account management, user account retrieval, and IBAN validation.
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    /**
     * Finds all accounts associated with a specific user ID.
     *
     * @param id the user ID to search for
     * @return a list of {@link Account} entities belonging to the user
     */
    List<Account> findByUserId(Long id);

    /**
     * Checks if an account exists with the given IBAN.
     *
     * @param iban the IBAN to check
     * @return true if an account exists with the given IBAN, false otherwise
     */
    boolean existsByIban(String iban);
}