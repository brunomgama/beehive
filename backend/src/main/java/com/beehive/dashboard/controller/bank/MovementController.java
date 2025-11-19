package com.beehive.dashboard.controller.bank;

import com.beehive.dashboard.entity.bank.Movement;
import com.beehive.dashboard.service.bank.MovementService;
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
 * REST controller for managing bank movement (transaction) operations.
 * Provides endpoints for creating, reading, updating, and deleting bank movements,
 * as well as specialized queries for filtering movements by various criteria.
 */
@RestController
@RequestMapping("/v1/bank/movements")
public class MovementController {

    private static final Logger logger = LoggerFactory.getLogger(MovementController.class);

    @Autowired
    private MovementService movementService;

    /**
     * Creates a new bank movement (transaction) in the system.
     *
     * @param movement Movement entity containing transaction details to be created
     * @return ResponseEntity with created Movement or error message if creation fails
     */
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Movement movement) {
        logger.info("Request to create new movement - Amount: {} for account ID: {}",
            movement.getAmount(), movement.getAccountId());

        try {
            logger.debug("Creating movement with type: {}, description: {}",
                movement.getType(), movement.getDescription());
            Movement createdMovement = movementService.create(movement);
            logger.info("Movement created successfully with ID: {} - Amount: {}",
                createdMovement.getId(), createdMovement.getAmount());

            return ResponseEntity.status(HttpStatus.CREATED).body(createdMovement);
        } catch (RuntimeException e) {
            logger.error("Failed to create movement for account ID: {} - Error: {}",
                movement.getAccountId(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Retrieves all bank movements from the system.
     *
     * @return ResponseEntity containing list of all movements
     */
    @GetMapping
    public ResponseEntity<List<Movement>> getAll() {
        logger.info("Request to retrieve all movements");

        List<Movement> movements = movementService.getAll();
        logger.info("Retrieved {} movements from database", movements.size());
        logger.debug("Movement list size: {}", movements.size());

        return ResponseEntity.status(HttpStatus.OK).body(movements);
    }

    /**
     * Retrieves a specific bank movement by its ID.
     *
     * @param id The unique identifier of the movement to retrieve
     * @return ResponseEntity containing the requested movement or NOT_FOUND if not exists
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movement> getById(@PathVariable Long id) {
        logger.info("Request to retrieve movement with ID: {}", id);

        try {
            Movement movement = movementService.getById(id);
            logger.info("Successfully retrieved movement with ID: {} - Amount: {}",
                id, movement.getAmount());
            logger.debug("Movement details - Type: {}, Status: {}, Description: {}",
                movement.getType(), movement.getStatus(), movement.getDescription());

            return ResponseEntity.status(HttpStatus.OK).body(movement);
        } catch (RuntimeException e) {
            logger.error("Failed to retrieve movement with ID: {} - Error: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Retrieves all bank movements for a specific account.
     *
     * @param accountId The unique identifier of the account whose movements to retrieve
     * @return ResponseEntity containing list of account movements or NOT_FOUND if no movements exist
     */
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Movement>> getByAccountId(@PathVariable Long accountId) {
        logger.info("Request to retrieve movements for account ID: {}", accountId);

        try {
            List<Movement> movements = movementService.getByAccountId(accountId);
            logger.info("Successfully retrieved {} movements for account ID: {}",
                movements.size(), accountId);
            logger.debug("Account {} has {} movements", accountId, movements.size());

            return ResponseEntity.status(HttpStatus.OK).body(movements);
        } catch (RuntimeException e) {
            logger.warn("No movements found for account ID: {} - Error: {}", accountId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Updates an existing bank movement with new information.
     *
     * @param id The unique identifier of the movement to update
     * @param movement Movement entity containing updated transaction details
     * @return ResponseEntity with updated Movement or error message if update fails
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Movement movement) {
        logger.info("Request to update movement with ID: {} - New amount: {}", id, movement.getAmount());

        try {
            logger.debug("Updating movement ID: {} with new details - Type: {}, Status: {}",
                id, movement.getType(), movement.getStatus());
            Movement updatedMovement = movementService.update(id, movement);
            logger.info("Movement with ID: {} updated successfully", id);
            logger.debug("Updated movement details - Amount: {}, Description: {}",
                updatedMovement.getAmount(), updatedMovement.getDescription());

            return ResponseEntity.status(HttpStatus.OK).body(updatedMovement);
        } catch (RuntimeException e) {
            logger.error("Failed to update movement with ID: {} - Error: {}", id, e.getMessage());

            if (e.getMessage().contains("not found")) {
                logger.warn("Movement with ID: {} not found during update attempt", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Deletes a bank movement from the system.
     *
     * @param id The unique identifier of the movement to delete
     * @return ResponseEntity indicating success or failure of deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        logger.info("Request to delete movement with ID: {}", id);

        try {
            logger.debug("Attempting to delete movement with ID: {}", id);
            movementService.delete(id);
            logger.info("Movement with ID: {} deleted successfully", id);

            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (RuntimeException e) {
            logger.error("Failed to delete movement with ID: {} - Error: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Retrieves the total count of bank movements in the system.
     *
     * @return ResponseEntity containing the count of movements as a JSON object
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> count() {
        logger.info("Request to get total movement count");

        long count = movementService.count();
        logger.info("Total movements in system: {}", count);
        logger.debug("Returning movement count: {}", count);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("count", count));
    }

    /**
     * Retrieves bank movements for a specific account filtered by movement type.
     *
     * @param accountId The unique identifier of the account
     * @param type The movement type to filter by (DEPOSIT, WITHDRAWAL, etc.)
     * @return ResponseEntity containing list of filtered movements
     */
    @GetMapping("/account/{accountId}/type/{type}")
    public ResponseEntity<List<Movement>> getByAccountIdAndType(@PathVariable Long accountId, @PathVariable MovementType type) {
        logger.info("Request to retrieve movements for account ID: {} with type: {}", accountId, type);

        List<Movement> movements = movementService.getByAccountIdAndType(accountId, type);
        logger.info("Retrieved {} movements for account ID: {} with type: {}",
            movements.size(), accountId, type);
        logger.debug("Filtered movements count by type {}: {}", type, movements.size());

        return ResponseEntity.status(HttpStatus.OK).body(movements);
    }

    /**
     * Retrieves bank movements for a specific account filtered by movement status.
     *
     * @param accountId The unique identifier of the account
     * @param status The movement status to filter by (PENDING, COMPLETED, etc.)
     * @return ResponseEntity containing list of filtered movements
     */
    @GetMapping("/account/{accountId}/status/{status}")
    public ResponseEntity<List<Movement>> getByAccountIdAndStatus(@PathVariable Long accountId, @PathVariable MovementStatus status) {
        logger.info("Request to retrieve movements for account ID: {} with status: {}", accountId, status);

        List<Movement> movements = movementService.getByAccountIdAndStatus(accountId, status);
        logger.info("Retrieved {} movements for account ID: {} with status: {}",
            movements.size(), accountId, status);
        logger.debug("Filtered movements count by status {}: {}", status, movements.size());

        return ResponseEntity.status(HttpStatus.OK).body(movements);
    }

    /**
     * Retrieves bank movements for a specific account within a date range.
     *
     * @param accountId The unique identifier of the account
     * @param startDate The start date for the range filter (ISO date format)
     * @param endDate The end date for the range filter (ISO date format)
     * @return ResponseEntity containing list of movements within the date range
     */
    @GetMapping("/account/{accountId}/date-range")
    public ResponseEntity<List<Movement>> getByAccountIdAndDateRange(@PathVariable Long accountId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        logger.info("Request to retrieve movements for account ID: {} between {} and {}",
            accountId, startDate, endDate);

        List<Movement> movements = movementService.getByAccountIdAndDateRange(accountId, startDate, endDate);
        logger.info("Retrieved {} movements for account ID: {} in date range {} to {}",
            movements.size(), accountId, startDate, endDate);
        logger.debug("Date range filtered movements count: {}", movements.size());

        return ResponseEntity.status(HttpStatus.OK).body(movements);
    }

    /**
     * Retrieves the count of movements for a specific account.
     *
     * @param accountId The unique identifier of the account
     * @return ResponseEntity containing the count of movements for the account
     */
    @GetMapping("/account/{accountId}/count")
    public ResponseEntity<Map<String, Long>> countByAccountId(@PathVariable Long accountId) {
        logger.info("Request to count movements for account ID: {}", accountId);

        long count = movementService.countByAccountId(accountId);
        logger.info("Account ID: {} has {} movements", accountId, count);
        logger.debug("Returning movement count for account {}: {}", accountId, count);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("count", count));
    }
}
