package com.beehive.dashboard.service.bank;

import com.beehive.dashboard.entity.bank.Account;
import com.beehive.dashboard.entity.bank.Movement;
import com.beehive.dashboard.repository.bank.AccountRepository;
import com.beehive.dashboard.repository.bank.MovementRepository;
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
 * Service class for managing bank movement (transaction) business logic.
 * Handles movement creation, retrieval, updating, deletion, and account balance management.
 * Ensures proper financial transaction integrity with rollback mechanisms.
 */
@Service
public class MovementService {

    private static final Logger logger = LoggerFactory.getLogger(MovementService.class);

    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private AccountRepository accountRepository;

    /**
     * Creates a new bank movement and updates account balance if confirmed.
     *
     * @param movement Movement entity containing transaction details to be created
     * @return Movement entity representing the newly created movement with generated ID
     * @throws ResponseStatusException with BAD_REQUEST status if account not found or insufficient funds
     */
    public Movement create(Movement movement) {
        logger.info("Creating new movement for account ID: {} - Amount: {}, Type: {}",
            movement.getAccountId(), movement.getAmount(), movement.getType());

        logger.debug("Retrieving account for movement creation - Account ID: {}", movement.getAccountId());
        Account account = accountRepository.findById(movement.getAccountId())
                .orElseThrow(() -> {
                    logger.error("Account not found during movement creation - Account ID: {}", movement.getAccountId());
                    return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Account not found with id: " + movement.getAccountId());
                });

        logger.debug("Movement status: {}, Current account balance: {}", movement.getStatus(), account.getBalance());
        if (movement.getStatus().equals(MovementStatus.CONFIRMED)) {
            if (movement.getType().equals(MovementType.EXPENSE)) {
                if (account.getBalance() <= movement.getAmount()) {
                    logger.warn("Insufficient funds for expense - Account ID: {}, Balance: {}, Amount: {}",
                        movement.getAccountId(), account.getBalance(), movement.getAmount());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds on the account");
                }
                account.setBalance(account.getBalance() - movement.getAmount());
                logger.info("Deducted {} from account ID: {} - New balance: {}",
                    movement.getAmount(), account.getId(), account.getBalance());
            } else {
                account.setBalance(account.getBalance() + movement.getAmount());
                logger.info("Added {} to account ID: {} - New balance: {}",
                    movement.getAmount(), account.getId(), account.getBalance());
            }
            logger.debug("Saving updated account balance to database");
            accountRepository.save(account);
        }

        logger.debug("Saving movement to database - Description: {}", movement.getDescription());
        Movement savedMovement = movementRepository.save(movement);
        logger.info("Movement created successfully with ID: {} for account: {}",
            savedMovement.getId(), savedMovement.getAccountId());

        return savedMovement;
    }

    /**
     * Retrieves all bank movements from the database.
     *
     * @return List of all Movement entities in the system
     */
    public List<Movement> getAll() {
        logger.info("Retrieving all movements from database");

        List<Movement> movements = movementRepository.findAll();
        logger.info("Successfully retrieved {} movements", movements.size());
        logger.debug("Movement retrieval completed - returning {} records", movements.size());

        return movements;
    }

    /**
     * Retrieves a specific bank movement by its unique identifier.
     *
     * @param id The unique identifier of the movement to retrieve
     * @return Movement entity matching the provided ID
     * @throws ResponseStatusException with NOT_FOUND status if movement doesn't exist
     */
    public Movement getById(Long id) {
        logger.info("Retrieving movement with ID: {}", id);

        logger.debug("Searching database for movement ID: {}", id);
        Movement movement = movementRepository.findById(id).orElseThrow(() -> {
            logger.error("Movement not found with ID: {}", id);
            return new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Movement not found with the provided id: " + id);
        });

        logger.info("Successfully retrieved movement with ID: {} - Amount: {}", id, movement.getAmount());
        logger.debug("Movement details - Type: {}, Status: {}, Account ID: {}",
            movement.getType(), movement.getStatus(), movement.getAccountId());

        return movement;
    }

    /**
     * Retrieves all bank movements for a specific account, ordered by date descending.
     *
     * @param accountId The unique identifier of the account whose movements to retrieve
     * @return List of Movement entities belonging to the specified account
     * @throws ResponseStatusException with NOT_FOUND status if no movements exist for the account
     */
    public List<Movement> getByAccountId(Long accountId) {
        logger.info("Retrieving movements for account ID: {}", accountId);

        logger.debug("Searching database for movements belonging to account ID: {}", accountId);
        List<Movement> movements = movementRepository.findByAccountIdOrderByDateDesc(accountId);

        if(movements.isEmpty()) {
            logger.warn("No movements found for account ID: {}", accountId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No movements found for account: " + accountId);
        }

        logger.info("Successfully retrieved {} movements for account ID: {}", movements.size(), accountId);
        logger.debug("Account {} has {} movements ordered by date descending", accountId, movements.size());

        return movements;
    }

    /**
     * Updates an existing bank movement with proper financial rollback and reapplication.
     *
     * @param id The unique identifier of the movement to update
     * @param movementDetails Movement entity containing the updated information
     * @return Movement entity representing the updated movement
     * @throws ResponseStatusException with NOT_FOUND status if movement doesn't exist
     * @throws ResponseStatusException with BAD_REQUEST status if account not found or insufficient funds
     */
    public Movement update(Long id, Movement movementDetails) {
        logger.info("Updating movement with ID: {} - New amount: {}", id, movementDetails.getAmount());

        logger.debug("Retrieving existing movement with ID: {}", id);
        Movement movement = movementRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Movement not found during update - ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Movement not found with the provided id: " + id);
                });

