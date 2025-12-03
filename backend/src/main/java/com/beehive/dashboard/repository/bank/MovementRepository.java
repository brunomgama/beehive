package com.beehive.dashboard.repository.bank;

import com.beehive.dashboard.entity.bank.Movement;
import com.beehive.dashboard.types.bank.MovementStatus;
import com.beehive.dashboard.types.bank.MovementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for managing {@link Movement} entities.
 * Provides methods for querying movements by account, type, status, and date range.
 * Extends {@link JpaRepository} to inherit standard CRUD operations.
 *
 * Typical usage includes transaction history retrieval, filtering by type or status,
 * and date-based queries for account movements.
 */
@Repository
public interface MovementRepository extends JpaRepository<Movement, Long> {

    /**
     * Finds all movements associated with a specific account ID.
     *
     * @param accountId the account ID to search for
     * @return a list of {@link Movement} entities belonging to the account
     */
    List<Movement> findByAccountId(Long accountId);

    /**
     * Finds all movements of a specific type for a given account ID.
     *
     * @param accountId the account ID to search for
     * @param type the movement type to filter by
     * @return a list of {@link Movement} entities matching the type and account
     */
    List<Movement> findByAccountIdAndType(Long accountId, MovementType type);

    /**
     * Finds all movements with a specific status for a given account ID.
     *
     * @param accountId the account ID to search for
     * @param status the movement status to filter by
     * @return a list of {@link Movement} entities matching the status and account
     */
    List<Movement> findByAccountIdAndStatus(Long accountId, MovementStatus status);

    /**
     * Finds all movements for a given account ID within a specific date range.
     *
     * @param accountId the account ID to search for
     * @param startDate the start date of the range (inclusive)
     * @param endDate the end date of the range (inclusive)
     * @return a list of {@link Movement} entities within the date range for the account
     */
    List<Movement> findByAccountIdAndDateBetween(Long accountId, LocalDate startDate, LocalDate endDate);

    /**
     * Finds all movements for a given account ID, ordered by date descending.
     *
     * @param accountId the account ID to search for
     * @return a list of {@link Movement} entities ordered by date descending
     */
    List<Movement> findByAccountIdOrderByDateDesc(Long accountId);

    /**
     * Finds all movements for all accounts belonging to a user within a specific date range.
     *
     * @param userId the user ID whose accounts to search
     * @param startDate the start date of the range (inclusive)
     * @param endDate the end date of the range (inclusive)
     * @return a list of {@link Movement} entities within the date range for all user accounts
     */
    @Query("SELECT m FROM Movement m WHERE m.accountId IN " +
           "(SELECT a.id FROM Account a WHERE a.userId = :userId) " +
           "AND m.date BETWEEN :startDate AND :endDate")
    List<Movement> getAllUsersMovementsByGivenDate(@Param("userId") Long userId, 
                                                     @Param("startDate") LocalDate startDate, 
                                                     @Param("endDate") LocalDate endDate);
}