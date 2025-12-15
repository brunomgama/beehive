package com.beehive.dashboard.controller.authentication;

import com.beehive.dashboard.dto.authentication.SessionResponse;
import com.beehive.dashboard.entity.authentication.User;
import com.beehive.dashboard.service.authentication.AuthenticationService;
import com.beehive.dashboard.service.authentication.SessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing user sessions.
 */
@RestController
@RequestMapping("/v1/sessions")
public class SessionController {

    private static final Logger logger = LoggerFactory.getLogger(SessionController.class);

    @Autowired
    private SessionService sessionService;

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * Gets all active sessions for the current user.
     */
    @GetMapping("/me")
    public ResponseEntity<List<SessionResponse>> getMySessions(@RequestHeader("Authorization") String authHeader) {
        logger.info("Request to get current user sessions");

        try {
            String token = authHeader.substring(7);
            User user = authenticationService.getCurrentUser(token);

            List<SessionResponse> sessions = sessionService.getUserSessions(user.getId(), token);
            logger.info("Retrieved {} sessions for user: {}", sessions.size(), user.getUsername());

            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            logger.error("Failed to retrieve sessions: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Revokes a specific session by ID.
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> revokeSession(@PathVariable Long sessionId, @RequestHeader("Authorization") String authHeader) {
        logger.info("Request to revoke session: {}", sessionId);

        try {
            String token = authHeader.substring(7);
            User user = authenticationService.getCurrentUser(token);

            boolean revoked = sessionService.revokeSession(sessionId, user.getId());
            
            if (revoked) {
                logger.info("Session {} revoked successfully", sessionId);
                return ResponseEntity.ok().build();
            } else {
                logger.warn("Session {} not found or not owned by user", sessionId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Failed to revoke session: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Revokes all sessions except the current one.
     */
    @DeleteMapping("/others")
    public ResponseEntity<Void> revokeAllOtherSessions(@RequestHeader("Authorization") String authHeader) {
        logger.info("Request to revoke all other sessions");

        try {
            String token = authHeader.substring(7);
            User user = authenticationService.getCurrentUser(token);

            sessionService.revokeAllOtherSessions(user.getId(), token);
            logger.info("All other sessions revoked for user: {}", user.getUsername());

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Failed to revoke other sessions: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Revokes all sessions (logout from all devices).
     */
    @DeleteMapping("/all")
    public ResponseEntity<Void> revokeAllSessions(@RequestHeader("Authorization") String authHeader) {
        logger.info("Request to revoke all sessions");

        try {
            String token = authHeader.substring(7);
            User user = authenticationService.getCurrentUser(token);

            sessionService.revokeAllSessions(user.getId());
            logger.info("All sessions revoked for user: {}", user.getUsername());

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Failed to revoke all sessions: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
