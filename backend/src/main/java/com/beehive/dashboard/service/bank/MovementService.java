package com.beehive.dashboard.service.bank;

import com.beehive.dashboard.entity.bank.Movement;
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
 * Simplified to focus on CRUD operations and orchestration.
 * Balance management is delegated to AccountBalanceService.
 */
@Service
public class MovementService {

    private static final Logger logger = LoggerFactory.getLogger(MovementService.class);

    @Autowired
    private MovementRepository movementRepository;

    @Autowired
    private BankValidationService validationService;

    @Autowired
    private AccountBalanceService balanceService;

    /**
     * Creates a new bank movement and updates account balance if confirmed.
     */
    public Movement create(Movement movement) {
        logger.info("Creating new movement for account ID: {} - Amount: {}, Type: {}",
            movement.getAccountId(), movement.getAmount(), movement.getType());

        // Validate account exists
        validationService.validateAccountExists(movement.getAccountId());

        // Apply balance change if confirmed
        if (MovementStatus.CONFIRMED.equals(movement.getStatus())) {
            balanceService.applyTransaction(
                movement.getAccountId(), 
                movement.getAmount(), 
                movement.getType()
            );
        }

        Movement savedMovement = movementRepository.save(movement);
        logger.info("Movement created successfully with ID: {}", savedMovement.getId());

        return savedMovement;
    }

    /**
     * Retrieves all bank movements from the database.
     */
    public List<Movement> getAll() {
        logger.info("Retrieving all movements from database");
        return movementRepository.findAll();
    }

    /**
     * Retrieves a specific bank movement by its unique identifier.
     */
    public Movement getById(Long id) {
        logger.info("Retrieving movement with ID: {}", id);

        return movementRepository.findById(id).orElseThrow(() -> {
            logger.error("Movement not found with ID: {}", id);
            return new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Movement not found with the provided id: " + id);
        });
    }

    /**
     * Retrieves all bank movements for a specific account, ordered by date descending.
     */
    public List<Movement> getByAccountId(Long accountId) {
        logger.info("Retrieving movements for account ID: {}", accountId);

        List<Movement> movements = movementRepository.findByAccountIdOrderByDateDesc(accountId);

        if(movements.isEmpty()) {
            logger.warn("No movements found for account ID: {}", accountId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No movements found for account: " + accountId);
        }

        return movements;
    }

    /**
     * Updates an existing bank movement with proper financial rollback.
     */
    public Movement update(Long id, Movement movementDetails) {
        logger.info("Updating movement with ID: {} - New amount: {}", id, movementDetails.getAmount());

        Movement movement = getById(id);
        
        // Validate account exists
        validationService.validateAccountExists(movementDetails.getAccountId());

        // Handle balance changes if status is CONFIRMED (old or new)
        boolean oldConfirmed = MovementStatus.CONFIRMED.equals(movement.getStatus());
        boolean newConfirmed = MovementStatus.CONFIRMED.equals(movementDetails.getStatus());

        if (oldConfirmed && newConfirmed) {
            // Both confirmed: rollback old and apply new
            balanceService.updateTransaction(
                movementDetails.getAccountId(),
                movement.getAmount(),
                movement.getType(),
                movementDetails.getAmount(),
                movementDetails.getType()
            );
        } else if (oldConfirmed && !newConfirmed) {
            // Was confirmed, now not: reverse transaction
            balanceService.reverseTransaction(
                movement.getAccountId(),
                movement.getAmount(),
                movement.getType()
            );
        } else if (!oldConfirmed && newConfirmed) {
            // Wasn't confirmed, now is: apply transaction
            balanceService.applyTransaction(
                movementDetails.getAccountId(),
                movementDetails.getAmount(),
                movementDetails.getType()
            );
        }

        // Update movement fields
        movement.setAccountId(movementDetails.getAccountId());
        movement.setCategory(movementDetails.getCategory());
        movement.setDescription(movementDetails.getDescription());
        movement.setDate(movementDetails.getDate());
        movement.setAmount(movementDetails.getAmount());
        movement.setStatus(movementDetails.getStatus());
        movement.setType(movementDetails.getType());

        Movement updatedMovement = movementRepository.save(movement);
        logger.info("Movement with ID: {} updated successfully", id);

        return updatedMovement;
    }

    /**
     * Deletes a bank movement from the system and reverts account balance changes if confirmed.
     */
    public void delete(Long id) {
        logger.info("Deleting movement with ID: {}", id);

        Movement movement = getById(id);

        // Reverse balance if confirmed
        if (MovementStatus.CONFIRMED.equals(movement.getStatus())) {
            balanceService.reverseTransaction(
                movement.getAccountId(),
                movement.getAmount(),
                movement.getType()
            );
        }

        movementRepository.delete(movement);
        logger.info("Movement with ID: {} deleted successfully", id);
    }

    /**
     * Retrieves the total count of bank movements in the system.
     */
    public long count() {
        logger.info("Counting total number of movements in database");
        return movementRepository.count();
    }

    /**
     * Retrieves bank movements for a specific account filtered by movement type.
     */
    public List<Movement> getByAccountIdAndType(Long accountId, MovementType type) {
        logger.info("Retrieving movements for account ID: {} with type: {}", accountId, type);
        return movementRepository.findByAccountIdAndType(accountId, type);
    }

    /**
     * Retrieves bank movements for a specific account filtered by movement status.
     */
    public List<Movement> getByAccountIdAndStatus(Long accountId, MovementStatus status) {
        logger.info("Retrieving movements for account ID: {} with status: {}", accountId, status);
        return movementRepository.findByAccountIdAndStatus(accountId, status);
    }

    /**
     * Retrieves bank movements for a specific account within a date range.
     */
    public List<Movement> getByAccountIdAndDateRange(Long accountId, LocalDate startDate, LocalDate endDate) {
        logger.info("Retrieving movements for account ID: {} between {} and {}", accountId, startDate, endDate);
        return movementRepository.findByAccountIdAndDateBetween(accountId, startDate, endDate);
    }

    /**
     * Retrieves the count of movements for a specific account.
     */
    public long countByAccountId(Long accountId) {
        logger.info("Counting movements for account ID: {}", accountId);
        return movementRepository.findByAccountId(accountId).size();
    }
}
