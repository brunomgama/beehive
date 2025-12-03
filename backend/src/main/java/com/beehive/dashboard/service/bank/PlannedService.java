package com.beehive.dashboard.service.bank;

import com.beehive.dashboard.entity.bank.Account;
import com.beehive.dashboard.entity.bank.Movement;
import com.beehive.dashboard.entity.bank.Planned;
import com.beehive.dashboard.repository.bank.AccountRepository;
import com.beehive.dashboard.repository.bank.PlannedRepository;
import com.beehive.dashboard.types.bank.MovementStatus;
import com.beehive.dashboard.types.bank.MovementType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

/**
 * Service class for managing bank planned (transaction) business logic.
 * Handles planned creation, retrieval, updating, deletion, and account balance management.
 * Ensures proper financial transaction integrity with rollback mechanisms.
 */
@Service
public class PlannedService {

    private static final Logger logger = LoggerFactory.getLogger(PlannedService.class);

    @Autowired
    private PlannedRepository plannedRepository;

    @Autowired
    private AccountRepository accountRepository;

    /**
     * Creates a new bank planned and updates account balance if confirmed.
     *
     * @param planned Planned entity containing transaction details to be created
     * @return Planned entity representing the newly created planned with generated ID
     * @throws ResponseStatusException with BAD_REQUEST status if account not found or insufficient funds
     */
    public Planned create(Planned planned) {
        logger.info("Creating new planned for account ID: {} - Amount: {}, Type: {}",
            planned.getAccountId(), planned.getAmount(), planned.getType());

        logger.debug("Retrieving account for planned creation - Account ID: {}", planned.getAccountId());
        accountRepository.findById(planned.getAccountId())
                .orElseThrow(() -> {
                    logger.error("Account not found during planned creation - Account ID: {}", planned.getAccountId());
                    return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Account not found with id: " + planned.getAccountId());
                });

        logger.debug("Saving planned to database - Description: {}", planned.getDescription());
        Planned savedPlanned = plannedRepository.save(planned);
        logger.info("Planned created successfully with ID: {} for account: {}",
            savedPlanned.getId(), savedPlanned.getAccountId());

        return savedPlanned;
    }

    /**
     * Retrieves all bank planned from the database.
     *
     * @return List of all Planned entities in the system
     */
    public List<Planned> getAll() {
        logger.info("Retrieving all planned from database");

        List<Planned> planned = plannedRepository.findAll();
        logger.info("Successfully retrieved {} planned", planned.size());
        logger.debug("Planned retrieval completed - returning {} records", planned.size());

        return planned;
    }

    /**
     * Retrieves a specific bank planned by its unique identifier.
     *
     * @param id The unique identifier of the planned to retrieve
     * @return Planned entity matching the provided ID
     * @throws ResponseStatusException with NOT_FOUND status if planned doesn't exist
     */
    public Planned getById(Long id) {
        logger.info("Retrieving planned with ID: {}", id);

        logger.debug("Searching database for planned ID: {}", id);
        Planned planned = plannedRepository.findById(id).orElseThrow(() -> {
            logger.error("Planned not found with ID: {}", id);
            return new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Planned not found with the provided id: " + id);
        });

        logger.info("Successfully retrieved planned with ID: {} - Amount: {}", id, planned.getAmount());
        logger.debug("Planned details - Type: {}, Status: {}, Account ID: {}",
            planned.getType(), planned.getStatus(), planned.getAccountId());

        return planned;
    }

    /**
     * Retrieves all bank planned for a specific account, ordered by date descending.
     *
     * @param accountId The unique identifier of the account whose planned to retrieve
     * @return List of Planned entities belonging to the specified account
     * @throws ResponseStatusException with NOT_FOUND status if no planned exist for the account
     */
    public List<Planned> getByAccountId(Long accountId) {
        logger.info("Retrieving planned for account ID: {}", accountId);

        logger.debug("Searching database for planned belonging to account ID: {}", accountId);
        List<Planned> planned = plannedRepository.findByAccountIdOrderByNextExecutionDesc(accountId);

        if(planned.isEmpty()) {
            logger.warn("No planned found for account ID: {}", accountId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No planned found for account: " + accountId);
        }

        logger.info("Successfully retrieved {} planned for account ID: {}", planned.size(), accountId);
        logger.debug("Account {} has {} planned ordered by date descending", accountId, planned.size());

        return planned;
    }

    /**
     * Updates an existing bank planned with proper financial rollback and reapplication.
     *
     * @param id The unique identifier of the planned to update
     * @param plannedDetails Planned entity containing the updated information
     * @return Planned entity representing the updated planned
     * @throws ResponseStatusException with NOT_FOUND status if planned doesn't exist
     * @throws ResponseStatusException with BAD_REQUEST status if account not found or insufficient funds
     */
    public Planned update(Long id, Planned plannedDetails) {
        logger.info("Updating planned with ID: {} - New amount: {}", id, plannedDetails.getAmount());

        logger.debug("Retrieving existing planned with ID: {}", id);
        Planned planned = plannedRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Planned not found during update - ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Planned not found with the provided id: " + id);
                });

