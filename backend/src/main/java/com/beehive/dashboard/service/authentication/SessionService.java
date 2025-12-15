package com.beehive.dashboard.service.authentication;

import com.beehive.dashboard.dto.authentication.SessionResponse;
import com.beehive.dashboard.entity.authentication.UserSession;
import com.beehive.dashboard.repository.authentication.UserSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing user sessions.
 */
@Service
public class SessionService {

    private static final Logger logger = LoggerFactory.getLogger(SessionService.class);

    @Autowired
    private UserSessionRepository sessionRepository;

    @Value("${jwt.expiration:1209600000}") // Default 14 days in milliseconds
    private long sessionExpirationMs;

    /**
     * Creates a new session for a user.
     */
    @Transactional
    public UserSession createSession(Long userId, String token, String userAgent, String ipAddress) {
        logger.info("Creating new session for user: {}", userId);

        UserSession session = new UserSession(token, userId, userAgent, ipAddress);
        session.setExpiresAt(LocalDateTime.now().plusSeconds(sessionExpirationMs / 1000));

        UserSession savedSession = sessionRepository.save(session);
        logger.info("Session created successfully for user: {}, session ID: {}", userId, savedSession.getId());

        return savedSession;
    }

    /**
     * Gets all active sessions for a user.
     */
    public List<SessionResponse> getUserSessions(Long userId, String currentToken) {
        logger.debug("Fetching sessions for user: {}", userId);

        List<UserSession> sessions = sessionRepository.findByUserIdAndIsActiveTrueOrderByLastActiveAtDesc(userId);

        return sessions.stream()
                .map(session -> new SessionResponse(session.getId(), maskToken(session.getSessionToken()),
                        session.getDeviceType(), session.getBrowser(), session.getOs(), maskIpAddress(session.getIpAddress()),
                        session.getCreatedAt(), session.getLastActiveAt(), session.getSessionToken().equals(currentToken)))
                .collect(Collectors.toList());
    }

    /**
     * Updates the last active timestamp for a session.
     */
    @Transactional
    public void updateLastActive(String token) {
        sessionRepository.findBySessionTokenAndIsActiveTrue(token)
                .ifPresent(session -> {
                    session.updateLastActive();
                    sessionRepository.save(session);
                    logger.debug("Updated last active for session: {}", session.getId());
                });
    }

    /**
     * Revokes a specific session.
     */
    @Transactional
    public boolean revokeSession(Long sessionId, Long userId) {
        logger.info("Revoking session {} for user {}", sessionId, userId);

        return sessionRepository.findById(sessionId)
                .filter(session -> session.getUserId().equals(userId))
                .map(session -> {
                    session.setActive(false);
                    sessionRepository.save(session);
                    logger.info("Session {} revoked successfully", sessionId);
                    return true;
                }).orElse(false);
    }

    /**
     * Revokes all sessions for a user except the current one.
     */
    @Transactional
    public void revokeAllOtherSessions(Long userId, String currentToken) {
        logger.info("Revoking all other sessions for user: {}", userId);
        sessionRepository.deactivateAllSessionsExceptCurrent(userId, currentToken);
    }

    /**
     * Revokes all sessions for a user (logout from all devices).
     */
    @Transactional
    public void revokeAllSessions(Long userId) {
        logger.info("Revoking all sessions for user: {}", userId);
        sessionRepository.deactivateAllSessionsForUser(userId);
    }

    /**
     * Validates if a session is active.
     */
    public boolean isSessionActive(String token) {
        return sessionRepository.findBySessionTokenAndIsActiveTrue(token)
            .map(session -> session.getExpiresAt().isAfter(LocalDateTime.now())).orElse(false);
    }

    /**
     * Scheduled task to clean up expired sessions.
     * Runs every hour.
     */
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanupExpiredSessions() {
        logger.info("Running scheduled cleanup of expired sessions");
        sessionRepository.deactivateExpiredSessions(LocalDateTime.now());
        
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        sessionRepository.deleteOldInactiveSessions(cutoffDate);
        logger.info("Expired sessions cleanup completed");
    }

    /**
     * Masks the token for display (shows first 8 and last 6 characters).
     */
    private String maskToken(String token) {
        if (token == null || token.length() < 20) {
            return "***";
        }
        return token.substring(0, 8) + "..." + token.substring(token.length() - 6);
    }

    /**
     * Masks IP address for privacy.
     */
    private String maskIpAddress(String ip) {
        if (ip == null || ip.isEmpty()) {
            return "Unknown";
        }
        // For IPv4, mask the last octet
        if (ip.contains(".")) {
            String[] parts = ip.split("\\.");
            if (parts.length == 4) {
                return parts[0] + "." + parts[1] + "." + parts[2] + ".***";
            }
        }
        return ip;
    }
}
