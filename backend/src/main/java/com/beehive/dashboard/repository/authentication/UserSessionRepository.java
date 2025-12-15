package com.beehive.dashboard.repository.authentication;

import com.beehive.dashboard.entity.authentication.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for UserSession entity operations.
 */
@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

    /**
     * Find all active sessions for a user.
     */
    List<UserSession> findByUserIdAndIsActiveTrueOrderByLastActiveAtDesc(Long userId);

    /**
     * Find a session by its token.
     */
    Optional<UserSession> findBySessionToken(String sessionToken);

    /**
     * Find an active session by its token.
     */
    Optional<UserSession> findBySessionTokenAndIsActiveTrue(String sessionToken);

    /**
     * Deactivate all sessions for a user except the current one.
     */
    @Modifying
    @Query("UPDATE UserSession s SET s.isActive = false WHERE s.userId = :userId AND s.sessionToken != :currentToken")
    void deactivateAllSessionsExceptCurrent(@Param("userId") Long userId, @Param("currentToken") String currentToken);

    /**
     * Deactivate all sessions for a user.
     */
    @Modifying
    @Query("UPDATE UserSession s SET s.isActive = false WHERE s.userId = :userId")
    void deactivateAllSessionsForUser(@Param("userId") Long userId);

    /**
     * Deactivate expired sessions.
     */
    @Modifying
    @Query("UPDATE UserSession s SET s.isActive = false WHERE s.expiresAt < :now AND s.isActive = true")
    void deactivateExpiredSessions(@Param("now") LocalDateTime now);

    /**
     * Count active sessions for a user.
     */
    long countByUserIdAndIsActiveTrue(Long userId);

    /**
     * Delete old inactive sessions (cleanup).
     */
    @Modifying
    @Query("DELETE FROM UserSession s WHERE s.isActive = false AND s.lastActiveAt < :cutoffDate")
    void deleteOldInactiveSessions(@Param("cutoffDate") LocalDateTime cutoffDate);
}