        logger.debug("Retrieving account for movement update - Account ID: {}", movementDetails.getAccountId());
        Account account = accountRepository.findById(movementDetails.getAccountId())
                .orElseThrow(() -> {
                    logger.error("Account not found during movement update - Account ID: {}", movementDetails.getAccountId());
                    return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Account not found with id: " + movementDetails.getAccountId());
                });

        logger.debug("Updating non-financial fields for movement ID: {}", id);
        // Update non-financial fields
        movement.setCategory(movementDetails.getCategory());
        movement.setDescription(movementDetails.getDescription());
        movement.setDate(movementDetails.getDate());

        // Handle financial changes with rollback mechanism
        logger.debug("Processing financial changes with rollback mechanism for movement ID: {}", id);
        updateAccountBasedOnMovementChanges(movementDetails, movement, account);

        logger.debug("Updating financial fields for movement ID: {}", id);
        // Update movement with new values
        movement.setAmount(movementDetails.getAmount());
        movement.setStatus(movementDetails.getStatus());
        movement.setType(movementDetails.getType());

        logger.debug("Saving updated movement to database - ID: {}", id);
        Movement updatedMovement = movementRepository.save(movement);
        logger.info("Movement with ID: {} updated successfully - New amount: {}", id, updatedMovement.getAmount());

