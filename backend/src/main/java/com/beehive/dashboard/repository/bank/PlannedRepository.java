package com.beehive.dashboard.repository.bank;

import com.beehive.dashboard.entity.bank.Planned;
import com.beehive.dashboard.types.bank.MovementStatus;
import com.beehive.dashboard.types.bank.MovementType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for managing {@link Planned} entities.
 * Provides methods for querying planned by account, type, status, and date range.
 * Extends {@link JpaRepository} to inherit standard CRUD operations.
 *
 * Typical usage includes transaction history retrieval, filtering by type or status,
 * and date-based queries for account planned.
 */
@Repository
public interface PlannedRepository extends JpaRepository<Planned, Long> {

    /**
     * Finds all planned associated with a specific account ID.
     *
     * @param accountId the account ID to search for
     * @return a list of {@link Planned} entities belonging to the account
     */
    List<Planned> findByAccountId(Long accountId);

    /**
     * Finds all planned of a specific type for a given account ID.
     *
     * @param accountId the account ID to search for
     * @param type the planned type to filter by
     * @return a list of {@link Planned} entities matching the type and account
     */
    List<Planned> findByAccountIdAndType(Long accountId, MovementType type);

    /**
     * Finds all planned with a specific status for a given account ID.
     *
     * @param accountId the account ID to search for
     * @param status the planned status to filter by
     * @return a list of {@link Planned} entities matching the status and account
     */
    List<Planned> findByAccountIdAndStatus(Long accountId, MovementStatus status);

    /**
     * Finds all planned for a given account ID within a specific date range.
     *
     * @param accountId the account ID to search for
     * @param startDate the start date of the range (inclusive)
     * @param endDate the end date of the range (inclusive)
     * @return a list of {@link Planned} entities within the date range for the account
     */
    List<Planned> findByAccountIdAndNextExecutionBetween(Long accountId, LocalDate startDate, LocalDate endDate);

    /**
     * Finds all planned for a given account ID, ordered by date descending.
     *
     * @param accountId the account ID to search for
     * @return a list of {@link Planned} entities ordered by date descending
     */
    List<Planned> findByAccountIdOrderByNextExecutionDesc(Long accountId);

    /**
     * Finds all planned movements for all accounts belonging to a user within a specific date range.
     *
     * @param userId the user ID whose accounts to search
     * @param startDate the start date of the range (inclusive)
     * @param endDate the end date of the range (inclusive)
     * @return a list of {@link Planned} entities within the date range for all user accounts
     */
    @Query("SELECT p FROM Planned p WHERE p.accountId IN " +
           "(SELECT a.id FROM Account a WHERE a.userId = :userId) " +
           "AND p.nextExecution BETWEEN :startDate AND :endDate")
    List<Planned> getAllUsersPlannedMovementsByGivenDate(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, 
                                                           @Param("endDate") LocalDate endDate);
}