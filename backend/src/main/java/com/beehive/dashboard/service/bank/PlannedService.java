package com.beehive.dashboard.service.bank;

import com.beehive.dashboard.entity.bank.Planned;
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
 * Simplified to focus on CRUD operations without balance management.
 * Planned transactions don't affect account balance until they're executed.
 */
@Service
public class PlannedService {

    private static final Logger logger = LoggerFactory.getLogger(PlannedService.class);

    @Autowired
    private PlannedRepository plannedRepository;

    @Autowired
    private BankValidationService validationService;

    /**
     * Creates a new bank planned transaction.
     */
    public Planned create(Planned planned) {
        logger.info("Creating new planned for account ID: {} - Amount: {}, Type: {}",
            planned.getAccountId(), planned.getAmount(), planned.getType());

        // Validate account exists
        validationService.validateAccountExists(planned.getAccountId());

        Planned savedPlanned = plannedRepository.save(planned);
        logger.info("Planned created successfully with ID: {}", savedPlanned.getId());

        return savedPlanned;
    }

    /**
     * Retrieves all bank planned from the database.
     */
    public List<Planned> getAll() {
        logger.info("Retrieving all planned from database");
        return plannedRepository.findAll();
    }

    /**
     * Retrieves a specific bank planned by its unique identifier.
     */
    public Planned getById(Long id) {
        logger.info("Retrieving planned with ID: {}", id);

        return plannedRepository.findById(id).orElseThrow(() -> {
            logger.error("Planned not found with ID: {}", id);
            return new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Planned not found with the provided id: " + id);
        });
    }

    /**
     * Retrieves all bank planned for a specific account, ordered by date descending.
     */
    public List<Planned> getByAccountId(Long accountId) {
        logger.info("Retrieving planned for account ID: {}", accountId);

        List<Planned> planned = plannedRepository.findByAccountIdOrderByNextExecutionDesc(accountId);

        if(planned.isEmpty()) {
            logger.warn("No planned found for account ID: {}", accountId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No planned found for account: " + accountId);
        }

        return planned;
    }

    /**
     * Updates an existing bank planned transaction.
     */
    public Planned update(Long id, Planned plannedDetails) {
        logger.info("Updating planned with ID: {} - New amount: {}", id, plannedDetails.getAmount());

        Planned planned = getById(id);
        
        // Validate account exists
        validationService.validateAccountExists(plannedDetails.getAccountId());

        // Update planned fields
        planned.setAccountId(plannedDetails.getAccountId());
        planned.setCategory(plannedDetails.getCategory());
        planned.setDescription(plannedDetails.getDescription());
        planned.setRecurrence(plannedDetails.getRecurrence());
        planned.setCron(plannedDetails.getCron());
        planned.setNextExecution(plannedDetails.getNextExecution());
        planned.setEndDate(plannedDetails.getEndDate());
        planned.setAmount(plannedDetails.getAmount());
        planned.setStatus(plannedDetails.getStatus());
        planned.setType(plannedDetails.getType());

        Planned updatedPlanned = plannedRepository.save(planned);
        logger.info("Planned with ID: {} updated successfully", id);

        return updatedPlanned;
    }

    /**
     * Deletes a bank planned from the system.
     */
    public void delete(Long id) {
        logger.info("Deleting planned with ID: {}", id);

        Planned planned = getById(id);
        plannedRepository.delete(planned);
        logger.info("Planned with ID: {} deleted successfully", id);
    }

    /**
     * Retrieves the total count of bank planned in the system.
     */
    public long count() {
        logger.info("Counting total number of planned in database");
        return plannedRepository.count();
    }

    /**
     * Retrieves bank planned for a specific account filtered by planned type.
     */
    public List<Planned> getByAccountIdAndType(Long accountId, MovementType type) {
        logger.info("Retrieving planned for account ID: {} with type: {}", accountId, type);
        return plannedRepository.findByAccountIdAndType(accountId, type);
    }

    /**
     * Retrieves bank planned for a specific account filtered by planned status.
     */
    public List<Planned> getByAccountIdAndStatus(Long accountId, MovementStatus status) {
        logger.info("Retrieving planned for account ID: {} with status: {}", accountId, status);
        return plannedRepository.findByAccountIdAndStatus(accountId, status);
    }

    /**
     * Retrieves bank planned for a specific account within a date range.
     */
    public List<Planned> getByAccountIdAndDateRange(Long accountId, LocalDate startDate, LocalDate endDate) {
        logger.info("Retrieving planned for account ID: {} between {} and {}", accountId, startDate, endDate);
        return plannedRepository.findByAccountIdAndNextExecutionBetween(accountId, startDate, endDate);
    }

    /**
     * Retrieves the count of planned for a specific account.
     */
    public long countByAccountId(Long accountId) {
        logger.info("Counting planned for account ID: {}", accountId);
        return plannedRepository.findByAccountId(accountId).size();
    }

    /**
     * Retrieves all planned movements for a user within a date range.
     */
    public List<Planned> getAllUsersPlannedMovementsBetweenDate(Long userId, LocalDate startDate, LocalDate endDate) {
        logger.info("Retrieving all planned for user ID: {} between {} and {}", userId, startDate, endDate);
        return plannedRepository.getAllUsersPlannedMovementsByGivenDate(userId, startDate, endDate);
    }
}