        return updatedMovement;
    }

    /**
     * Deletes a bank movement from the system and reverts account balance changes if confirmed.
     *
     * @param id The unique identifier of the movement to delete
     * @throws ResponseStatusException with NOT_FOUND status if movement doesn't exist
     * @throws ResponseStatusException with BAD_REQUEST status if account not found
     */
    public void delete(Long id) {
        logger.info("Deleting movement with ID: {}", id);

        logger.debug("Retrieving movement for deletion - ID: {}", id);
        Movement movement = movementRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Movement not found for deletion - ID: {}", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Movement not found with the provided id: " + id);
                });

        logger.debug("Retrieving account for balance reversal - Account ID: {}", movement.getAccountId());
        Account account = accountRepository.findById(movement.getAccountId())
                .orElseThrow(() -> {
                    logger.error("Account not found during movement deletion - Account ID: {}", movement.getAccountId());
                    return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Account not found with id: " + movement.getAccountId());
                });

        logger.debug("Deleting movement from database - ID: {}", id);
        movementRepository.delete(movement);

        logger.debug("Checking if balance reversal needed - Movement status: {}", movement.getStatus());
        if (movement.getStatus().equals(MovementStatus.CONFIRMED)) {
            if (movement.getType().equals(MovementType.INCOME)) {
                account.setBalance(account.getBalance() - movement.getAmount());
                logger.info("Reverted income deletion: Removed {} from account ID: {} - New balance: {}",
                    movement.getAmount(), account.getId(), account.getBalance());
            } else {
                account.setBalance(account.getBalance() + movement.getAmount());
                logger.info("Reverted expense deletion: Added {} back to account ID: {} - New balance: {}",
                    movement.getAmount(), account.getId(), account.getBalance());
            }
            logger.debug("Saving updated account balance after movement deletion");
            accountRepository.save(account);
        }

        logger.info("Movement with ID: {} deleted successfully", id);
    }

    /**
     * Retrieves the total count of bank movements in the system.
     *
     * @return Long value representing the total number of movements
     */
    public long count() {
        logger.info("Counting total number of movements in database");

        long totalMovements = movementRepository.count();
        logger.info("Total movements count: {}", totalMovements);
        logger.debug("Database query completed - returning count: {}", totalMovements);

        return totalMovements;
    }

    /**
     * Retrieves bank movements for a specific account filtered by movement type.
     *
     * @param accountId The unique identifier of the account
     * @param type The movement type to filter by
     * @return List of Movement entities matching the criteria
     */
    public List<Movement> getByAccountIdAndType(Long accountId, MovementType type) {
        logger.info("Retrieving movements for account ID: {} with type: {}", accountId, type);

        List<Movement> movements = movementRepository.findByAccountIdAndType(accountId, type);
        logger.info("Retrieved {} movements for account ID: {} with type: {}", movements.size(), accountId, type);
        logger.debug("Type filter query completed - returning {} records", movements.size());

        return movements;
    }

    /**
     * Retrieves bank movements for a specific account filtered by movement status.
     *
     * @param accountId The unique identifier of the account
     * @param status The movement status to filter by
     * @return List of Movement entities matching the criteria
     */
    public List<Movement> getByAccountIdAndStatus(Long accountId, MovementStatus status) {
        logger.info("Retrieving movements for account ID: {} with status: {}", accountId, status);

        List<Movement> movements = movementRepository.findByAccountIdAndStatus(accountId, status);
        logger.info("Retrieved {} movements for account ID: {} with status: {}", movements.size(), accountId, status);
        logger.debug("Status filter query completed - returning {} records", movements.size());

        return movements;
    }

    /**
     * Retrieves bank movements for a specific account within a date range.
     *
     * @param accountId The unique identifier of the account
     * @param startDate The start date for the range filter
     * @param endDate The end date for the range filter
     * @return List of Movement entities within the date range
     */
    public List<Movement> getByAccountIdAndDateRange(Long accountId, LocalDate startDate, LocalDate endDate) {
        logger.info("Retrieving movements for account ID: {} between {} and {}", accountId, startDate, endDate);

        List<Movement> movements = movementRepository.findByAccountIdAndDateBetween(accountId, startDate, endDate);
        logger.info("Retrieved {} movements for account ID: {} in date range {} to {}",
            movements.size(), accountId, startDate, endDate);
        logger.debug("Date range query completed - returning {} records", movements.size());

        return movements;
    }

    /**
     * Retrieves the count of movements for a specific account.
     *
     * @param accountId The unique identifier of the account
     * @return Long value representing the number of movements for the account
     */
    public long countByAccountId(Long accountId) {
        logger.info("Counting movements for account ID: {}", accountId);

        long count = movementRepository.findByAccountId(accountId).size();
        logger.info("Account ID: {} has {} movements", accountId, count);
        logger.debug("Account movement count query completed - returning {}", count);

        return count;
    }

    /**
     * Handles financial rollback and reapplication when updating a movement.
     * First reverses the original movement's impact, then applies the new movement's impact.
     *
     * @param movementDetails The new movement details to apply
     * @param movement The original movement being updated
     * @param account The account to update
     * @throws ResponseStatusException if insufficient funds for the operation
     */
    private void updateAccountBasedOnMovementChanges(Movement movementDetails, Movement movement, Account account) {
        logger.debug("Processing rollback for original movement - ID: {}, Amount: {}, Type: {}, Status: {}",
            movement.getId(), movement.getAmount(), movement.getType(), movement.getStatus());

        if (movement.getStatus().equals(MovementStatus.CONFIRMED)) {
            if (movement.getType().equals(MovementType.EXPENSE)) {
                account.setBalance(account.getBalance() + movement.getAmount());
                logger.debug("Rollback expense: Added {} back to account {} - Balance: {}",
                    movement.getAmount(), account.getId(), account.getBalance());
            } else {
                if (account.getBalance() < movement.getAmount()) {
                    logger.warn("Insufficient funds to rollback income for account {} - Balance: {}, Amount: {}",
                        account.getId(), account.getBalance(), movement.getAmount());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds to rollback previous income");
                }
                account.setBalance(account.getBalance() - movement.getAmount());
                logger.debug("Rollback income: Removed {} from account {} - Balance: {}",
                    movement.getAmount(), account.getId(), account.getBalance());
            }
        }

        logger.debug("Applying new movement changes - Amount: {}, Type: {}, Status: {}",
            movementDetails.getAmount(), movementDetails.getType(), movementDetails.getStatus());

        if (movementDetails.getStatus().equals(MovementStatus.CONFIRMED)) {
            if (movementDetails.getType().equals(MovementType.EXPENSE)) {
                if (account.getBalance() < movementDetails.getAmount()) {
                    logger.warn("Insufficient funds for new expense on account {} - Balance: {}, Amount: {}",
                        account.getId(), account.getBalance(), movementDetails.getAmount());
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds for the updated expense");
                }
                account.setBalance(account.getBalance() - movementDetails.getAmount());
                logger.debug("Applied new expense: Deducted {} from account {} - New balance: {}",
                    movementDetails.getAmount(), account.getId(), account.getBalance());
            } else {
                account.setBalance(account.getBalance() + movementDetails.getAmount());
                logger.debug("Applied new income: Added {} to account {} - New balance: {}",
                    movementDetails.getAmount(), account.getId(), account.getBalance());
            }
        }

        logger.debug("Saving updated account balance to database");
        accountRepository.save(account);
        logger.info("Account balance updated successfully for account ID: {} - New balance: {}",
            account.getId(), account.getBalance());
    }
}