        logger.debug("Retrieving account for planned update - Account ID: {}", plannedDetails.getAccountId());
        accountRepository.findById(plannedDetails.getAccountId())
                .orElseThrow(() -> {
                    logger.error("Account not found during planned update - Account ID: {}", plannedDetails.getAccountId());
                    return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Account not found with id: " + plannedDetails.getAccountId());
                });

        logger.debug("Updating non-financial fields for planned ID: {}", id);
        // Update non-financial fields
        planned.setCategory(plannedDetails.getCategory());
        planned.setDescription(plannedDetails.getDescription());
//        planned.setDate(plannedDetails.getDate());

        // Update planned with new values
        planned.setAmount(plannedDetails.getAmount());
        planned.setStatus(plannedDetails.getStatus());
        planned.setType(plannedDetails.getType());

        logger.debug("Saving updated planned to database - ID: {}", id);
        Planned updatedPlanned = plannedRepository.save(planned);
        logger.info("Planned with ID: {} updated successfully - New amount: {}", id, updatedPlanned.getAmount());

        return updatedPlanned;
    }

    /**
     * Deletes a bank planned from the system and reverts account balance changes if confirmed.
     *
     * @param id The unique identifier of the planned to delete
     * @throws ResponseStatusException with NOT_FOUND status if planned doesn't exist
     * @throws ResponseStatusException with BAD_REQUEST status if account not found
     */
    public void delete(Long id) {
        logger.info("Deleting planned with ID: {}", id);

        logger.debug("Retrieving planned for deletion - ID: {}", id);
        Planned planned = plannedRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Planned not found for deletion - ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Planned not found with the provided id: " + id);
                });

        logger.debug("Retrieving account for balance reversal - Account ID: {}", planned.getAccountId());
        accountRepository.findById(planned.getAccountId())
                .orElseThrow(() -> {
                    logger.error("Account not found during planned deletion - Account ID: {}", planned.getAccountId());
                    return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Account not found with id: " + planned.getAccountId());
                });

        logger.debug("Deleting planned from database - ID: {}", id);
        plannedRepository.delete(planned);
        logger.info("Planned with ID: {} deleted successfully", id);
    }

    /**
     * Retrieves the total count of bank planned in the system.
     *
     * @return Long value representing the total number of planned
     */
    public long count() {
        logger.info("Counting total number of planned in database");

        long totalPlanned = plannedRepository.count();
        logger.info("Total planned count: {}", totalPlanned);
        logger.debug("Database query completed - returning count: {}", totalPlanned);

        return totalPlanned;
    }

    /**
     * Retrieves bank planned for a specific account filtered by planned type.
     *
     * @param accountId The unique identifier of the account
     * @param type The planned type to filter by
     * @return List of Planned entities matching the criteria
     */
    public List<Planned> getByAccountIdAndType(Long accountId, MovementType type) {
        logger.info("Retrieving planned for account ID: {} with type: {}", accountId, type);

        List<Planned> planned = plannedRepository.findByAccountIdAndType(accountId, type);
        logger.info("Retrieved {} planned for account ID: {} with type: {}", planned.size(), accountId, type);
        logger.debug("Type filter query completed - returning {} records", planned.size());

        return planned;
    }

    /**
     * Retrieves bank planned for a specific account filtered by planned status.
     *
     * @param accountId The unique identifier of the account
     * @param status The planned status to filter by
     * @return List of Planned entities matching the criteria
     */
    public List<Planned> getByAccountIdAndStatus(Long accountId, MovementStatus status) {
        logger.info("Retrieving planned for account ID: {} with status: {}", accountId, status);

        List<Planned> planned = plannedRepository.findByAccountIdAndStatus(accountId, status);
        logger.info("Retrieved {} planned for account ID: {} with status: {}", planned.size(), accountId, status);
        logger.debug("Status filter query completed - returning {} records", planned.size());

        return planned;
    }

    /**
     * Retrieves bank planned for a specific account within a date range.
     *
     * @param accountId The unique identifier of the account
     * @param startDate The start date for the range filter
     * @param endDate The end date for the range filter
     * @return List of Planned entities within the date range
     */
    public List<Planned> getByAccountIdAndDateRange(Long accountId, LocalDate startDate, LocalDate endDate) {
        logger.info("Retrieving planned for account ID: {} between {} and {}", accountId, startDate, endDate);

        List<Planned> planned = plannedRepository.findByAccountIdAndNextExecutionBetween(accountId, startDate, endDate);
        logger.info("Retrieved {} planned for account ID: {} in date range {} to {}",
            planned.size(), accountId, startDate, endDate);
        logger.debug("Date range query completed - returning {} records", planned.size());

        return planned;
    }

    /**
     * Retrieves the count of planned for a specific account.
     *
     * @param accountId The unique identifier of the account
     * @return Long value representing the number of planned for the account
     */
    public long countByAccountId(Long accountId) {
        logger.info("Counting planned for account ID: {}", accountId);

        long count = plannedRepository.findByAccountId(accountId).size();
        logger.info("Account ID: {} has {} planned", accountId, count);
        logger.debug("Account planned count query completed - returning {}", count);

        return count;
    }

    /**
     * Handles financial rollback and reapplication when updating a planned.
     * First reverses the original planned's impact, then applies the new planned's impact.
     *
     * @param plannedDetails The new planned details to apply
     * @param planned The original planned being updated
     * @param account The account to update
     * @throws ResponseStatusException if insufficient funds for the operation
     */
    private void updateAccountBasedOnPlannedChanges(Planned plannedDetails, Planned planned, Account account) {
        logger.debug("Processing rollback for original planned - ID: {}, Amount: {}, Type: {}, Status: {}",
            planned.getId(), planned.getAmount(), planned.getType(), planned.getStatus());

        if (planned.getStatus().equals(MovementStatus.CONFIRMED)) {
            if (planned.getType().equals(MovementType.EXPENSE)) {
                account.setBalance(account.getBalance() + planned.getAmount());
                logger.debug("Rollback expense: Added {} back to account {} - Balance: {}",
                    planned.getAmount(), account.getId(), account.getBalance());
            } else {
                if (account.getBalance() < planned.getAmount()) {
                    logger.warn("Insufficient funds to rollback income for account {} - Balance: {}, Amount: {}",
                        account.getId(), account.getBalance(), planned.getAmount());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds to rollback previous income");
                }
                account.setBalance(account.getBalance() - planned.getAmount());
                logger.debug("Rollback income: Removed {} from account {} - Balance: {}",
                    planned.getAmount(), account.getId(), account.getBalance());
            }
        }

        logger.debug("Applying new planned changes - Amount: {}, Type: {}, Status: {}",
            plannedDetails.getAmount(), plannedDetails.getType(), plannedDetails.getStatus());

        if (plannedDetails.getStatus().equals(MovementStatus.CONFIRMED)) {
            if (plannedDetails.getType().equals(MovementType.EXPENSE)) {
                if (account.getBalance() < plannedDetails.getAmount()) {
                    logger.warn("Insufficient funds for new expense on account {} - Balance: {}, Amount: {}",
                        account.getId(), account.getBalance(), plannedDetails.getAmount());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds for the updated expense");
                }
                account.setBalance(account.getBalance() - plannedDetails.getAmount());
                logger.debug("Applied new expense: Deducted {} from account {} - New balance: {}",
                    plannedDetails.getAmount(), account.getId(), account.getBalance());
            } else {
                account.setBalance(account.getBalance() + plannedDetails.getAmount());
                logger.debug("Applied new income: Added {} to account {} - New balance: {}",
                    plannedDetails.getAmount(), account.getId(), account.getBalance());
            }
        }

        logger.debug("Saving updated account balance to database");
        accountRepository.save(account);
        logger.info("Account balance updated successfully for account ID: {} - New balance: {}",
            account.getId(), account.getBalance());
    }

    public List<Planned> getAllUsersPlannedMovementsBetweenDate(Long userId, LocalDate startDate, LocalDate endDate) {
        return accountRepository.findByUserId(userId)
                .stream().flatMap(account -> plannedRepository.findByAccountIdAndNextExecutionBetween(
                        account.getId(), startDate, endDate).stream())
                .toList();
    }
}
