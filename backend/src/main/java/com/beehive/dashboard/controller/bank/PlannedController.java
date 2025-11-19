package com.beehive.dashboard.controller.bank;

import com.beehive.dashboard.entity.bank.Planned;
import com.beehive.dashboard.service.bank.PlannedService;
import com.beehive.dashboard.types.bank.MovementStatus;
import com.beehive.dashboard.types.bank.MovementType;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing bank planned (transaction) operations.
 * Provides endpoints for creating, reading, updating, and deleting bank planned,
 * as well as specialized queries for filtering planned by various criteria.
 */
@RestController
@RequestMapping("/v1/bank/planned")
public class PlannedController {

    private static final Logger logger = LoggerFactory.getLogger(PlannedController.class);

    @Autowired
    private PlannedService plannedService;

    /**
     * Creates a new bank planned (transaction) in the system.
     *
     * @param planned Planned entity containing transaction details to be created
     * @return ResponseEntity with created Planned or error message if creation fails
     */
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Planned planned) {
        logger.info("Request to create new planned - Amount: {} for account ID: {}",
            planned.getAmount(), planned.getAccountId());

        try {
            logger.debug("Creating planned with type: {}, description: {}",
                planned.getType(), planned.getDescription());
            Planned createdPlanned = plannedService.create(planned);
            logger.info("Planned created successfully with ID: {} - Amount: {}",
                createdPlanned.getId(), createdPlanned.getAmount());

            return ResponseEntity.status(HttpStatus.CREATED).body(createdPlanned);
        } catch (RuntimeException e) {
            logger.error("Failed to create planned for account ID: {} - Error: {}",
                planned.getAccountId(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Retrieves all bank planned from the system.
     *
     * @return ResponseEntity containing list of all planned
     */
    @GetMapping
    public ResponseEntity<List<Planned>> getAll() {
        logger.info("Request to retrieve all planned");

        List<Planned> planned = plannedService.getAll();
        logger.info("Retrieved {} planned from database", planned.size());
        logger.debug("Planned list size: {}", planned.size());

        return ResponseEntity.status(HttpStatus.OK).body(planned);
    }

    /**
     * Retrieves a specific bank planned by its ID.
     *
     * @param id The unique identifier of the planned to retrieve
     * @return ResponseEntity containing the requested planned or NOT_FOUND if not exists
     */
    @GetMapping("/{id}")
    public ResponseEntity<Planned> getById(@PathVariable Long id) {
        logger.info("Request to retrieve planned with ID: {}", id);

        try {
            Planned planned = plannedService.getById(id);
            logger.info("Successfully retrieved planned with ID: {} - Amount: {}",
                id, planned.getAmount());
            logger.debug("Planned details - Type: {}, Status: {}, Description: {}",
                planned.getType(), planned.getStatus(), planned.getDescription());

            return ResponseEntity.status(HttpStatus.OK).body(planned);
        } catch (RuntimeException e) {
            logger.error("Failed to retrieve planned with ID: {} - Error: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Retrieves all bank planned for a specific account.
     *
     * @param accountId The unique identifier of the account whose planned to retrieve
     * @return ResponseEntity containing list of account planned or NOT_FOUND if no planned exist
     */
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Planned>> getByAccountId(@PathVariable Long accountId) {
        logger.info("Request to retrieve planned for account ID: {}", accountId);

        try {
            List<Planned> planned = plannedService.getByAccountId(accountId);
            logger.info("Successfully retrieved {} planned for account ID: {}",
                planned.size(), accountId);
            logger.debug("Account {} has {} planned", accountId, planned.size());

            return ResponseEntity.status(HttpStatus.OK).body(planned);
        } catch (RuntimeException e) {
            logger.warn("No planned found for account ID: {} - Error: {}", accountId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Updates an existing bank planned with new information.
     *
     * @param id The unique identifier of the planned to update
     * @param planned Planned entity containing updated transaction details
     * @return ResponseEntity with updated Planned or error message if update fails
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Planned planned) {
        logger.info("Request to update planned with ID: {} - New amount: {}", id, planned.getAmount());

        try {
            logger.debug("Updating planned ID: {} with new details - Type: {}, Status: {}",
                id, planned.getType(), planned.getStatus());
            Planned updatedPlanned = plannedService.update(id, planned);
            logger.info("Planned with ID: {} updated successfully", id);
            logger.debug("Updated planned details - Amount: {}, Description: {}",
                updatedPlanned.getAmount(), updatedPlanned.getDescription());

            return ResponseEntity.status(HttpStatus.OK).body(updatedPlanned);
        } catch (RuntimeException e) {
            logger.error("Failed to update planned with ID: {} - Error: {}", id, e.getMessage());

            if (e.getMessage().contains("not found")) {
                logger.warn("Planned with ID: {} not found during update attempt", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Deletes a bank planned from the system.
     *
     * @param id The unique identifier of the planned to delete
     * @return ResponseEntity indicating success or failure of deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        logger.info("Request to delete planned with ID: {}", id);

        try {
            logger.debug("Attempting to delete planned with ID: {}", id);
            plannedService.delete(id);
            logger.info("Planned with ID: {} deleted successfully", id);

            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (RuntimeException e) {
            logger.error("Failed to delete planned with ID: {} - Error: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Retrieves the total count of bank planned in the system.
     *
     * @return ResponseEntity containing the count of planned as a JSON object
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> count() {
        logger.info("Request to get total planned count");

        long count = plannedService.count();
        logger.info("Total planned in system: {}", count);
        logger.debug("Returning planned count: {}", count);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("count", count));
    }

    /**
     * Retrieves bank planned for a specific account filtered by planned type.
     *
     * @param accountId The unique identifier of the account
     * @param type The planned type to filter by (DEPOSIT, WITHDRAWAL, etc.)
     * @return ResponseEntity containing list of filtered planned
     */
    @GetMapping("/account/{accountId}/type/{type}")
    public ResponseEntity<List<Planned>> getByAccountIdAndType(@PathVariable Long accountId, @PathVariable MovementType type) {
        logger.info("Request to retrieve planned for account ID: {} with type: {}", accountId, type);

        List<Planned> planned = plannedService.getByAccountIdAndType(accountId, type);
        logger.info("Retrieved {} planned for account ID: {} with type: {}",
            planned.size(), accountId, type);
        logger.debug("Filtered planned count by type {}: {}", type, planned.size());

        return ResponseEntity.status(HttpStatus.OK).body(planned);
    }

    /**
     * Retrieves bank planned for a specific account filtered by planned status.
     *
     * @param accountId The unique identifier of the account
     * @param status The planned status to filter by (PENDING, COMPLETED, etc.)
     * @return ResponseEntity containing list of filtered planned
     */
    @GetMapping("/account/{accountId}/status/{status}")
    public ResponseEntity<List<Planned>> getByAccountIdAndStatus(@PathVariable Long accountId, @PathVariable MovementStatus status) {
        logger.info("Request to retrieve planned for account ID: {} with status: {}", accountId, status);

        List<Planned> planned = plannedService.getByAccountIdAndStatus(accountId, status);
        logger.info("Retrieved {} planned for account ID: {} with status: {}",
            planned.size(), accountId, status);
        logger.debug("Filtered planned count by status {}: {}", status, planned.size());

        return ResponseEntity.status(HttpStatus.OK).body(planned);
    }

    /**
     * Retrieves bank planned for a specific account within a date range.
     *
     * @param accountId The unique identifier of the account
     * @param startDate The start date for the range filter (ISO date format)
     * @param endDate The end date for the range filter (ISO date format)
     * @return ResponseEntity containing list of planned within the date range
     */
    @GetMapping("/account/{accountId}/date-range")
    public ResponseEntity<List<Planned>> getByAccountIdAndDateRange(@PathVariable Long accountId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        logger.info("Request to retrieve planned for account ID: {} between {} and {}",
            accountId, startDate, endDate);

        List<Planned> planned = plannedService.getByAccountIdAndDateRange(accountId, startDate, endDate);
        logger.info("Retrieved {} planned for account ID: {} in date range {} to {}",
            planned.size(), accountId, startDate, endDate);
        logger.debug("Date range filtered planned count: {}", planned.size());

        return ResponseEntity.status(HttpStatus.OK).body(planned);
    }

    /**
     * Retrieves the count of planned for a specific account.
     *
     * @param accountId The unique identifier of the account
     * @return ResponseEntity containing the count of planned for the account
     */
    @GetMapping("/account/{accountId}/count")
    public ResponseEntity<Map<String, Long>> countByAccountId(@PathVariable Long accountId) {
        logger.info("Request to count planned for account ID: {}", accountId);

        long count = plannedService.countByAccountId(accountId);
        logger.info("Account ID: {} has {} planned", accountId, count);
        logger.debug("Returning planned count for account {}: {}", accountId, count);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("count", count));
    }
}
